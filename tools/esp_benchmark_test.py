#!/usr/bin/env python3
"""ESP Rowing Monitor Benchmark - Testing Script

This script flashes pre-compiled firmware from different optimization levels
and runs benchmarks by monitoring serial output.

The script expects firmware files in this structure:
    benchmark-firmware/
        O1/
            firmware.bin
            partitions.bin
            bootloader.bin
        O2/
            ...

Usage:
    python esp_benchmark_test.py
    python esp_benchmark_test.py --firmware-dir benchmark-firmware --baudrate 1500000
    python esp_benchmark_test.py --port COM3
"""

from __future__ import annotations

import argparse
import re
import subprocess
import sys
import time
from datetime import datetime
from pathlib import Path
from typing import TYPE_CHECKING, Any, Dict, List, Optional, TypedDict, Tuple

import serial
import serial.tools.list_ports

# Try to import openpyxl (optional dependency)
try:
    from openpyxl import Workbook
    from openpyxl.styles import Alignment, Font, PatternFill
    from openpyxl.utils import get_column_letter
    openpyxl_available = True
except ImportError:
    openpyxl_available = False
    if TYPE_CHECKING:
        from openpyxl import Workbook  # type: ignore
        from openpyxl.styles import Alignment, Font, PatternFill  # type: ignore
        from openpyxl.utils import get_column_letter  # type: ignore

# ==================== TYPE DEFINITIONS ====================


class BenchmarkResult(TypedDict):
    """Type definition for benchmark result data."""
    array_length: int
    exec_time: int
    max_time: int


# ==================== CONFIGURATION CONSTANTS ====================

DEFAULT_BAUDRATE = 1500000
DEFAULT_FIRMWARE_DIR = "benchmark-firmware"
OPTIMIZATION_LEVELS = ["O1", "O2", "O3", "Ofast", "Os"]

# Serial monitoring settings
SERIAL_TIMEOUT = 1.0  # seconds
RECONNECT_DELAY = 2.0  # seconds
MAX_RECONNECT_ATTEMPTS = 10
EXEC_TIME_PATTERN = re.compile(r"EXEC_TIME_(\d+):\s+([\d.]+);\s+max:\s+(\d+)")

# ESP32 flash addresses (for esptool.py)
ESP32_BOOTLOADER_ADDR = "0x1000"
ESP32_PARTITION_ADDR = "0x8000"
ESP32_APP_ADDR = "0x10000"

# S3/S2/C3 variants use different bootloader address
ESP32_VARIANT_BOOTLOADER_ADDR = "0x0000"
ESP32_VARIANT_PARTITION_ADDR = "0x8000"
ESP32_VARIANT_APP_ADDR = "0x10000"

# ==================== UTILITY FUNCTIONS ====================


def find_serial_port(board_hint: Optional[str] = None) -> Optional[str]:
    """Find the serial port for the connected ESP device.
    
    Args:
        board_hint: Optional hint about board type to prioritize certain ports
        
    Returns:
        The serial port device name or None if not found
    """
    ports = list(serial.tools.list_ports.comports())
    
    if not ports:
        return None
    
    # Priority keywords for auto-selecting serial ports
    priority_keywords = [
        "usb-serial", "cp210", "silicon labs", "ch340", "ftdi", "usb2.0-serial"
    ]
    
    # First try to find a port matching priority keywords
    for keyword in priority_keywords:
        for port in ports:
            description = (port.description or "").lower()
            manufacturer = (port.manufacturer or "").lower()
            if keyword in description or keyword in manufacturer:
                print(f"Auto-selected port: {port.device} ({port.description})")
                return port.device
    
    # Otherwise return the first available port
    if ports:
        print(f"Using first available port: {ports[0].device} ({ports[0].description})")
        return ports[0].device
    
    return None


def choose_serial_port() -> Optional[str]:
    """Interactively let the user choose a serial port from the available list.

    Returns:
        The selected port device name or None if cancelled/none available.
    """
    ports = list(serial.tools.list_ports.comports())
    if not ports:
        print("No serial ports detected.")
        return None

    print("Select a serial port:")
    for i, p in enumerate(ports, start=1):
        desc = p.description or ""
        man = p.manufacturer or ""
        print(f"  {i}) {p.device} - {desc} ({man})")

    try:
        choice = input(f"Enter port number (1-{len(ports)}) or press Enter to cancel: ")
        if not choice.strip():
            print("Port selection cancelled")
            return None

        idx = int(choice)
        if idx < 1 or idx > len(ports):
            print("Invalid selection")
            return None

        selected = ports[idx - 1].device
        print(f"Selected port: {selected}")
        return selected

    except (ValueError, KeyboardInterrupt):
        print("Port selection aborted")
        return None


def run_esptool(cmd: List[str]) -> subprocess.CompletedProcess[str]:
    """Run esptool command with a fallback to `python -m esptool` if esptool.py is not on PATH.

    Args:
        cmd: List of command arguments (e.g. ['esptool.py', '--port', port, 'erase-flash'])

    Returns:
        CompletedProcess on success

    Raises:
        subprocess.CalledProcessError if the command runs but returns non-zero
        FileNotFoundError only if both direct and fallback invocation are missing (rare)
    """
    try:
        return subprocess.run(cmd, check=True, capture_output=True, text=True)
    except FileNotFoundError:
        # Try falling back to `python -m esptool ...`
        alt_cmd = [sys.executable, "-m", "esptool"] + cmd[1:]
        print("esptool.py not found on PATH, trying: {}".format(" ".join(alt_cmd)))
        return subprocess.run(alt_cmd, check=True, capture_output=True, text=True)
def detect_reenumerated_port(original_port: str, ports_before: List[Any], timeout: float = 10.0) -> Optional[str]:
    """Detect if the device port changed after flashing and return the new port.

    Strategy:
      1. If original_port reappears, return it.
      2. If a port with the same serial_number appears, return it.
      3. If VID/PID match, return it.
      4. If exactly one new port appears, return it.
      5. If multiple candidates, prompt the user to choose.

    Returns the chosen port or None on timeout.
    """
    # Map original info
    orig_info = None
    for p in ports_before:
        if getattr(p, "device", None) == original_port:
            orig_info = p
            break

    start = time.time()
    prev_devices = {getattr(p, "device", None) for p in ports_before}

    while time.time() - start < timeout:
        time.sleep(0.5)
        current = list(serial.tools.list_ports.comports())
        current_devices = {getattr(p, "device", None) for p in current}

        # If original returned, use it
        if original_port in current_devices:
            return original_port

        # Build candidates (devices not present before)
        new_devices = [p for p in current if getattr(p, "device", None) not in prev_devices]

        # Try serial_number match
        if orig_info is not None and getattr(orig_info, "serial_number", None):
            for p in current:
                if getattr(p, "serial_number", None) == getattr(orig_info, "serial_number", None):
                    return getattr(p, "device", None)

        # Try VID/PID match
        if orig_info is not None and getattr(orig_info, "vid", None) is not None:
            for p in current:
                if getattr(p, "vid", None) == getattr(orig_info, "vid", None) and getattr(p, "pid", None) == getattr(orig_info, "pid", None):
                    return getattr(p, "device", None)

        # If exactly one new device, assume it's the right one
        if len(new_devices) == 1:
            return getattr(new_devices[0], "device", None)

        # If multiple new devices, prompt user
        if len(new_devices) > 1:
            print("Multiple new serial ports detected after flashing:")
            for i, p in enumerate(new_devices, start=1):
                print(f"  {i}) {p.device} - {p.description} ({p.manufacturer})")
            try:
                choice = input(f"Select port (1-{len(new_devices)}) or press Enter to skip: ")
                if not choice.strip():
                    return None
                idx = int(choice)
                if 1 <= idx <= len(new_devices):
                    return getattr(new_devices[idx - 1], "device", None)
            except (ValueError, KeyboardInterrupt):
                return None

        # nothing decisive yet, continue polling

    return None


def list_available_ports() -> List[str]:
    """List all available serial ports."""
    ports = serial.tools.list_ports.comports()
    return [f"{p.device}: {p.description}" for p in ports]


def detect_chip_type_from_metadata(firmware_dir: Path) -> str:
    """Detect chip type from metadata or directory name.
    
    Args:
        firmware_dir: Path to firmware directory
        
    Returns:
        'esp32', 'esp32s3', 'esp32s2', or 'esp32c3'
    """
    # Try to read metadata
    metadata_file = firmware_dir / "metadata.txt"
    if metadata_file.exists():
        content = metadata_file.read_text().lower()
        if "s3" in content or "lolin" in content or "firebeetle2-s3" in content:
            return "esp32s3"
        elif "s2" in content:
            return "esp32s2"
        elif "c3" in content:
            return "esp32c3"
    
    # Default to esp32s3 if S3 in path, otherwise esp32
    if "s3" in str(firmware_dir).lower():
        return "esp32s3"
    
    return "esp32"


def flash_firmware(firmware_dir: Path, optimization: str, port: str, chip_type: str = "esp32") -> Tuple[bool, Optional[str]]:
    """Flash firmware using esptool.py.
    
    Args:
        firmware_dir: Base firmware directory
        optimization: Optimization level folder name
        port: Serial port device name
        chip_type: ESP32 chip type ('esp32', 'esp32s3', etc.)
        
    Returns:
        True if flashing succeeded, False otherwise
    """
    opt_dir = firmware_dir / optimization
    
    # Check if all required files exist
    firmware_file = opt_dir / "firmware.bin"
    partitions_file = opt_dir / "partitions.bin"
    bootloader_file = opt_dir / "bootloader.bin"
    
    if not all([firmware_file.exists(), partitions_file.exists(), bootloader_file.exists()]):
        print(f"✗ Missing firmware files in {opt_dir}")
        return False, None
    
    # Determine flash addresses based on chip type
    if chip_type in ["esp32s3", "esp32s2", "esp32c3"]:
        bootloader_addr = ESP32_VARIANT_BOOTLOADER_ADDR
        partition_addr = ESP32_VARIANT_PARTITION_ADDR
        app_addr = ESP32_VARIANT_APP_ADDR
    else:
        bootloader_addr = ESP32_BOOTLOADER_ADDR
        partition_addr = ESP32_PARTITION_ADDR
        app_addr = ESP32_APP_ADDR
    
    print(f"\n{'='*60}")
    print(f"Flashing firmware: -{optimization}")
    print(f"Chip type: {chip_type}")
    print(f"{'='*60}")
    
    # Record ports before flashing so we can detect re-enumeration
    ports_before = list(serial.tools.list_ports.comports())

    # Erase flash (use --after no-reset per request)
    print("Erasing flash...")
    erase_cmd = ["esptool.py", "--port", port, "--after", "no-reset", "erase-flash"]

    try:
        run_esptool(erase_cmd)
        print("✓ Flash erased")
        # Refresh ports snapshot after a successful erase; device may have re-enumerated
        ports_before = list(serial.tools.list_ports.comports())
    except subprocess.CalledProcessError as e:
        print(f"⚠ Warning: Flash erase failed: {e.stderr}")
        # Maybe the device re-enumerated during erase; try to detect new port and retry erase once
        new_port = detect_reenumerated_port(port, ports_before, timeout=4.0)
        if new_port and new_port != port:
            print(f"Port changed during erase -> retrying erase on {new_port}")
            port = new_port
            erase_cmd_retry = ["esptool.py", "--port", port, "--after", "no-reset", "erase-flash"]
            try:
                run_esptool(erase_cmd_retry)
                print("✓ Flash erased (after port change)")
                # Update snapshot after successful retry erase
                ports_before = list(serial.tools.list_ports.comports())
            except subprocess.CalledProcessError as e2:
                print(f"⚠ Retry erase failed: {e2.stderr}")
                print("  Continuing anyway...")
        else:
            print("  Continuing anyway...")

    # After erase (success or failure) the device may have re-enumerated; detect a new port
    new_port_after_erase = detect_reenumerated_port(port, ports_before, timeout=6.0)
    if new_port_after_erase and new_port_after_erase != port:
        print(f"Port changed during erase -> using {new_port_after_erase} for flashing")
        port = new_port_after_erase
    
    # Flash firmware
    print("Flashing firmware...")
    flash_cmd = [
        "esptool.py",
        "--port", port,
        "--baud", "460800",
        "write_flash",
        bootloader_addr, str(bootloader_file),
        partition_addr, str(partitions_file),
        app_addr, str(firmware_file)
    ]
    
    try:
        run_esptool(flash_cmd)
        print("✓ Firmware flashed successfully")
        # Wait a bit for device to reset and possibly re-enumerate
        time.sleep(1.5)

        # Detect re-enumerated port (if any)
        new_port = detect_reenumerated_port(port, ports_before, timeout=8.0)
        if new_port and new_port != port:
            print(f"Detected new port after flashing: {new_port} (was {port})")
            return True, new_port

        # No change detected, continue with the original port
        time.sleep(1.5)
        return True, port

    except subprocess.CalledProcessError as e:
        print(f"✗ Flashing failed:")
        print(e.stderr)
        # Maybe the device re-enumerated during flashing; try to detect and retry once
        new_port = detect_reenumerated_port(port, ports_before, timeout=6.0)
        if new_port and new_port != port:
            print(f"Port changed during flash -> retrying write on {new_port}")
            port = new_port
            flash_cmd_retry = [
                "esptool.py",
                "--port", port,
                "--baud", "460800",
                "write_flash",
                bootloader_addr, str(bootloader_file),
                partition_addr, str(partitions_file),
                app_addr, str(firmware_file)
            ]
            try:
                run_esptool(flash_cmd_retry)
                print("✓ Firmware flashed successfully (after port change)")
                time.sleep(1.5)
                # Update snapshot after successful retry flash
                ports_before = list(serial.tools.list_ports.comports())
                # detect post-flash re-enumeration
                final_port = detect_reenumerated_port(port, ports_before, timeout=6.0)
                return True, final_port or port
            except subprocess.CalledProcessError as e2:
                print(f"✗ Retry flashing failed:")
                print(e2.stderr)
                return False, None
        return False, None


def monitor_serial_output(port: str, baudrate: int) -> List[BenchmarkResult]:
    """Monitor serial output and extract EXEC_TIME metrics.
    
    Automatically reconnects if the connection is lost.
    Continues until all EXEC_TIME_21 results (3 occurrences) are collected.
    
    Args:
        port: Serial port device name
        baudrate: Serial baudrate
        
    Returns:
        List of dictionaries containing extracted metrics
    """
    results: List[BenchmarkResult] = []
    exec_time_counts: Dict[int, int] = {}  # Track how many times each EXEC_TIME_xx appears
    reconnect_attempts = 0
    ser = None
    
    print(f"\n{'='*60}")
    print(f"Monitoring serial output on {port} @ {baudrate} baud")
    print(f"Waiting for benchmark results...")
    print(f"{'='*60}\n")
    
    while True:
        try:
            # Open serial connection if not already open
            if ser is None or not ser.is_open:
                if reconnect_attempts >= MAX_RECONNECT_ATTEMPTS:
                    print(f"✗ Max reconnect attempts ({MAX_RECONNECT_ATTEMPTS}) reached")
                    break
                
                try:
                    ser = serial.Serial(port, baudrate, timeout=SERIAL_TIMEOUT)
                    print(f"✓ Connected to {port}")
                    reconnect_attempts = 0
                except serial.SerialException as e:
                    reconnect_attempts += 1
                    print(f"⚠ Connection failed (attempt {reconnect_attempts}): {e}")
                    time.sleep(RECONNECT_DELAY)
                    continue
            
            # Read line from serial
            try:
                line = ser.readline().decode('utf-8', errors='ignore').strip()
                
                if not line:
                    continue
                
                # Print the line for monitoring
                if line:
                    print(line)
                
                # Check for EXEC_TIME pattern
                match = EXEC_TIME_PATTERN.search(line)
                if match:
                    array_length = int(match.group(1))
                    exec_time = float(match.group(2))
                    max_time = int(match.group(3))
                    
                    # Track occurrence count
                    exec_time_counts[array_length] = exec_time_counts.get(array_length, 0) + 1
                    occurrence = exec_time_counts[array_length]
                    
                    # Only store the third occurrence
                    if occurrence == 3:
                        result: BenchmarkResult = {
                            'array_length': array_length,
                            'exec_time': int(exec_time),  # Remove decimal part
                            'max_time': max_time
                        }
                        results.append(result)
                        print(f"  ✓ Captured: EXEC_TIME_{array_length} = {int(exec_time)}μs (max: {max_time}μs)")
                    
                    # Check if we have all results up to array_length 21
                    if array_length == 21 and occurrence == 3:
                        print(f"\n✓ All benchmark results collected!")
                        break
                        
            except serial.SerialException as e:
                print(f"⚠ Serial connection lost: {e}")
                print(f"  Reconnecting in {RECONNECT_DELAY}s...")
                if ser:
                    ser.close()
                    ser = None
                time.sleep(RECONNECT_DELAY)
                reconnect_attempts += 1
                continue
                
        except KeyboardInterrupt:
            print("\n✗ Monitoring interrupted by user")
            break
    
    if ser and ser.is_open:
        ser.close()
    
    # Sort results by array_length
    results.sort(key=lambda x: x['array_length'])
    
    return results


def export_to_excel(all_results: Dict[str, List[BenchmarkResult]], output_file: str, firmware_dir: Path) -> None:
    """Export benchmark results to an Excel file.
    
    Args:
        all_results: Dictionary mapping optimization level to list of results
        output_file: Output Excel file path
    """
    if not openpyxl_available:
        print("✗ Error: openpyxl not installed. Cannot export to Excel.")
        print("Install with: pip install openpyxl")
        return
    
    def read_metadata(fd: Path) -> Dict[str, str]:
        keys = {"compiled_date": "", "board": "", "rower": "", "environment": ""}
        meta_file = fd / "metadata.txt"
        if not meta_file.exists():
            return keys

        txt = meta_file.read_text(encoding="utf-8", errors="ignore")
        for line in txt.splitlines():
            l = line.strip()
            if not l:
                continue
            m = re.match(r"(?i)\s*compiled(?: date)?\s*[:=]\s*(.+)", l)
            if m:
                keys["compiled_date"] = m.group(1).strip()
                continue
            m = re.match(r"(?i)\s*board\s*[:=]\s*(.+)", l)
            if m:
                keys["board"] = m.group(1).strip()
                continue
            m = re.match(r"(?i)\s*(rower|profile)\s*[:=]\s*(.+)", l)
            if m:
                keys["rower"] = m.group(2).strip()
                continue
            m = re.match(r"(?i)\s*(environment|env)\s*[:=]\s*(.+)", l)
            if m:
                keys["environment"] = m.group(2).strip()
                continue
        return keys

    wb = Workbook()
    ws = wb.active
    if ws is None:
        print("✗ Error: Could not create worksheet")
        return

    # Read metadata and set worksheet title to board name (safe truncation)
    meta = read_metadata(Path(firmware_dir))
    sheet_title = meta.get("board") or "Benchmark Results"
    # Excel sheet names max length 31
    ws.title = sheet_title[:31]
    
    # Header styling
    header_fill = PatternFill(start_color="366092", end_color="366092", fill_type="solid")
    header_font = Font(bold=True, color="FFFFFF")

    # Metadata rows (top)
    meta_rows: List[Tuple[str, str]] = []
    if meta.get("compiled_date"):
        meta_rows.append(("Compiled Date", str(meta.get("compiled_date") or "")))
    meta_rows.append(("Board", str(meta.get("board") or "")))
    meta_rows.append(("Rower Profile", str(meta.get("rower") or "")))
    meta_rows.append(("Environment", str(meta.get("environment") or "")))

    # Write metadata starting at row 1
    for i, (label, value) in enumerate(meta_rows, start=1):
        ws.cell(row=i, column=1, value=label)
        ws.cell(row=i, column=2, value=value)

    # Start of table (leave one empty row after metadata)
    table_top = len(meta_rows) + 2

    # Build header columns: first column is Array Length (merged across two header rows)
    col = 1
    ws.merge_cells(start_row=table_top, start_column=col, end_row=table_top + 1, end_column=col)
    cell = ws.cell(row=table_top, column=col, value="Array Length")
    cell.fill = header_fill
    cell.font = header_font
    cell.alignment = Alignment(horizontal="center", vertical="center")

    # For each optimization that has results, create a merged header spanning two cols and subheaders Avg/Max
    col += 1
    used_opts = [opt for opt in OPTIMIZATION_LEVELS if opt in all_results]
    for opt in used_opts:
        start_col = col
        end_col = col + 1
        # Top merged header with optimization name
        ws.merge_cells(start_row=table_top, start_column=start_col, end_row=table_top, end_column=end_col)
        top_cell = ws.cell(row=table_top, column=start_col, value=f"-{opt}")
        top_cell.fill = header_fill
        top_cell.font = header_font
        top_cell.alignment = Alignment(horizontal="center", vertical="center")

        # Subheaders
        avg_cell = ws.cell(row=table_top + 1, column=start_col, value="Avg (μs)")
        max_cell = ws.cell(row=table_top + 1, column=end_col, value="Max (μs)")
        for c in (avg_cell, max_cell):
            c.fill = header_fill
            c.font = header_font
            c.alignment = Alignment(horizontal="center", vertical="center")

        col += 2

    # Get all array lengths (should be 3-21)
    array_lengths_set: set[int] = set()
    for results in all_results.values():
        array_lengths_set.update(r['array_length'] for r in results)
    array_lengths: List[int] = sorted(array_lengths_set)

    # Write data rows
    data_start_row = table_top + 2
    for row_offset, array_length in enumerate(array_lengths):
        row_idx = data_start_row + row_offset
        ws.cell(row=row_idx, column=1, value=array_length)
        col = 2
        for opt in used_opts:
            result = next((r for r in all_results[opt] if r['array_length'] == array_length), None)
            if result:
                ws.cell(row=row_idx, column=col, value=result['exec_time'])
                ws.cell(row=row_idx, column=col + 1, value=result['max_time'])
            else:
                ws.cell(row=row_idx, column=col, value="N/A")
                ws.cell(row=row_idx, column=col + 1, value="N/A")
            col += 2
    
    # Auto-adjust column widths
    # - Size 'Array Length' column to fit the header or the widest data value
    # - Size numeric columns (Avg/Max) to fit their header text plus a small padding
    def _text_width(s: str) -> int:
        # Simple heuristic: width ~ character count; add a little padding
        return max(8, len(s))

    # Determine width for first column (Array Length)
    array_header = "Array Length"
    max_array_value_width = max((len(str(x)) for x in array_lengths), default=len(array_header))
    first_col_width = max(_text_width(array_header), max_array_value_width + 2)
    ws.column_dimensions[get_column_letter(1)].width = first_col_width

    # Start from second column and size based on header text
    col_idx = 2
    for opt in used_opts:
        avg_header = "Avg (μs)"
        max_header = "Max (μs)"
        ws.column_dimensions[get_column_letter(col_idx)].width = _text_width(avg_header)
        ws.column_dimensions[get_column_letter(col_idx + 1)].width = _text_width(max_header)
        col_idx += 2
    
    # Save workbook
    wb.save(output_file)
    print(f"\n✓ Results exported to {output_file}")


def print_summary_table(timing_info: Dict[str, Dict[str, float]]) -> None:
    """Print an ASCII summary table of timings per optimization.

    Columns: Optimization | Flash Time | Monitor Time | Data Points | Total
    """
    if not timing_info:
        return

    # Build rows
    # rows: List[Tuple[str, float, float, int, float]]
    rows: List[Tuple[str, float, float, int, float]] = []
    total_flash = 0.0
    total_monitor = 0.0
    total_points = 0
    for opt, info in timing_info.items():
        ftime = float(info.get('flash_time', 0.0))
        mtime = float(info.get('monitor_time', 0.0))
        points = int(info.get('data_points', 0))
        total = ftime + mtime
        rows.append((opt, ftime, mtime, points, total))
        total_flash += ftime
        total_monitor += mtime
        total_points += points

    # Column widths
    col1 = max(len('Optimization'), max((len(r[0]) for r in rows), default=0))
    col2 = len('Flash Time')
    col3 = len('Monitor Time')
    col4 = len('Data Points')
    col5 = len('Total')

    sep = ' | '
    header = f"{ 'Optimization'.ljust(col1) }{sep}{'Flash Time'.rjust(col2)}{sep}{'Monitor Time'.rjust(col3)}{sep}{'Data Points'.rjust(col4)}{sep}{'Total'.rjust(col5)}"
    line = '-' * len(header)

    print('\n' + line)
    print(header)
    print(line)

    for r in rows:
        opt, ftime, mtime, points, total = r
        print(f"{opt.ljust(col1)}{sep}{format_duration(ftime).rjust(col2)}{sep}{format_duration(mtime).rjust(col3)}{sep}{str(points).rjust(col4)}{sep}{format_duration(total).rjust(col5)}")

    print(line)
    print(f"{'TOTAL'.ljust(col1)}{sep}{format_duration(total_flash).rjust(col2)}{sep}{format_duration(total_monitor).rjust(col3)}{sep}{str(total_points).rjust(col4)}{sep}{format_duration(total_flash + total_monitor).rjust(col5)}")


def format_duration(seconds: float) -> str:
    """Format seconds to human-friendly H:MM:SS or S.ms"""
    try:
        seconds = float(seconds)
    except Exception:
        return '0s'

    if seconds >= 3600:
        hrs = int(seconds // 3600)
        mins = int((seconds % 3600) // 60)
        secs = seconds % 60
        return f"{hrs}:{mins:02d}:{secs:04.1f}"
    if seconds >= 60:
        mins = int(seconds // 60)
        secs = seconds % 60
        return f"{mins}:{secs:04.1f}"
    if seconds >= 1.0:
        return f"{seconds:0.2f}s"
    return f"{seconds*1000:0.0f}ms"


# ==================== MAIN FUNCTION ====================


def main():
    """Main execution function."""
    parser = argparse.ArgumentParser(
        description="ESP Rowing Monitor Benchmark - Testing Script",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  %(prog)s
  %(prog)s --firmware-dir benchmark-firmware --baudrate 1500000
  %(prog)s --port COM3 --optimizations O2 O3
  %(prog)s --skip-flash  # Only monitor, don't flash
        """
    )
    
    parser.add_argument(
        "--firmware-dir",
        default=DEFAULT_FIRMWARE_DIR,
        help=f"Firmware directory (default: {DEFAULT_FIRMWARE_DIR})"
    )
    
    parser.add_argument(
        "--baudrate",
        type=int,
        default=DEFAULT_BAUDRATE,
        help=f"Serial baudrate (default: {DEFAULT_BAUDRATE})"
    )
    
    parser.add_argument(
        "--port",
        help="Serial port (auto-detected if not specified)"
    )

    parser.add_argument(
        "--choose-port",
        action="store_true",
        help="Interactively choose a serial port from a list"
    )
    
    parser.add_argument(
        "--optimizations",
        nargs="+",
        choices=OPTIMIZATION_LEVELS,
        help="Specific optimization levels to test (default: all found in firmware-dir)"
    )
    
    parser.add_argument(
        "--output",
        default="",
        help="Output Excel file name (default: <firmware-dir>_YYYYmmdd_HHMMSS.xlsx)"
    )
    
    parser.add_argument(
        "--skip-flash",
        action="store_true",
        help="Skip flashing step (only monitor serial)"
    )
    
    parser.add_argument(
        "--list-ports",
        action="store_true",
        help="List available serial ports and exit"
    )
    
    parser.add_argument(
        "--chip-type",
        choices=["esp32", "esp32s3", "esp32s2", "esp32c3"],
        help="ESP32 chip type (auto-detected from metadata if not specified)"
    )
    
    args = parser.parse_args()
    
    # List ports if requested
    if args.list_ports:
        print("Available serial ports:")
        for port in list_available_ports():
            print(f"  {port}")
        return 0
    
    # Check firmware directory
    firmware_dir = Path(args.firmware_dir)
    if not firmware_dir.exists():
        print(f"✗ Error: Firmware directory not found: {firmware_dir}")
        print(f"  Please run esp_benchmark_compile.py first")
        return 1
    
    # Detect chip type
    chip_type = args.chip_type or detect_chip_type_from_metadata(firmware_dir)
    
    # Find available optimizations
    available_opts: List[str] = []
    for opt in OPTIMIZATION_LEVELS:
        opt_dir = firmware_dir / opt
        if opt_dir.exists() and opt_dir.is_dir():
            available_opts.append(opt)
    
    if not available_opts:
        print(f"✗ Error: No optimization folders found in {firmware_dir}")
        print(f"  Expected folders: {', '.join(OPTIMIZATION_LEVELS)}")
        return 1
    
    # Use specified optimizations or all available
    test_opts: List[str] = args.optimizations if args.optimizations else available_opts
    
    # Filter to only available optimizations
    test_opts = [opt for opt in test_opts if opt in available_opts]
    
    if not test_opts:
        print(f"✗ Error: None of the specified optimizations are available")
        print(f"  Available: {', '.join(available_opts)}")
        return 1
    
    # Find serial port: interactive selection is the default unless user passed --port
    if args.port:
        port = args.port
    else:
        port = choose_serial_port()
        if not port:
            print("✗ No port selected. Please rerun with --port <device> or use --list-ports to inspect available ports.")
            print("\nAvailable ports:")
            for p in list_available_ports():
                print(f"  {p}")
            return 1
    
    print(f"\n{'='*60}")
    print(f"ESP Rowing Monitor Benchmark - Testing")
    print(f"{'='*60}")
    print(f"Firmware Dir:  {firmware_dir.absolute()}")
    print(f"Chip Type:     {chip_type}")
    print(f"Port:          {port}")
    print(f"Baudrate:      {args.baudrate}")
    print(f"Optimizations: {', '.join(['-' + opt for opt in test_opts])}")
    # Determine output path: default to using the firmware directory name + timestamp
    if args.output:
        output_path = Path(args.output)
        if not output_path.is_absolute():
            output_path = firmware_dir / output_path
    else:
        stamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        folder_name = firmware_dir.name or 'benchmark_results'
        filename = f"{folder_name}_{stamp}.xlsx"
        output_path = firmware_dir / filename

    print(f"Output:        {output_path}")
    print(f"{'='*60}\n")
    
    # Confirm before starting
    if not args.skip_flash:
        input("Press Enter to start benchmarking...")
    
    all_results: Dict[str, List[BenchmarkResult]] = {}
    # Timing information per optimization
    timing_info: Dict[str, Dict[str, float]] = {}
    
    # Run benchmark for each optimization level
    for optimization in test_opts:
        print(f"\n\n{'#'*60}")
        print(f"# Testing optimization: -{optimization}")
        print(f"{'#'*60}\n")
        
        # Flash firmware
        flash_start = time.time()
        if not args.skip_flash:
            success, flashed_port = flash_firmware(firmware_dir, optimization, port, chip_type)
            if not success:
                print(f"✗ Skipping -{optimization} due to flashing error")
                continue
            # If flashing caused the device port to change, use the new port for monitoring
            if flashed_port and flashed_port != port:
                port = flashed_port
        flash_end = time.time()
        # Print flash duration for this optimization
        print(f"Flash time for -{optimization}: {format_duration(max(0.0, flash_end - flash_start))}")
        
        # Monitor serial output and collect results
        monitor_start = time.time()
        results = monitor_serial_output(port, args.baudrate)
        monitor_end = time.time()
        # Print monitor duration for this optimization
        print(f"Monitor time for -{optimization}: {format_duration(max(0.0, monitor_end - monitor_start))}")

        # Record timing
        timing_info[optimization] = {
            'flash_time': max(0.0, flash_end - flash_start),
            'monitor_time': max(0.0, monitor_end - monitor_start),
            'data_points': float(len(results) if results else 0)
        }
        
        if results:
            all_results[optimization] = results
            print(f"\n✓ Collected {len(results)} data points for -{optimization}")
        else:
            print(f"\n⚠ No results collected for -{optimization}")
    
    # Export results to Excel
    if all_results:
        print(f"\n✓ Benchmarking complete!")
        export_to_excel(all_results, str(output_path), firmware_dir)
        print(f"\n{'='*60}")
        print(f"Benchmark Summary")
        print(f"{'='*60}")
        # Print timing summary table
        print_summary_table(timing_info)
    else:
        print("\n✗ No results collected from any optimization level")
        return 1
    
    return 0


if __name__ == "__main__":
    sys.exit(main())
