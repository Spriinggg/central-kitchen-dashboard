"""
AUTO-ORDER — CK GRN Agent, Phase 2 (US Pizza)
---------------------------------------------
Purpose: recommend a weekly stock order for each outlet, based on real usage,
current stock, and a holiday buffer. Follows the supervisor's notes:
  - auto-order every week
  - based on real usage
  - add a buffer for holidays (adjustable 5/10/15/20%, capped at 20%)

SAFETY (important): orders are produced as DRAFTS for human approval, not
auto-sent. This matches the blueprint's human-led -> assisted -> auto path.

Same shape as the other agents:
  1) settings   2) sample data   3) core logic   4) run + save JSON

Run:  python3 auto_order.py
"""

import json
from datetime import datetime


# ---------------------------------------------------------------------------
# 1. SETTINGS
# ---------------------------------------------------------------------------
# Holiday buffer: extra % to order during holiday periods. Adjustable, but the
# supervisor set a hard cap of 20%. Set to 0 when it is not a holiday period.
HOLIDAY_BUFFER_PCT = 10        # e.g. school holiday coming up
BUFFER_CAP = 20                # hard maximum — never exceed this


# ---------------------------------------------------------------------------
# 2. OUTLET DATA  (DUMMY — later read from Supabase)
# ---------------------------------------------------------------------------
# weekly_usage = how much this outlet actually uses in a week (from real usage)
# current_stock = what the outlet has on hand right now
# TODO(Supabase): replace with a query on usage + current stock per outlet.
OUTLET_DATA = [
    {"outlet": "B", "weekly_usage": 100, "current_stock": 2},
    {"outlet": "C", "weekly_usage": 80,  "current_stock": 65},
    {"outlet": "D", "weekly_usage": 80,  "current_stock": 80},
    {"outlet": "E", "weekly_usage": 70,  "current_stock": 20},
]


# ---------------------------------------------------------------------------
# 3. THE CORE LOGIC
# ---------------------------------------------------------------------------
def recommend_order(record, buffer_pct):
    """Work out how much to order for one outlet this week."""
    usage = record["weekly_usage"]
    current = record["current_stock"]

    # Enforce the hard cap on the buffer (safety).
    buffer_pct = min(buffer_pct, BUFFER_CAP)

    # Target = one week of usage, plus the holiday buffer.
    target = usage * (1 + buffer_pct / 100)

    # Order only the gap between target and what we already have.
    order_qty = max(0, round(target - current))

    return {
        "outlet": record["outlet"],
        "weekly_usage": usage,
        "current_stock": current,
        "buffer_pct": buffer_pct,
        "target": round(target),
        "order_qty": order_qty,
        "status": "draft — needs approval",   # never auto-sent
    }


def run():
    results = [recommend_order(r, HOLIDAY_BUFFER_PCT) for r in OUTLET_DATA]

    print("=" * 64)
    print("  AUTO-ORDER (CK GRN Phase 2) — weekly order draft")
    print("  generated:", datetime.now().strftime("%Y-%m-%d %H:%M"),
          f"| holiday buffer: {min(HOLIDAY_BUFFER_PCT, BUFFER_CAP)}%")
    print("=" * 64)
    for r in results:
        print(f"  Outlet {r['outlet']}  usage {r['weekly_usage']:>4}  "
              f"have {r['current_stock']:>4}  →  ORDER {r['order_qty']:>4}  (target {r['target']})")
    print("=" * 64)
    print("  All orders are DRAFTS — a human approves before anything is sent.")

    # TODO(Supabase): insert `results` into auto_orders table via Loader.
    output = {
        "generated_at": datetime.now().isoformat(timespec="seconds"),
        "buffer_pct": min(HOLIDAY_BUFFER_PCT, BUFFER_CAP),
        "records": results,
    }
    with open("auto_order_output.json", "w") as f:
        json.dump(output, f, indent=2)
    print("\n  Saved -> auto_order_output.json")
    print("  (the dashboard reads this for the Weekly auto-order card)\n")


if __name__ == "__main__":
    run()
