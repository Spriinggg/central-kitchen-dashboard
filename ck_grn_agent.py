"""
CK GRN AGENT (Phase 1) — Central Kitchen agent (US Pizza)
---------------------------------------------------------
Purpose: raw materials in, finished goods out — check whether the maths works.
It compares how much material was ACTUALLY used against how much SHOULD have
been used (from the recipe), flags the variance, and guesses the likely cause:
  - supplier short-delivery  -> Finance AP
  - waste                    -> Training
  - theft                    -> CCTV / Audit

Flour's expected usage is now derived from the REAL recipe
(recipe_standard.json): flour-per-piece x pieces produced, by dough size.
Cheese & sauce still use placeholder standards until their recipes are added.

Run:  python3 ck_grn_agent.py
"""

import json
from datetime import datetime


# ---------------------------------------------------------------------------
# 1. RECIPE STANDARD — flour from real recipe; cheese/sauce placeholder
# ---------------------------------------------------------------------------
DOUGH_MAP = {
    "Personal (6\")": "FROZEN DOUGH PERSONAL 100G",
    "Regular (9\")":  "FROZEN DOUGH REGULAR 210G",
    "Large (13\")":   "FROZEN DOUGH LARGE 380G",
}

# Placeholder — grams per pizza (cheese/sauce recipes not provided yet)
PLACEHOLDER = {"Cheese": 150, "Sauce": 80}

# Pizzas produced today, by dough size (SAMPLE — later from POS/production Excel)
PRODUCTION_BY_SIZE = {"Personal (6\")": 1200, "Regular (9\")": 1000, "Large (13\")": 600}
# Total pizzas (for cheese/sauce placeholder expected usage)
PIZZAS_MADE = sum(PRODUCTION_BY_SIZE.values())

DELIVERY_GAP_LIMIT = 2.0
USAGE_WARN = 5.0
USAGE_HIGH = 12.0


def flour_per_piece(path="recipe_standard.json"):
    """Return {size: flour grams per piece} from the real recipe file."""
    with open(path) as f:
        data = json.load(f)
    by_name = {r["name"]: r for r in data["recipes"]}
    out = {}
    for size, rname in DOUGH_MAP.items():
        rec = by_name.get(rname)
        if not rec:
            continue
        fl = next((i for i in rec["ingredients"] if "flour" in i["name"].lower()), None)
        if fl and fl.get("grams") and rec["yield_qty"]:
            out[size] = fl["grams"] / rec["yield_qty"]
    return out


def expected_flour_kg():
    """Expected flour = sum(pieces x flour-per-piece) across sizes, from recipe."""
    fpp = flour_per_piece()
    total_g = sum(PRODUCTION_BY_SIZE.get(s, 0) * g for s, g in fpp.items())
    return round(total_g / 1000, 1), fpp


# ---------------------------------------------------------------------------
# 2. STOCK RECORDS  (SAMPLE GRN + snapshots — later from the daily Excel)
# ---------------------------------------------------------------------------
# expected_used_kg is filled for flour from the recipe; for others from placeholder.
STOCK_RECORDS = [
    {"material": "Dough (flour)", "ordered_kg": 320, "received_kg": 320, "opening_kg": 40, "closing_kg": 22},
    {"material": "Cheese",        "ordered_kg": 450, "received_kg": 435, "opening_kg": 30, "closing_kg": 33},
    {"material": "Sauce",         "ordered_kg": 230, "received_kg": 230, "opening_kg": 20, "closing_kg": 12},
]


# ---------------------------------------------------------------------------
# 3. CORE LOGIC
# ---------------------------------------------------------------------------
def analyse_material(record, flour_expected):
    material = record["material"]

    if material == "Dough (flour)":
        expected_used = flour_expected
        basis = "real recipe"
    else:
        key = "Cheese" if "Cheese" in material else "Sauce"
        expected_used = PIZZAS_MADE * PLACEHOLDER[key] / 1000
        basis = "placeholder"

    actual_used = record["opening_kg"] + record["received_kg"] - record["closing_kg"]
    usage_variance = round(actual_used - expected_used, 1)
    usage_variance_pct = round(usage_variance / expected_used * 100, 1) if expected_used else 0
    delivery_gap = record["ordered_kg"] - record["received_kg"]
    delivery_gap_pct = round(delivery_gap / record["ordered_kg"] * 100, 1) if record["ordered_kg"] else 0

    if delivery_gap_pct >= DELIVERY_GAP_LIMIT:
        cause, dept, severity = "supplier short-delivery", "Finance AP", "high"
        note = f"received {delivery_gap}kg less than ordered"
    elif usage_variance_pct >= USAGE_HIGH:
        cause, dept, severity = "possible theft", "CCTV / Audit", "high"
        note = f"used {usage_variance_pct}% more than recipe"
    elif usage_variance_pct >= USAGE_WARN:
        cause, dept, severity = "likely waste", "Training", "medium"
        note = f"used {usage_variance_pct}% more than recipe"
    else:
        cause, dept, severity = "within tolerance", "-", "low"
        note = "usage matches recipe"

    return {
        "material": material, "basis": basis,
        "expected_used_kg": round(expected_used, 1), "actual_used_kg": actual_used,
        "usage_variance_pct": usage_variance_pct, "delivery_gap_kg": delivery_gap,
        "cause": cause, "route_to": dept, "severity": severity, "note": note,
    }


def run():
    try:
        flour_expected, fpp = expected_flour_kg()
        src = "recipe_standard.json (flour = real recipe)"
    except FileNotFoundError:
        flour_expected, fpp = 300.0, {}
        src = "fallback (recipe file not found)"

    results = [analyse_material(r, flour_expected) for r in STOCK_RECORDS]

    print("=" * 68)
    print("  CK GRN AGENT — usage variance & cause")
    print("  generated:", datetime.now().strftime("%Y-%m-%d %H:%M"))
    print("  source:", src)
    if fpp:
        print("  flour/piece:", ", ".join(f"{s.split()[0]} {g:.1f}g" for s, g in fpp.items()))
    print("=" * 68)
    for r in results:
        tag = {"high": "[HIGH]", "medium": "[MED] ", "low": "[ok]  "}[r["severity"]]
        print(f"  {tag} {r['material']:<14} ({r['basis']:<11}) var {r['usage_variance_pct']:>6}%  → {r['cause']} ({r['route_to']})")
    print("=" * 68)

    output = {
        "generated_at": datetime.now().isoformat(timespec="seconds"),
        "source": src,
        "records": results,
    }
    with open("ck_grn_output.json", "w") as f:
        json.dump(output, f, indent=2)
    print("\n  Saved -> ck_grn_output.json\n")


if __name__ == "__main__":
    run()
