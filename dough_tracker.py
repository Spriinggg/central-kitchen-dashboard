"""
DOUGH TRACKER — Central Kitchen agent (US Pizza)
------------------------------------------------
Purpose: know exactly what the kitchen made and what it wasted.
It reads production records, compares them against the REAL recipe
standard, and produces yield % and waste % per dough size.

The recipe standard is now loaded from recipe_standard.json (the same
file the dashboard's Recipes tab uses), so there is ONE source of truth.
If the recipe changes, this agent follows automatically.

Run:  python3 dough_tracker.py
"""

import json
from datetime import datetime


# ---------------------------------------------------------------------------
# 1. LOAD RECIPE STANDARD  (real data, from recipe_standard.json)
# ---------------------------------------------------------------------------
# Map our dough sizes to their recipe name + finished piece weight (grams).
DOUGH_MAP = {
    "Personal (6\")": {"recipe": "FROZEN DOUGH PERSONAL 100G", "piece_g": 100},
    "Regular (9\")":  {"recipe": "FROZEN DOUGH REGULAR 210G",  "piece_g": 210},
    "Large (13\")":   {"recipe": "FROZEN DOUGH LARGE 380G",    "piece_g": 380},
}
WASTE_LIMIT = {"Personal (6\")": 4.0, "Regular (9\")": 4.0, "Large (13\")": 5.0}


def load_recipe_standards(path="recipe_standard.json"):
    """Build {size: standard_ratio} from the real recipe file.

    standard_ratio = kg of dough that 1 kg of flour SHOULD produce, worked out
    from the recipe: (pieces per batch x piece weight) / flour used per batch.
    """
    with open(path) as f:
        data = json.load(f)
    by_name = {r["name"]: r for r in data["recipes"]}
    standards = {}
    for size, m in DOUGH_MAP.items():
        rec = by_name.get(m["recipe"])
        if not rec:
            continue
        flour = next((i for i in rec["ingredients"] if "flour" in i["name"].lower()), None)
        if not flour or not flour.get("grams"):
            continue
        dough_g = rec["yield_qty"] * m["piece_g"]        # total dough out (g)
        ratio = dough_g / flour["grams"]                 # dough kg per flour kg
        standards[size] = round(ratio, 3)
    return standards


# ---------------------------------------------------------------------------
# 2. PRODUCTION RECORDS  (SAMPLE — later read from the daily Excel / Supabase)
# ---------------------------------------------------------------------------
PRODUCTION_RECORDS = [
    {"date": "2026-09-21", "size": "Personal (6\")", "flour_used_kg": 50, "produced_kg": 79,  "wasted_kg": 2},
    {"date": "2026-09-21", "size": "Regular (9\")",  "flour_used_kg": 80, "produced_kg": 126, "wasted_kg": 4},
    {"date": "2026-09-21", "size": "Large (13\")",   "flour_used_kg": 60, "produced_kg": 92,  "wasted_kg": 7},
]


# ---------------------------------------------------------------------------
# 3. CORE LOGIC
# ---------------------------------------------------------------------------
def analyse_record(record, standards):
    ratio = standards.get(record["size"], 1.6)   # fallback if recipe missing
    limit = WASTE_LIMIT.get(record["size"], 5.0)

    expected_kg = record["flour_used_kg"] * ratio
    good_kg = record["produced_kg"] - record["wasted_kg"]
    yield_pct = round(good_kg / expected_kg * 100, 1) if expected_kg else 0
    waste_pct = round(record["wasted_kg"] / record["produced_kg"] * 100, 1) if record["produced_kg"] else 0

    if waste_pct > limit + 3:
        severity = "high"
    elif waste_pct > limit:
        severity = "medium"
    else:
        severity = "low"

    return {
        "date": record["date"], "size": record["size"],
        "standard_ratio": ratio, "expected_kg": round(expected_kg, 1),
        "good_kg": good_kg, "wasted_kg": record["wasted_kg"],
        "yield_pct": yield_pct, "waste_pct": waste_pct, "severity": severity,
    }


def run():
    try:
        standards = load_recipe_standards()
        src = "recipe_standard.json (real recipe)"
    except FileNotFoundError:
        standards = {}
        src = "fallback ratio 1.6 (recipe file not found)"

    results = [analyse_record(r, standards) for r in PRODUCTION_RECORDS]
    total_produced = sum(r["produced_kg"] for r in PRODUCTION_RECORDS)
    total_wasted = sum(r["wasted_kg"] for r in PRODUCTION_RECORDS)
    overall_waste = round(total_wasted / total_produced * 100, 1) if total_produced else 0

    print("=" * 56)
    print("  DOUGH TRACKER — daily report")
    print("  generated:", datetime.now().strftime("%Y-%m-%d %H:%M"))
    print("  recipe source:", src)
    print("=" * 56)
    for r in results:
        tag = {"high": "[HIGH]", "medium": "[MED] ", "low": "[ok]  "}[r["severity"]]
        print(f"  {tag} {r['size']:<14} ratio {r['standard_ratio']:<5} yield {r['yield_pct']:>5}%  waste {r['waste_pct']:>4}%")
    print("-" * 56)
    print(f"  Overall waste: {overall_waste}%  |  total produced: {total_produced} kg")
    print("=" * 56)

    output = {
        "generated_at": datetime.now().isoformat(timespec="seconds"),
        "recipe_source": src,
        "overall_waste_pct": overall_waste,
        "records": results,
    }
    with open("dough_tracker_output.json", "w") as f:
        json.dump(output, f, indent=2)
    print("\n  Saved -> dough_tracker_output.json\n")


if __name__ == "__main__":
    run()
