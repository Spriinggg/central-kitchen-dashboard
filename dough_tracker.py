"""
DOUGH TRACKER — Central Kitchen agent (US Pizza)
------------------------------------------------
Purpose: know exactly what the kitchen made and what it wasted.
It reads production records, compares them against recipe standards,
and produces yield % and waste % per dough size.

For now it uses SAMPLE data and writes the result to a JSON file.
Later, the two TODO points below become: (1) read from Supabase,
(2) write to Supabase (via the Loader Agent). The maths in between
does not change.

Run:  python3 dough_tracker.py
"""

import json
from datetime import datetime


# ---------------------------------------------------------------------------
# 1. RECIPE STANDARDS  (PLACEHOLDER — real numbers will come from supervisor)
# ---------------------------------------------------------------------------
# standard_ratio = how many kg of dough 1 kg of flour SHOULD produce.
# waste_limit    = the acceptable waste %; above this we flag it.
# These are guesses so the logic can run. Swap them for the real recipe.
RECIPE_STANDARD = {
    "Personal (6\")": {"standard_ratio": 1.60, "waste_limit": 4.0},
    "Regular (9\")":  {"standard_ratio": 1.60, "waste_limit": 4.0},
    "Large (13\")":   {"standard_ratio": 1.60, "waste_limit": 5.0},
}


# ---------------------------------------------------------------------------
# 2. PRODUCTION RECORDS  (SAMPLE — later this is read from Supabase)
# ---------------------------------------------------------------------------
# For each dough size on a given day:
#   flour_used_kg  = raw flour that went in
#   produced_kg    = total dough that came out (good + wasted)
#   wasted_kg      = dough that could not be used (over-proofed, trimmings, spoiled)
# TODO(Supabase): replace this list with a query on the production_records table.
PRODUCTION_RECORDS = [
    {"date": "2026-09-15", "size": "Personal (6\")", "flour_used_kg": 50,  "produced_kg": 67,  "wasted_kg": 9},
    {"date": "2026-09-15", "size": "Regular (9\")",  "flour_used_kg": 80,  "produced_kg": 98, "wasted_kg": 2},
    {"date": "2026-09-15", "size": "Large (13\")",   "flour_used_kg": 60,  "produced_kg": 120,  "wasted_kg": 13},
]


# ---------------------------------------------------------------------------
# 3. THE CORE LOGIC  (this is the part that never changes)
# ---------------------------------------------------------------------------
def analyse_record(record):
    """Take one production record and return yield %, waste %, and a flag."""
    std = RECIPE_STANDARD[record["size"]]

    # How much dough the recipe SAYS we should have gotten from this flour.
    expected_kg = record["flour_used_kg"] * std["standard_ratio"]

    # Usable dough = everything produced minus what was wasted.
    good_kg = record["produced_kg"] - record["wasted_kg"]

    # Yield % = how close the usable output was to the expected standard.
    yield_pct = round(good_kg / expected_kg * 100, 1) if expected_kg else 0

    # Waste % = how much of what we produced was thrown away.
    waste_pct = round(record["wasted_kg"] / record["produced_kg"] * 100, 1) if record["produced_kg"] else 0

    # Decide severity. (Simple rules for now; tune the thresholds later.)
    if waste_pct > std["waste_limit"] + 3:
        severity = "high"
    elif waste_pct > std["waste_limit"]:
        severity = "medium"
    else:
        severity = "low"

    return {
        "date": record["date"],
        "size": record["size"],
        "expected_kg": round(expected_kg, 1),
        "good_kg": good_kg,
        "wasted_kg": record["wasted_kg"],
        "yield_pct": yield_pct,
        "waste_pct": waste_pct,
        "severity": severity,
    }


def run():
    """Analyse every record, print a report, and save the output."""
    results = [analyse_record(r) for r in PRODUCTION_RECORDS]

    # ---- overall summary (weighted by kg produced) ----
    total_produced = sum(r["produced_kg"] for r in PRODUCTION_RECORDS)
    total_wasted = sum(r["wasted_kg"] for r in PRODUCTION_RECORDS)
    overall_waste = round(total_wasted / total_produced * 100, 1) if total_produced else 0

    # ---- print a readable report to the screen ----
    print("=" * 52)
    print("  DOUGH TRACKER — daily report")
    print("  generated:", datetime.now().strftime("%Y-%m-%d %H:%M"))
    print("=" * 52)
    for r in results:
        tag = {"high": "[HIGH]", "medium": "[MED] ", "low": "[ok]  "}[r["severity"]]
        print(f"  {tag} {r['size']:<14}  yield {r['yield_pct']:>5}%   waste {r['waste_pct']:>4}%")
    print("-" * 52)
    print(f"  Overall waste: {overall_waste}%   |   total produced: {total_produced} kg")
    print("=" * 52)

    # ---- write the output (this is the stand-in for Supabase) ----
    # TODO(Supabase): instead of writing a file, insert `results` into the
    # waste_yield table (through the Loader Agent).
    output = {
        "generated_at": datetime.now().isoformat(timespec="seconds"),
        "overall_waste_pct": overall_waste,
        "records": results,
    }
    with open("dough_tracker_output.json", "w") as f:
        json.dump(output, f, indent=2)
    print("\n  Saved -> dough_tracker_output.json")
    print("  (this file is what the dashboard will read until Supabase is ready)\n")


if __name__ == "__main__":
    run()
