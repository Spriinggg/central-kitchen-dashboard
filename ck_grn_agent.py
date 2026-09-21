"""
CK GRN AGENT (Phase 1) — Central Kitchen agent (US Pizza)
---------------------------------------------------------
Purpose: raw materials in, finished goods out — and check whether the maths works.
It compares how much material was ACTUALLY used against how much SHOULD have been
used (from the recipe), flags the variance, and guesses the most likely cause:
  - supplier short-delivery  -> Finance AP
  - waste                    -> Training
  - theft                    -> CCTV / Audit

Phase 2 (later) = auto-order. Not in this file yet.

Same shape as the other agents:
  1) recipe standard   2) sample data   3) core logic   4) run + save JSON

Run:  python3 ck_grn_agent.py
"""

import json
from datetime import datetime


# ---------------------------------------------------------------------------
# 1. RECIPE STANDARD  (DUMMY — grams of each material per pizza. Real numbers
#    will come from the supervisor. TODO(Supabase): move to a shared table.)
# ---------------------------------------------------------------------------
RECIPE_STANDARD = {
    "Dough (flour)": {"grams_per_pizza": 250},
    "Cheese":        {"grams_per_pizza": 150},
    "Sauce":         {"grams_per_pizza": 80},
}

# How many pizzas the kitchen made today (dummy total). Drives expected usage.
PIZZAS_MADE = 1000

# Thresholds (tune later)
DELIVERY_GAP_LIMIT = 2.0   # % short on delivery before we flag short-delivery
USAGE_WARN = 5.0           # % over-usage → medium (waste)
USAGE_HIGH = 12.0          # % over-usage → high (possible theft)


# ---------------------------------------------------------------------------
# 2. STOCK RECORDS  (DUMMY GRN + stock snapshots — later read from Supabase)
# ---------------------------------------------------------------------------
# ordered_kg  = what we ordered from the supplier
# received_kg = what actually arrived (from the GRN)
# opening_kg  = stock at the 9:00 AM snapshot
# closing_kg  = stock at the 10:30 PM snapshot
# TODO(Supabase): replace with a query on stock_movements + GRN.
STOCK_RECORDS = [
    {"material": "Dough (flour)", "ordered_kg": 260, "received_kg": 260, "opening_kg": 40, "closing_kg": 34},
    {"material": "Cheese",        "ordered_kg": 160, "received_kg": 150, "opening_kg": 30, "closing_kg": 28},
    {"material": "Sauce",         "ordered_kg": 85,  "received_kg": 85,  "opening_kg": 20, "closing_kg": 10},
]


# ---------------------------------------------------------------------------
# 3. THE CORE LOGIC
# ---------------------------------------------------------------------------
def analyse_material(record):
    """Work out how much was used vs expected, and guess the cause of any gap."""
    material = record["material"]
    std = RECIPE_STANDARD[material]

    # How much the recipe SAYS we should have used for today's production.
    expected_used = PIZZAS_MADE * std["grams_per_pizza"] / 1000   # kg

    # How much we ACTUALLY used = opening + received - closing.
    actual_used = record["opening_kg"] + record["received_kg"] - record["closing_kg"]

    # Usage variance (positive = used more than the recipe expects).
    usage_variance = round(actual_used - expected_used, 1)
    usage_variance_pct = round(usage_variance / expected_used * 100, 1) if expected_used else 0

    # Delivery gap (positive = supplier delivered less than ordered).
    delivery_gap = record["ordered_kg"] - record["received_kg"]
    delivery_gap_pct = round(delivery_gap / record["ordered_kg"] * 100, 1) if record["ordered_kg"] else 0

    # ---- guess the most likely cause ----
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
        "material": material,
        "expected_used_kg": round(expected_used, 1),
        "actual_used_kg": actual_used,
        "usage_variance_pct": usage_variance_pct,
        "delivery_gap_kg": delivery_gap,
        "cause": cause,
        "route_to": dept,
        "severity": severity,
        "note": note,
    }


def run():
    results = [analyse_material(r) for r in STOCK_RECORDS]

    print("=" * 66)
    print("  CK GRN AGENT — usage variance & cause")
    print("  generated:", datetime.now().strftime("%Y-%m-%d %H:%M"))
    print("=" * 66)
    for r in results:
        tag = {"high": "[HIGH]", "medium": "[MED] ", "low": "[ok]  "}[r["severity"]]
        print(f"  {tag} {r['material']:<14} var {r['usage_variance_pct']:>5}%   "
              f"→ {r['cause']} ({r['route_to']})")
    print("=" * 66)

    # TODO(Supabase): insert `results` into usage_variance table via Loader.
    output = {
        "generated_at": datetime.now().isoformat(timespec="seconds"),
        "records": results,
    }
    with open("ck_grn_output.json", "w") as f:
        json.dump(output, f, indent=2)
    print("\n  Saved -> ck_grn_output.json")
    print("  (the dashboard reads this for the Usage variance alerts card)\n")


if __name__ == "__main__":
    run()
