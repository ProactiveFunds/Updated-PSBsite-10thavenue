#!/usr/bin/env python3
"""Regenerate src/data/assets.js from 'Proactive Realty Group - Property Information.xlsx'.

Source of truth: the two visible tabs — 'Property Information' (owned) and
'In Contract' (under contract). Narrative fields (theses, SDGs, avg rent) are
carried over from the previous assets.js by id, with stale figures corrected.
"""
import json
import openpyxl
from pathlib import Path

# Run from anywhere:  python3 proactive-astro/scripts/generate-assets.py
# Needs openpyxl (pip install openpyxl). The workbook sits one level above the
# Astro project, alongside the other client source material.
REPO = Path(__file__).resolve().parents[1]          # proactive-astro/
XLSX = REPO.parent / "Proactive Realty Group - Property Information.xlsx"
OUT = REPO / "src/data/assets.js"

PRIF = "Proactive Realty Income Fund"
PRIF2 = "Proactive Realty Income Fund II, LLC"
QOZ = "Proactive QOZ Fund I, LLC"

# id / display name / fund, keyed by the spreadsheet row number on each tab.
# ids match the previous file wherever the property carries over, so nothing
# that links to an asset breaks.

# Rows on the owned tab that are deliberately NOT published to the site.
# 906 West Main is listed there as "906 West Main (for sale)" — it is being
# marketed, so the client asked for it off /assets and out of every total.
HELD_SKIP = {6}

HELD_META = {
    1:  ("252-ceceile-st-sc", "252 Ceceile St", PRIF),
    2:  ("1905-ellis-ave-sc", "1905 Ellis Ave", PRIF),
    3:  ("105-w-154-street-il", "105 W. 154 Street", PRIF),
    4:  ("113-w-154-street-il", "113 W. 154 Street", PRIF),
    5:  ("umh-citrus-circle-sc", "UMH (Citrus Circle)", PRIF),
    7:  ("3-wycombe-drive-in", "3 Wycombe Drive", PRIF2),
    8:  ("921-las-vegas-blvd-nv", "921 Las Vegas Blvd", PRIF2),
    9:  ("14437-45-s-halsted-street-il", "14437-45 S. Halsted Street", PRIF2),
    10: ("6633-mccartney-road-oh", "6633 McCartney Road", PRIF2),
    11: ("7400-west-flamingo-road-unit-1092-nv", "7400 West Flamingo Road, Unit 1092", PRIF2),
    12: ("2405-2407-old-edisto-drive-sc", "2405 & 2407 Old Edisto Drive", PRIF2),
    13: ("121-fountainevue-dr-in", "121 Fountainevue Dr", PRIF2),
    14: ("50-old-train-road-sc", "50 Old Train Road", PRIF2),
    15: ("13845-s-atlantic-ave-il", "13845 S. Atlantic Ave.", PRIF2),
    16: ("526-518-520-522-stilton-sc", "526, 518, 520, 522 Stilton", PRIF2),
    17: ("715-e-155th-ct-il", "715 E 155th Ct.", PRIF2),
    18: ("926-moseley-sc", "926 Moseley", QOZ),
}
UC_META = {
    1: ("1602-us-highway-93-nv", "1602 US Highway 93", PRIF2),
    2: ("909-e-andy-devine-avenue-az", "909 E. Andy Devine Avenue", PRIF2),
    3: ("1508-s-las-vegas-blvd-nv", "1508 S Las Vegas Blvd", PRIF2),
    4: ("2952-alter-rd-mi", "2952 Alter Rd.", PRIF2),
    5: ("3203-water-ave-al", "3203 Water Ave.", PRIF2),
}

# Street line for the site, normalised to one house style (Dr. Van, 17 Aug 2026):
#   <number> <directional> <street> <Type>, <City>, <ST>   e.g.
#   "921 N Las Vegas Blvd, Las Vegas, NV"
# Types abbreviated with no trailing period; directionals as bare letters.
# The workbook's own strings are inconsistent ("Ave." / "Avenue" / "Street"), and
# four rows are multi-parcel lists rather than addresses, so the display value is
# pinned here rather than derived — and it survives a workbook refresh.
# City and state are appended from the sheet, so they are not repeated below.
#
# ⚠ Two entries below are still not real street addresses; the workbook has no
#   house number ("Citrus Circle") or no street type ("Stilton", "Moseley").
#   Flagged to the client — replace here when they come back with the real ones.
ADDRESS = {
    "252-ceceile-st-sc": "252 Ceceile St",
    "1905-ellis-ave-sc": "1905 Ellis Ave",
    "105-w-154-street-il": "105 W 154th St",
    "113-w-154-street-il": "113 W 154th St",
    "umh-citrus-circle-sc": "Citrus Circle",                     # ⚠ no house number
    "3-wycombe-drive-in": "3 Wycombe Dr",
    # Dr. Van's correction, 17 Aug 2026: the workbook still says "921 Las Vegas
    # Blvd". Kept here so a refresh cannot silently revert it. Note the portfolio
    # also holds 1508 *S* Las Vegas Blvd — the directional matters.
    "921-las-vegas-blvd-nv": "921 N Las Vegas Blvd",
    "14437-45-s-halsted-street-il": "14437–14445 S Halsted St",  # sheet: "14437–45"
    "6633-mccartney-road-oh": "6633 McCartney Rd",
    "7400-west-flamingo-road-unit-1092-nv": "7400 W Flamingo Rd, Unit 1092",
    "2405-2407-old-edisto-drive-sc": "2405–2407 Old Edisto Dr",  # sheet: "2405 & 2407"
    "121-fountainevue-dr-in": "121 Fountainevue Dr",
    "50-old-train-road-sc": "50 Old Train Rd",
    "13845-s-atlantic-ave-il": "13845 S Atlantic Ave",
    "526-518-520-522-stilton-sc": "518–526 Stilton",             # ⚠ no street type
    "715-e-155th-ct-il": "715 E 155th Ct",
    "926-moseley-sc": "926 Moseley",                             # ⚠ no street type
    "1602-us-highway-93-nv": "1602 US Highway 93",
    "909-e-andy-devine-avenue-az": "909 E Andy Devine Ave",
    "1508-s-las-vegas-blvd-nv": "1508 S Las Vegas Blvd",
    "2952-alter-rd-mi": "2952 Alter Rd",
    "3203-water-ave-al": "3203 Water Ave",
}

# Every property carries the same portfolio-level SDG alignment. Stated once on
# /assets rather than badged per asset — see SUMMARY.md for why.
PORTFOLIO_SDGS = [1, 3, 5, 6, 7, 10, 11]

# Monthly average rent, carried over from the previous file (not in the sheet).
AVG_RENT = {
    "252-ceceile-st-sc": 783.0,
    "1905-ellis-ave-sc": 353.0,
    "105-w-154-street-il": 900.0,
    "113-w-154-street-il": 900.0,
    "umh-citrus-circle-sc": 813.0,
    "3-wycombe-drive-in": 800.0,
    "921-las-vegas-blvd-nv": 1050.0,
    "14437-45-s-halsted-street-il": 900.0,
    "6633-mccartney-road-oh": 381.0,
    "7400-west-flamingo-road-unit-1092-nv": 1620.0,
    "2405-2407-old-edisto-drive-sc": 950.0,
    "121-fountainevue-dr-in": 563.0,
    "50-old-train-road-sc": 1156.0,
    "13845-s-atlantic-ave-il": 950.0,
    "526-518-520-522-stilton-sc": 1156.0,
    "715-e-155th-ct-il": 1450.0,
    "926-moseley-sc": 500.0,
    "1508-s-las-vegas-blvd-nv": 1050.0,
    "2952-alter-rd-mi": 875.0,
    "3203-water-ave-al": 700.0,
}

SDGS = {
    "921-las-vegas-blvd-nv": [1, 3, 5, 6, 7, 10, 11],
    "1508-s-las-vegas-blvd-nv": [1, 3, 5, 6, 7, 10, 11],
    "2952-alter-rd-mi": [1, 3, 5, 6, 7, 10, 11],
    "3203-water-ave-al": [1, 3, 5, 6, 7, 10, 11],
}

# Investment theses carried over from the previous file. Figures that the new
# spreadsheet contradicts have been corrected in place; unverifiable derived
# stats (e.g. a gross-rent multiple that no longer follows) were dropped.
INVESTMENT_THESIS = {
    "252-ceceile-st-sc":
        "This 14-unit property in Denmark, SC represents a strong value-add opportunity with "
        "significant income potential. Acquired at $105K against an estimated stabilised value "
        "of $850K, the property demonstrates strong cash-on-cash returns. Located in an "
        "underserved rural market, this investment provides quality affordable housing while "
        "generating consistent returns for investors.",
    "1905-ellis-ave-sc":
        "Located in Orangeburg, SC, this 46-unit property offers exceptional value appreciation "
        "potential with an estimated value of $1.61M on a $610K acquisition. This investment "
        "targets economic revitalisation in underserved communities while delivering superior "
        "returns.",
    "105-w-154-street-il":
        "This Harvey, IL property demonstrates the fund's commitment to neighbourhood "
        "stabilisation in challenged markets. Acquired at $40K with an estimated value of $175K, "
        "it offers both strong cash flow and appreciation potential. The investment supports "
        "community revitalisation while generating attractive risk-adjusted returns.",
    "113-w-154-street-il":
        "Adjacent acquisition to 105 W. 154 Street, this 6-unit property represents a strategic "
        "portfolio consolidation opportunity in Harvey, IL. Purchased at $17.8K with "
        "redevelopment potential, it offers significant value-add through unit improvements and "
        "occupancy stabilisation. The investment creates scale economies and enhances "
        "neighbourhood impact.",
    "926-moseley-sc":
        "This flagship 40-unit property in Orangeburg, SC represents the fund's largest "
        "single-asset investment. At 90% occupancy it demonstrates institutional-quality "
        "operations. The property serves as a cornerstone investment in the Qualified "
        "Opportunity Zone fund, providing both strong cash flow and long-term tax-advantaged "
        "appreciation.",
}

# Impact theses carried over. Citation artefacts (【…】) stripped, and figures the
# new sheet contradicts corrected.
IMPACT_THESIS = {
    "6633-mccartney-road-oh":
        "The Glen at Stateline features newly remodelled mobile homes on lease-to-own terms. "
        "One home has 3 bedrooms, 2 baths and about 980 sq ft with new flooring, deck and "
        "fresh paint.",
    "7400-west-flamingo-road-unit-1092-nv":
        "Condominium unit acquired for $275K in March 2025; built in 1995 with 2 bedrooms and "
        "2 bathrooms across 959 sq ft. The home features updated wood-tile floors and "
        "modernised kitchen and bathrooms.",
    "121-fountainevue-dr-in":
        "Fountainvue Mobile Home Park is anchored by a 1,599-sq-ft, 3-bed, 1.5-bath "
        "single-family home built in 1972 on 41.6 acres. The park provides a rural community "
        "setting.",
    "50-old-train-road-sc":
        "Mobile home property in Greeleyville, SC with multiple mobile home units on land. "
        "A 1979 manufactured home sits on the site.",
    "526-518-520-522-stilton-sc":
        "Rental property that includes four addresses. 526 Stilton is a rented brick ranch home; "
        "522 and 520 are new single-wide 2-bed, 1-bath homes; and 518 is a new 2-bed, 2-bath "
        "single-wide. The brick home has been remodelled with varnished pine floors and new "
        "ceiling fans. A fenced common area with picnic tables sits between the units.",
    "715-e-155th-ct-il":
        "Single-family home built in 1957 featuring three bedrooms, one bathroom and "
        "approximately 1,020 sq ft of living space. The house sits on a 4,440-sq-ft lot and has "
        "an attached garage and stone exterior.",
}


def read(sheet, first, last, meta, status, skip=frozenset()):
    ws = openpyxl.load_workbook(XLSX, data_only=True)[sheet]
    out = []
    for r in range(first, last + 1):
        cell = lambda c: ws.cell(r, c).value
        no = int(cell(1))
        if no in skip:
            continue
        asset_id, name, fund = meta[no]
        units = int(cell(10))
        occupied = int(cell(11))
        date = cell(2)
        purchase_date = date.date().isoformat() if hasattr(date, "date") else None
        out.append({
            "id": asset_id,
            "name": name,
            # What /assets renders: normalised street line + city + state.
            "address": f"{ADDRESS[asset_id]}, {cell(4)}, {cell(5)}",
            "fund": fund,
            "status": status,
            "city": cell(4),
            "state": cell(5),
            "zip": str(cell(6)),
            "county": cell(7),
            "units": units,
            "occupiedUnits": occupied,
            "occupancyRate": round(occupied / units * 100) if units else 0,
            "avgRent": AVG_RENT.get(asset_id),
            "purchasePrice": float(cell(8)),
            "estimatedValue": float(cell(9)),
            "purchaseDate": purchase_date,
            "yearAcquired": int(purchase_date[:4]) if purchase_date else None,
            "investmentThesis": INVESTMENT_THESIS.get(asset_id, ""),
            "impactThesis": IMPACT_THESIS.get(asset_id, ""),
            "sdgs": SDGS.get(asset_id, []),
        })
    return out


held = read("Property Information", 4, 21, HELD_META, "Acquired", HELD_SKIP)
under_contract = read("In Contract", 4, 8, UC_META, "Under Contract")
assets = held + under_contract
# Newest first, under-contract deals last (they have no purchase date).
assets.sort(key=lambda a: (a["status"] == "Under Contract", -(a["yearAcquired"] or 0), a["name"]))

body = ",\n".join("  " + json.dumps(a, indent=2, ensure_ascii=False).replace("\n", "\n  ") for a in assets)

units = sum(a["units"] for a in assets)
occupied = sum(a["occupiedUnits"] for a in assets)
value = sum(a["estimatedValue"] for a in assets)
states = sorted({a["state"] for a in assets})

header = f"""// ---------------------------------------------------------------------------
// Portfolio assets — GENERATED from "Proactive Realty Group - Property
// Information.xlsx" (the two visible tabs: "Property Information" = owned,
// "In Contract" = under contract). That workbook is the source of truth for
// every per-asset figure below; the earlier base44 export is superseded.
//
// Totals implied by this file — keep SUMMARY.md "Canonical numbers" in sync:
//   {len(assets)} assets ({len(held)} owned + {len(under_contract)} under contract)
//   {units} units / pads · {occupied} occupied ({round(occupied / units * 100)}%)
//   ${value:,.0f} estimated value · {len(states)} states ({", ".join(states)})
//
// Estimated value is the workbook's "Estimated Value" column, footnoted there
// as "based on 100% occupancy" — i.e. stabilised, not current market value.
//
// Narrative fields (investmentThesis, impactThesis, sdgs, avgRent) are not in
// the workbook; they are carried over from the previous file and corrected
// where the workbook contradicted them.
//
// To refresh: update the workbook, re-run `python3 scripts/generate-assets.py`,
// then run `npm test` — tests/data.test.js pins the totals quoted on /,
// /OurProcess, /q3-special and /ira, so it will tell you what copy to update.
// `address` is the normalised street line /assets renders (one house style, set
// in the generator's ADDRESS table — the workbook's own strings are
// inconsistent). `avgRent` and `estimatedValue` are NOT shown per property
// (client request, 17 Aug 2026); estimatedValue is kept because the portfolio
// value and the AUM figure quoted on four other pages are summed from it.
//
// Fields: id, name, address, fund, status, city, state, zip, county, units,
// occupiedUnits, occupancyRate, avgRent, purchasePrice, estimatedValue,
// purchaseDate, yearAcquired, investmentThesis, impactThesis, sdgs[]
// ---------------------------------------------------------------------------

export const assets = [
"""

footer = f"""];

// Stated once for the whole portfolio on /assets, rather than badged per asset.
export const PORTFOLIO_SDGS = {json.dumps(PORTFOLIO_SDGS)};

export const SDG_LABELS = {{
  1: 'No Poverty', 3: 'Good Health & Well-being', 5: 'Gender Equality',
  6: 'Clean Water', 7: 'Affordable & Clean Energy', 10: 'Reduced Inequalities',
  11: 'Sustainable Cities',
}};

export const FUNDS = ["Proactive Realty Income Fund", "Proactive Realty Income Fund II, LLC", "Proactive QOZ Fund I, LLC"];
export const STATUSES = ['In Review', 'Under Contract', 'Acquired', 'Sold'];
"""

OUT.write_text(header + body + "\n" + footer)
print(f"wrote {OUT}  ({len(assets)} assets, {units} units, ${value:,.0f}, {len(states)} states)")
