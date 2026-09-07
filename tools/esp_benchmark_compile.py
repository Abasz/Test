#!/usr/bin/env python3
"""ESP Rowing Monitor Benchmark - Compilation Script

This script compiles the ESP Rowing Monitor firmware with different optimization
levels and copies the necessary files to a benchmark-firmware directory structure.

The compiled binaries can then be transferred to a testing machine for flashing
and benchmarking.

Output Structure:
    benchmark-firmware/
        O1/
            firmware.bin
            partitions.bin
            bootloader.bin
        O2/
            firmware.bin
            partitions.bin
            bootloader.bin
        O3/
            firmware.bin
            partitions.bin
            bootloader.bin
        Ofast/
            firmware.bin
            partitions.bin
            bootloader.bin

Usage:
    python esp_benchmark_compile.py --board lolinS3-mini
    python esp_benchmark_compile.py --board devkit-v1 --optimizations O2 O3
"""

from __future__ import annotations

import argparse
import re
import shutil
import subprocess
import sys
import time
from pathlib import Path
from typing import List, Tuple

# ==================== CONFIGURATION CONSTANTS ====================

DEFAULT_BOARD = "lolinS3-mini"
DEFAULT_ROWER = "genericAir"
OPTIMIZATION_LEVELS = ["O1", "O2", "O3", "Ofast", "Os"]

# Compilation settings
PLATFORMIO_INI = "platformio.ini"
FIRMWARE_DIR = ".pio/build"
OUTPUT_DIR = "benchmark-firmware"

# ==================== UTILITY FUNCTIONS ====================


def build_modified_ini_content(original_content: str, optimization: str, board: str) -> str:
    """Return a modified platformio.ini content for the given optimization.

    For normal optimizations (O1, O2, O3, Ofast) this sets the -Ox flag in the
    target board section. For Os the function removes any explicit -O flags in
    the board section and removes any "-Os" lines from build_unflags so that
    PlatformIO will fall back to its default optimization (-Os) when building.

    This function does not write the file; the caller should back up and
    restore the original file around compilation.
    """
    content = original_content

    # Board-specific pattern: capture section up to build_flags and any existing -O flag
    opt_pattern = re.compile(
        rf"(\[{board}-board\].*?build_flags\s*=.*?)(-O[^\s\n]+)",
        re.DOTALL | re.MULTILINE,
    )

    if optimization != "Os":
        # Set explicit -O flag for the board section
        replacement = rf"\1-{optimization}"
        new_content = opt_pattern.sub(replacement, content)
    else:
        # Remove any explicit -O flags from the board section so default applies
        new_content = opt_pattern.sub(r"\1", content)

        # Also remove any '-Os' tokens from any line (commonly present in build_unflags)
        # Use a capture-group to avoid lookbehind (which needs fixed width)
        # Replace '(<start or space>)-Os(<space or end>)' with the captured prefix
        new_content = re.sub(r"(^|\s)-Os(?=\s|$)", r"\1", new_content, flags=re.MULTILINE)

        # Clean up possible duplicate spaces left after removal
        new_content = re.sub(r"[ \t]{2,}", " ", new_content)

    return new_content


def compile_firmware(board: str, rower: str, optimization: str, project_conf: Path | None = None) -> bool:
    """Compile the firmware using PlatformIO.
    
    Args:
        board: Board profile name
        rower: Rower profile name  
        optimization: Optimization level
        
    Returns:
        True if compilation succeeded, False otherwise
    """
    env_name = f"{rower}-{board}"
    
    print(f"\n{'='*60}")
    print(f"Compiling: {env_name} with -{optimization}")
    print(f"{'='*60}")
    
    # Build command
    cmd = ["pio", "run", "-e", env_name]
    if project_conf is not None:
        cmd.extend(["--project-conf", str(project_conf)])
    
    try:
        subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            check=True
        )
        
        print("✓ Compilation successful")
        return True
        
    except subprocess.CalledProcessError as e:
        print(f"✗ Compilation failed:")
        print(e.stderr)
        return False


def copy_firmware_files(board: str, rower: str, optimization: str, output_base: Path) -> bool:
    """Copy firmware binaries to the output directory.
    
    Args:
        board: Board profile name
        rower: Rower profile name
        optimization: Optimization level
        output_base: Base output directory path
        
    Returns:
        True if all files were copied successfully, False otherwise
    """
    env_name = f"{rower}-{board}"
    build_dir = Path(FIRMWARE_DIR) / env_name
    output_dir = output_base / optimization
    
    # Create output directory
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Files to copy
    files_to_copy = [
        "firmware.bin",
        "partitions.bin",
        "bootloader.bin"
    ]
    
    print(f"\nCopying firmware files for -{optimization}...")
    
    success = True
    for filename in files_to_copy:
        src_file = build_dir / filename
        dst_file = output_dir / filename
        
        if src_file.exists():
            shutil.copy2(src_file, dst_file)
            print(f"  ✓ Copied {filename}")
        else:
            print(f"  ✗ Warning: {filename} not found at {src_file}")
            success = False
    
    if success:
        print(f"✓ All files copied to {output_dir}")
    
    return success


def create_metadata_file(board: str, rower: str, optimizations: List[str], output_base: Path) -> None:
    """Create a metadata file with compilation info.
    
    Args:
        board: Board profile name
        rower: Rower profile name
        optimizations: List of optimization levels compiled
        output_base: Base output directory path
    """
    from datetime import datetime
    
    metadata_file = output_base / "metadata.txt"
    
    with open(metadata_file, 'w') as f:
        f.write("ESP Rowing Monitor - Benchmark Firmware\n")
        f.write("=" * 60 + "\n\n")
        f.write(f"Compiled: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        f.write(f"Board: {board}\n")
        f.write(f"Rower Profile: {rower}\n")
        f.write(f"Environment: {rower}-{board}\n\n")
        f.write("Optimization Levels:\n")
        for opt in optimizations:
            f.write(f"  - {opt}\n")
        f.write("\n")
        f.write("Files in each optimization folder:\n")
        f.write("  - firmware.bin\n")
        f.write("  - partitions.bin\n")
        f.write("  - bootloader.bin\n")
    
    print(f"\n✓ Metadata file created: {metadata_file}")


# ==================== MAIN FUNCTION ====================


def main():
    """Main execution function."""
    parser = argparse.ArgumentParser(
        description="ESP Rowing Monitor Benchmark - Compilation Script",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  %(prog)s --board lolinS3-mini
  %(prog)s --board devkit-v1 --optimizations O2 O3 Ofast
  %(prog)s --output custom-benchmark-firmware
        """
    )
    
    parser.add_argument(
        "--board",
        default=DEFAULT_BOARD,
        help=f"Board profile name (default: {DEFAULT_BOARD})"
    )
    
    parser.add_argument(
        "--rower",
        default=DEFAULT_ROWER,
        help=f"Rower profile name (default: {DEFAULT_ROWER})"
    )
    
    parser.add_argument(
        "--optimizations",
        nargs="+",
        choices=OPTIMIZATION_LEVELS,
        default=OPTIMIZATION_LEVELS,
        help=f"Optimization levels to compile (default: all)"
    )
    
    parser.add_argument(
        "--output",
        default=OUTPUT_DIR,
        help=f"Output directory for firmware files (default: {OUTPUT_DIR})"
    )
    
    parser.add_argument(
        "--clean",
        action="store_true",
        help="Clean output directory before compiling"
    )
    
    args = parser.parse_args()
    
    # Check if we're in the correct directory
    if not Path(PLATFORMIO_INI).exists():
        print(f"✗ Error: {PLATFORMIO_INI} not found in current directory")
        print("  Please run this script from the project root directory")
        return 1
    
    # If the user did not override --output, append the board name to the default
    if args.output == OUTPUT_DIR:
        output_base = Path(f"{OUTPUT_DIR}-{args.board}")
    else:
        output_base = Path(args.output)
    
    # Clean output directory if requested
    if args.clean and output_base.exists():
        print(f"Cleaning output directory: {output_base}")
        shutil.rmtree(output_base)
    
    print(f"\n{'='*60}")
    print(f"ESP Rowing Monitor Benchmark - Compilation")
    print(f"{'='*60}")
    print(f"Board:         {args.board}")
    print(f"Rower:         {args.rower}")
    print(f"Optimizations: {', '.join(['-' + opt for opt in args.optimizations])}")
    print(f"Output:        {output_base.absolute()}")
    print(f"{'='*60}\n")
    
    # Confirm before starting
    input("Press Enter to start compilation...")
    
    compiled_optimizations: List[str] = []
    # Timing info per optimization
    timing_info: dict[str, dict[str, float]] = {}
    
    # Compile for each optimization level
    for optimization in args.optimizations:
        print(f"\n\n{'#'*60}")
        print(f"# Compiling with optimization: -{optimization}")
        print(f"{'#'*60}\n")
        
    # Modify platformio.ini temporarily with optimization flag (backup & restore)
        ini_path = Path(PLATFORMIO_INI)
        original_content = ini_path.read_text()
        new_content = build_modified_ini_content(original_content, optimization, args.board)

        # Create a temporary platformio.ini for this compile so original is untouched
        tmp_ini_path = output_base / f".tmp_project_{optimization}.ini"
        try:
            tmp_ini_path.parent.mkdir(parents=True, exist_ok=True)
            tmp_ini_path.write_text(new_content)

            # Compile firmware using the temporary project config
            compile_start = time.time()
            compiled_ok = compile_firmware(args.board, args.rower, optimization, project_conf=tmp_ini_path)
            compile_end = time.time()
            # Print compile duration immediately after the compile step
            compile_dur = max(0.0, compile_end - compile_start)
            print(f"Compile time for -{optimization}: {compile_dur:0.2f}s")
            if not compiled_ok:
                print(f"✗ Skipping -{optimization} due to compilation error")
                continue
        finally:
            # Clean up temporary ini
            try:
                if tmp_ini_path.exists():
                    tmp_ini_path.unlink()
            except Exception as e:
                print(f"⚠ Failed to remove temporary ini {tmp_ini_path}: {e}")
        
        # Copy firmware files (we do not measure or store copy duration)
        copy_ok = copy_firmware_files(args.board, args.rower, optimization, output_base)

        if copy_ok:
            compiled_optimizations.append(optimization)
        else:
            print(f"⚠ Warning: Some files missing for -{optimization}")

        # Record timings for this optimization (only compile_time)
        timing_info[optimization] = {
            'compile_time': compile_dur if 'compile_dur' in locals() else (max(0.0, compile_end - compile_start) if 'compile_start' in locals() else 0.0)
        }
    
    # Create metadata file
    if compiled_optimizations:
        create_metadata_file(args.board, args.rower, compiled_optimizations, output_base)
        
        print(f"\n{'='*60}")
        print(f"Compilation Summary")
        print(f"{'='*60}")
        print(f"Successfully compiled: {len(compiled_optimizations)} optimization levels")
        for opt in compiled_optimizations:
            print(f"  - {opt}: {output_base / opt}")
        print(f"\n✓ Compilation complete!")
        # Print timing summary
        try:
            # Use a similar ASCII summary as the test script
            def format_duration(seconds: float) -> str:
                seconds = float(seconds)
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

            # rows: List[Tuple[opt, compile_time]]
            rows: List[Tuple[str, float]] = []
            total_compile = 0.0
            for opt in compiled_optimizations:
                info = timing_info.get(opt, {})
                ctime = float(info.get('compile_time', 0.0))
                rows.append((opt, ctime))
                total_compile += ctime

            col1 = max(len('Optimization'), max((len(r[0]) for r in rows), default=0))
            col2 = len('Compile')
            sep = ' | '
            header = f"{ 'Optimization'.ljust(col1) }{sep}{'Compile'.rjust(col2)}"
            line = '-' * len(header)
            print('\n' + line)
            print(header)
            print(line)
            for r in rows:
                opt, ctime = r
                print(f"{opt.ljust(col1)}{sep}{format_duration(ctime).rjust(col2)}")
            print(line)
            print(f"{'TOTAL'.ljust(col1)}{sep}{format_duration(total_compile).rjust(col2)}")
        except Exception:
            pass

        print(f"\nNext steps:")
        print(f"  1. Transfer '{output_base}' folder to your testing machine")
        print(f"  2. Run: python esp_benchmark_test.py --firmware-dir {output_base}")
    else:
        print("\n✗ No optimizations compiled successfully")
        return 1
    
    return 0


if __name__ == "__main__":
    sys.exit(main())
