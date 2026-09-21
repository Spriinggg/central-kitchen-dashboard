"""
PKT EMAIL READER — Central Kitchen agent (US Pizza)
---------------------------------------------------
Purpose: nobody retypes logistics data ever again.
It opens PKT's delivery Excel, compares what was dispatched against what the
outlet received, and flags any mismatch.

NOTE: the Excel-reading part is isolated in read_pkt_excel() below. When the
REAL PKT file arrives, you usually only change that one function (the column
names) — the mismatch logic and everything else stays the same.

Same shape as the other agents:
  1) settings   2) read input   3) core logic   4) run + save JSON

Needs openpyxl:  pip install openpyxl
Run:  python3 pkt_email_reader.py
"""

import json
from datetime import datetime
import openpyxl


# ---------------------------------------------------------------------------
# 1. SETTINGS
# ---------------------------------------------------------------------------
EXCEL_FILE = "pkt_sample.xlsx"   # swap for the real PKT file when it arrives

# Column names as they appear in the Excel header row.
# TODO(real file): if PKT's columns are named differently, change them HERE only.
COL = {
    "date":       "Date",
    "route":      "Route",
    "outlet":     "Outlet",
    "item":       "Item",
    "dispatched": "Dispatched",
    "received":   "Received",
}


# ---------------------------------------------------------------------------
# 2. READ THE EXCEL  (the only part that changes for a different file format)
# ---------------------------------------------------------------------------
def read_pkt_excel(path):
    """Read the PKT Excel into a list of dicts. Isolated so it's easy to swap."""
    wb = openpyxl.load_workbook(path, data_only=True)
    ws = wb.active

    # First row = headers. Map header name -> column index.
    headers = [c.value for c in ws[1]]
    idx = {name: headers.index(col) for name, col in COL.items()}

    rows = []
    for row in ws.iter_rows(min_row=2, values_only=True):
        if row[idx["route"]] is None:
            continue  # skip empty lines
        rows.append({
            "date":       row[idx["date"]],
            "route":      row[idx["route"]],
            "outlet":     row[idx["outlet"]],
            "item":       row[idx["item"]],
            "dispatched": row[idx["dispatched"]],
            "received":   row[idx["received"]],
        })
    return rows


# ---------------------------------------------------------------------------
# 3. CORE LOGIC  (never changes — compares dispatched vs received)
# ---------------------------------------------------------------------------
def check_delivery(record):
    """Compare dispatched vs received and flag a mismatch."""
    gap = record["dispatched"] - record["received"]
    matched = (gap == 0)
    return {
        "route": record["route"],
        "outlet": record["outlet"],
        "item": record["item"],
        "dispatched": record["dispatched"],
        "received": record["received"],
        "gap": gap,
        "status": "matched" if matched else "mismatch",
    }


def run():
    deliveries = read_pkt_excel(EXCEL_FILE)
    results = [check_delivery(d) for d in deliveries]

    mismatches = sum(1 for r in results if r["status"] == "mismatch")

    print("=" * 62)
    print("  PKT EMAIL READER — delivery check")
    print("  generated:", datetime.now().strftime("%Y-%m-%d %H:%M"),
          f"| source: {EXCEL_FILE}")
    print("=" * 62)
    for r in results:
        mark = "OK  " if r["status"] == "matched" else "MISS"
        extra = "" if r["gap"] == 0 else f"  (short {r['gap']})"
        print(f"  [{mark}] {r['route']:<7} {r['outlet']:<9} {r['item']:<7} "
              f"sent {r['dispatched']:>4} / got {r['received']:>4}{extra}")
    print("=" * 62)
    print(f"  {mismatches} mismatch(es) found.")

    # TODO(Supabase): insert `results` into logistics_records table via Loader.
    output = {
        "generated_at": datetime.now().isoformat(timespec="seconds"),
        "mismatches": mismatches,
        "records": results,
    }
    with open("pkt_output.json", "w") as f:
        json.dump(output, f, indent=2)
    print("\n  Saved -> pkt_output.json")
    print("  (the dashboard reads this for the Logistics log card)\n")


if __name__ == "__main__":
    run()
