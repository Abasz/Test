#!/usr/bin/env python3
"""
Lap detector for ESP rowing monitor output.txt

Detects laps based on power going to zero between active rowing segments,
then computes per-lap averages for power, drag factor, stroke rate, and pace.

Usage: python3 analyze_laps.py [output.txt]
"""

import sys
from dataclasses import dataclass
from typing import List, Optional
from statistics import mean


@dataclass
class Stroke:
    power: int
    drive_duration: float
    recovery_duration: float
    drag_factor: int
    distance: Optional[float] = None
    rev_count: Optional[int] = None


def parse_strokes(filepath: str) -> List[Stroke]:
    """Parse all stroke records from the simulation output file."""
    strokes: List[Stroke] = []
    in_stroke = False
    current: dict = {}

    with open(filepath, "r") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue

            if line.startswith("handleForces:"):
                in_stroke = True
                current = {}
            elif in_stroke:
                if line.startswith("distance:"):
                    current["distance"] = float(line.split(":", 1)[1].strip())
                elif line.startswith("revCount:"):
                    current["rev_count"] = int(line.split(":", 1)[1].strip())
                elif line.startswith("driveDuration:"):
                    current["drive_duration"] = float(line.split(":", 1)[1].strip())
                elif line.startswith("recoveryDuration:"):
                    current["recovery_duration"] = float(line.split(":", 1)[1].strip())
                elif line.startswith("dragFactor:"):
                    current["drag_factor"] = int(line.split(":", 1)[1].strip())
                elif line.startswith("power:"):
                    current["power"] = int(line.split(":", 1)[1].strip())
                    required = ("power", "drive_duration", "recovery_duration", "drag_factor")
                    if all(k in current for k in required):
                        strokes.append(
                            Stroke(
                                power=current["power"],
                                drive_duration=current["drive_duration"],
                                recovery_duration=current["recovery_duration"],
                                drag_factor=current["drag_factor"],
                                distance=current.get("distance"),
                                rev_count=current.get("rev_count"),
                            )
                        )
                    in_stroke = False
                    current = {}

    return strokes


def detect_laps(strokes: List[Stroke]) -> List[List[Stroke]]:
    """Group consecutive power>0 strokes into laps.

    Runs of power==0 strokes are treated as inter-lap gaps.
    """
    laps: List[List[Stroke]] = []
    current_lap: List[Stroke] = []

    for stroke in strokes:
        if stroke.power > 0:
            current_lap.append(stroke)
        else:
            if current_lap:
                laps.append(current_lap)
                current_lap = []

    if current_lap:
        laps.append(current_lap)

    return laps


def avg_spm(strokes: List[Stroke]) -> float:
    """Strokes per minute, using only strokes with a plausible recovery duration."""
    valid = [s for s in strokes if 0 < s.recovery_duration < 9.0]
    if not valid:
        return 0.0
    avg_cycle = mean(s.drive_duration + s.recovery_duration for s in valid)
    return 60.0 / avg_cycle if avg_cycle > 0 else 0.0


def pace_str(speed_m_per_s: float) -> str:
    """Format speed (m/s) as pace per 500 m (m:ss.ss)."""
    if speed_m_per_s <= 0:
        return "--:--"
    sec = 500.0 / speed_m_per_s
    return f"{int(sec // 60)}:{sec % 60:05.2f}"


def print_lap(lap_num: int, strokes: List[Stroke]) -> None:
    n = len(strokes)
    avg_power = mean(s.power for s in strokes)

    valid_drag = [s.drag_factor for s in strokes if s.drag_factor > 0]
    avg_drag = mean(valid_drag) if valid_drag else 0.0

    avg_drive = mean(s.drive_duration for s in strokes)
    valid_rec = [s.recovery_duration for s in strokes if 0 < s.recovery_duration < 9.0]
    avg_rec = mean(valid_rec) if valid_rec else 0.0

    spm = avg_spm(strokes)

    distances = [s.distance for s in strokes if s.distance is not None]
    lap_dist = (distances[-1] - distances[0]) if len(distances) >= 2 else None

    total_time = sum(s.drive_duration + s.recovery_duration for s in strokes)
    if lap_dist is not None and total_time > 0:
        pace = pace_str(lap_dist / total_time)
    else:
        pace = "--:--"

    dist_col = f"{lap_dist:8.1f} m" if lap_dist is not None else "        --"

    print(
        f"  {lap_num:>2}  {n:>7}  {avg_power:>9.1f}  {avg_drag:>6.1f}  "
        f"{spm:>5.1f}  {avg_drive:>6.3f}s  {avg_rec:>7.3f}s  "
        f"{dist_col}  {pace:>10}"
    )


def main() -> None:
    filepath = sys.argv[1] if len(sys.argv) > 1 else "output.txt"

    print(f"Parsing: {filepath}")
    strokes = parse_strokes(filepath)
    n_nonzero = sum(1 for s in strokes if s.power > 0)
    n_zero = sum(1 for s in strokes if s.power == 0)
    print(f"Total strokes: {len(strokes)}  (power>0: {n_nonzero}, power=0: {n_zero})")
    print()

    laps = detect_laps(strokes)
    print(f"Laps detected: {len(laps)}")
    print()

    header = (
        f"  {'Lap':>2}  {'Strokes':>7}  {'AvgPower':>9}  {'Drag':>6}  "
        f"{'SPM':>5}  {'Drive':>7}  {'Recovery':>8}  "
        f"{'Distance':>10}  {'Pace/500m':>10}"
    )
    print(header)
    print("-" * len(header))

    lap_avg_powers = []
    for i, lap in enumerate(laps, 1):
        print_lap(i, lap)
        lap_avg_powers.append(mean(s.power for s in lap))

    if laps:
        print("-" * len(header))
        print(f"\nOverall avg power (all laps):         {mean(lap_avg_powers):.1f} W")
        substantial = [lap for lap in laps if len(lap) >= 5]
        if substantial:
            grand = mean(mean(s.power for s in lap) for lap in substantial)
            print(f"Overall avg power (laps ≥5 strokes):  {grand:.1f} W")


if __name__ == "__main__":
    main()