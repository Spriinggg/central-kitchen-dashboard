"""
WEEKLY TREND — sample data generator (US Pizza Central Kitchen)
--------------------------------------------------------------
Holds 7 days of sample metrics for the dashboard's trend chart.
This is SAMPLE data for demo — change the numbers below, run this file,
then refresh the dashboard to see the chart update.

Later, this is replaced by real daily history collected from the agents
(each day's agent output saved with its date).

Run:  python3 weekly_trend.py
"""

import json
from datetime import datetime


# ---------------------------------------------------------------------------
# 7 days of sample data — edit these freely to test the chart
# ---------------------------------------------------------------------------
DAYS     = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
WASTE    = [3.1, 3.4, 2.9, 4.1, 3.8, 5.2, 4.6]          # waste %
PRODUCED = [980, 1010, 950, 1100, 1050, 1200, 1150]      # units made
SOLD     = [920, 970, 900, 1050, 1000, 1180, 1090]       # units sold
VARIANCE = [2, 3, 1, 4, 2, 5, 3]                         # alert count


def run():
    print("=" * 56)
    print("  WEEKLY TREND — sample 7-day data")
    print("  generated:", datetime.now().strftime("%Y-%m-%d %H:%M"))
    print("=" * 56)
    for i, d in enumerate(DAYS):
        print(f"  {d}  waste {WASTE[i]:>4}%   made {PRODUCED[i]:>5}   "
              f"sold {SOLD[i]:>5}   alerts {VARIANCE[i]}")
    print("=" * 56)

    output = {
        "generated_at": datetime.now().isoformat(timespec="seconds"),
        "days": DAYS,
        "waste": WASTE,
        "produced": PRODUCED,
        "sold": SOLD,
        "variance": VARIANCE,
    }
    with open("weekly_trend_output.json", "w") as f:
        json.dump(output, f, indent=2)
    print("\n  Saved -> weekly_trend_output.json")
    print("  (the dashboard reads this for the Weekly trend chart)\n")


if __name__ == "__main__":
    run()
