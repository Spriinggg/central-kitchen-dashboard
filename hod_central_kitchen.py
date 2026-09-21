"""
HOD CENTRAL KITCHEN — Central Kitchen agent (US Pizza)
------------------------------------------------------
Purpose: make sure the kitchen produces what outlets will actually sell.
It compares production against real outlet demand (sales) and warns about
shortages (nearly sold out) and surpluses (overproduced) before they bite.

Same shape as dough_tracker.py:
  1) standards   2) sample data   3) core logic   4) run + save JSON

Run:  python3 hod_central_kitchen.py
"""

import json
from datetime import datetime


# ---------------------------------------------------------------------------
# 1. THRESHOLDS  (tune these later with the supervisor / real data)
# ---------------------------------------------------------------------------
# sell_through % = sold / produced * 100
#   HIGH sell-through  -> almost sold out  -> shortage risk (make more)
#   LOW  sell-through  -> lots left over   -> surplus / overproduction (make less)
SHORTAGE_LIMIT = 95.0   # at or above this %, flag as shortage risk
SURPLUS_LIMIT  = 75.0   # at or below this %, flag as surplus


# ---------------------------------------------------------------------------
# 2. PRODUCTION vs SALES  (SAMPLE — later read from Supabase)
# ---------------------------------------------------------------------------
# produced = units the kitchen made for that outlet
# sold     = units the outlet actually sold (real demand)
# TODO(Supabase): replace with a query joining production + sales per outlet.
OUTLET_RECORDS = [
    {"date": "2026-09-15", "outlet": "B", "produced": 100, "sold": 67},
    {"date": "2026-09-15", "outlet": "C", "produced": 90,  "sold": 20},
    {"date": "2026-09-15", "outlet": "D", "produced": 70,  "sold": 68},
    {"date": "2026-09-15", "outlet": "E", "produced": 80,  "sold": 30},
]


# ---------------------------------------------------------------------------
# 3. THE CORE LOGIC
# ---------------------------------------------------------------------------
def analyse_outlet(record):
    """Compare one outlet's production vs demand and return a status + severity."""
    produced = record["produced"]
    sold = record["sold"]

    # How much of what we made actually sold.
    sell_through = round(sold / produced * 100, 1) if produced else 0

    # Decide status + severity.
    if sell_through >= SHORTAGE_LIMIT:
        status = "shortage risk"
        severity = "high" if sell_through >= 99 else "medium"
        note = "nearly sold out → consider producing more"
    elif sell_through <= SURPLUS_LIMIT:
        status = "surplus"
        severity = "high" if sell_through <= 65 else "medium"
        note = "overproduced → consider producing less"
    else:
        status = "balanced"
        severity = "low"
        note = "production matches demand"

    return {
        "date": record["date"],
        "outlet": record["outlet"],
        "produced": produced,
        "sold": sold,
        "sell_through_pct": sell_through,
        "status": status,
        "severity": severity,
        "note": note,
    }


def run():
    """Analyse every outlet, print a report, and save the output."""
    results = [analyse_outlet(r) for r in OUTLET_RECORDS]

    # ---- print a readable report ----
    print("=" * 60)
    print("  HOD CENTRAL KITCHEN — production vs demand")
    print("  generated:", datetime.now().strftime("%Y-%m-%d %H:%M"))
    print("=" * 60)
    for r in results:
        tag = {"high": "[HIGH]", "medium": "[MED] ", "low": "[ok]  "}[r["severity"]]
        print(f"  {tag} Outlet {r['outlet']}  {r['sell_through_pct']:>5}% sold   "
              f"({r['produced']} made / {r['sold']} sold)  → {r['status']}")
    print("=" * 60)

    # ---- write output (stand-in for Supabase) ----
    # TODO(Supabase): insert `results` into a production_summary table via Loader.
    output = {
        "generated_at": datetime.now().isoformat(timespec="seconds"),
        "records": results,
    }
    with open("hod_output.json", "w") as f:
        json.dump(output, f, indent=2)
    print("\n  Saved -> hod_output.json")
    print("  (the dashboard reads this for the Production vs demand card)\n")


if __name__ == "__main__":
    run()
