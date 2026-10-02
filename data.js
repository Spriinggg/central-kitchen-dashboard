// ===== Central Kitchen Dashboard — reference data =====
// Standard recipes + product-to-recipe map. Edit here to update recipe standards.
// Recipes sourced from the Codemax "Recipes Listing" report (full formula, incl. ingredient item codes),
// so usage variance can match actual ERP consumption by item code rather than by name.

window.__RECIPES__ = {
  "source": "US Pizza Center Kitchen - Codemax Recipes Listing (full formula, item-coded)",
  "recipe_count": 35,
  "categories": [
    "DOUGH",
    "MEAT",
    "PREMIX",
    "SAUCES",
    "SIDE DISHES"
  ],
  "recipes": [
    {
      "code": "RCP-00001",
      "name": "Frozen Dough Large 380g",
      "category": "DOUGH",
      "yield_qty": 105,
      "yield_unit": "PCS",
      "dimension": "380G X 15 PIECES X 1 PACKET",
      "ingredients": [
        {
          "name": "NYLON PE 14X20 (2KG) (60PCS X 15PKT X 1CTN)",
          "code": "CKRM00067",
          "group": "PACKAGING",
          "qty": 7,
          "unit": "PCS",
          "per_unit": 0.0667,
          "grams_per_unit": null
        },
        {
          "name": "PIZZA MIX 15KG",
          "code": "USRW00347",
          "group": "FOOD",
          "qty": 850,
          "unit": "GM",
          "per_unit": 8.0952,
          "grams_per_unit": 8.095
        },
        {
          "name": "INSTANT YEAST (500GM X 20PKT X 1CTN)",
          "code": "CKRM00035",
          "group": "FOOD",
          "qty": 250,
          "unit": "GM",
          "per_unit": 2.381,
          "grams_per_unit": 2.381
        },
        {
          "name": "ICE",
          "code": "USRW00072",
          "group": "BEVERAGE",
          "qty": 7125,
          "unit": "GM",
          "per_unit": 67.8571,
          "grams_per_unit": 67.857
        },
        {
          "name": "PINNACLE  BREAD IMPROVER - VOLTEX",
          "code": "CKRM00069",
          "group": "FOOD",
          "qty": 125,
          "unit": "GM",
          "per_unit": 1.1905,
          "grams_per_unit": 1.19
        },
        {
          "name": "water",
          "code": "",
          "group": "",
          "qty": 7.125,
          "unit": "KG",
          "per_unit": 0.0679,
          "grams_per_unit": 67.857
        },
        {
          "name": "FLOUR GUNUNG MAS 25KG",
          "code": "CKRM00032",
          "group": "FOOD",
          "qty": 25,
          "unit": "KG",
          "per_unit": 0.2381,
          "grams_per_unit": 238.095
        },
        {
          "name": "17KG VESAWIT COOKING OIL (PET) ",
          "code": "CKRM00001",
          "group": "FOOD",
          "qty": 0.75,
          "unit": "KG",
          "per_unit": 0.0071,
          "grams_per_unit": 7.143
        },
        {
          "name": "CARTON BOX LARGE - US PIZZA 510MM X 310MM X 268MM TL150/M150/M150/TL150 ",
          "code": "CKRM00079",
          "group": "PACKAGING",
          "qty": 2,
          "unit": "PCS",
          "per_unit": 0.019,
          "grams_per_unit": null
        }
      ]
    },
    {
      "code": "RCP-00002",
      "name": "Frozen Dough Regular 210g",
      "category": "DOUGH",
      "yield_qty": 190,
      "yield_unit": "PCS",
      "dimension": "210G X 25 PIECES X 1 PACKET",
      "ingredients": [
        {
          "name": "17KG VESAWIT COOKING OIL (PET) ",
          "code": "CKRM00001",
          "group": "FOOD",
          "qty": 0.75,
          "unit": "KG",
          "per_unit": 0.0039,
          "grams_per_unit": 3.947
        },
        {
          "name": "water",
          "code": "",
          "group": "",
          "qty": 7.125,
          "unit": "KG",
          "per_unit": 0.0375,
          "grams_per_unit": 37.5
        },
        {
          "name": "FLOUR GUNUNG MAS 25KG",
          "code": "CKRM00032",
          "group": "FOOD",
          "qty": 25,
          "unit": "KG",
          "per_unit": 0.1316,
          "grams_per_unit": 131.579
        },
        {
          "name": "INSTANT YEAST (500GM X 20PKT X 1CTN)",
          "code": "CKRM00035",
          "group": "FOOD",
          "qty": 250,
          "unit": "GM",
          "per_unit": 1.3158,
          "grams_per_unit": 1.316
        },
        {
          "name": "PINNACLE  BREAD IMPROVER - VOLTEX",
          "code": "CKRM00069",
          "group": "FOOD",
          "qty": 125,
          "unit": "GM",
          "per_unit": 0.6579,
          "grams_per_unit": 0.658
        },
        {
          "name": "PIZZA MIX 15KG",
          "code": "USRW00347",
          "group": "FOOD",
          "qty": 850,
          "unit": "GM",
          "per_unit": 4.4737,
          "grams_per_unit": 4.474
        },
        {
          "name": "ICE",
          "code": "USRW00072",
          "group": "BEVERAGE",
          "qty": 7125,
          "unit": "GM",
          "per_unit": 37.5,
          "grams_per_unit": 37.5
        },
        {
          "name": "NYLON PE 14X20 (2KG) (60PCS X 15PKT X 1CTN)",
          "code": "CKRM00067",
          "group": "PACKAGING",
          "qty": 7,
          "unit": "PCS",
          "per_unit": 0.0368,
          "grams_per_unit": null
        },
        {
          "name": "CARTON BOX LARGE - US PIZZA 510MM X 310MM X 268MM TL150/M150/M150/TL150 ",
          "code": "CKRM00079",
          "group": "PACKAGING",
          "qty": 2,
          "unit": "PCS",
          "per_unit": 0.0105,
          "grams_per_unit": null
        }
      ]
    },
    {
      "code": "RCP-00003",
      "name": "Frozen Dough Personal 100g",
      "category": "DOUGH",
      "yield_qty": 400,
      "yield_unit": "PCS",
      "dimension": "100G X 50 PIECES X 1 PACKET",
      "ingredients": [
        {
          "name": "CARTON BOX LARGE - US PIZZA 510MM X 310MM X 268MM TL150/M150/M150/TL150 ",
          "code": "CKRM00079",
          "group": "PACKAGING",
          "qty": 2,
          "unit": "PCS",
          "per_unit": 0.005,
          "grams_per_unit": null
        },
        {
          "name": "NYLON PE 14X20 (2KG) (60PCS X 15PKT X 1CTN)",
          "code": "CKRM00067",
          "group": "PACKAGING",
          "qty": 8,
          "unit": "PCS",
          "per_unit": 0.02,
          "grams_per_unit": null
        },
        {
          "name": "PIZZA MIX 15KG",
          "code": "USRW00347",
          "group": "FOOD",
          "qty": 850,
          "unit": "GM",
          "per_unit": 2.125,
          "grams_per_unit": 2.125
        },
        {
          "name": "ICE",
          "code": "USRW00072",
          "group": "BEVERAGE",
          "qty": 7125,
          "unit": "GM",
          "per_unit": 17.8125,
          "grams_per_unit": 17.812
        },
        {
          "name": "INSTANT YEAST (500GM X 20PKT X 1CTN)",
          "code": "CKRM00035",
          "group": "FOOD",
          "qty": 250,
          "unit": "GM",
          "per_unit": 0.625,
          "grams_per_unit": 0.625
        },
        {
          "name": "PINNACLE  BREAD IMPROVER - VOLTEX",
          "code": "CKRM00069",
          "group": "FOOD",
          "qty": 125,
          "unit": "GM",
          "per_unit": 0.3125,
          "grams_per_unit": 0.312
        },
        {
          "name": "FLOUR GUNUNG MAS 25KG",
          "code": "CKRM00032",
          "group": "FOOD",
          "qty": 25,
          "unit": "KG",
          "per_unit": 0.0625,
          "grams_per_unit": 62.5
        },
        {
          "name": "water",
          "code": "",
          "group": "",
          "qty": 7.125,
          "unit": "KG",
          "per_unit": 0.0178,
          "grams_per_unit": 17.812
        },
        {
          "name": "17KG VESAWIT COOKING OIL (PET) ",
          "code": "CKRM00001",
          "group": "FOOD",
          "qty": 0.75,
          "unit": "KG",
          "per_unit": 0.0019,
          "grams_per_unit": 1.875
        }
      ]
    },
    {
      "code": "RCP-00004",
      "name": "Burger Bun",
      "category": "DOUGH",
      "yield_qty": 120,
      "yield_unit": "PCS",
      "dimension": "12 PIECES X 1 PACKET",
      "ingredients": [
        {
          "name": "EGG GRADE A (1 TRAY)",
          "code": "USRW00046",
          "group": "FOOD",
          "qty": 15,
          "unit": "PCS",
          "per_unit": 0.125,
          "grams_per_unit": null
        },
        {
          "name": "40KG AUSTRALIAN FINE SALT",
          "code": "CKRM00002",
          "group": "FOOD",
          "qty": 0.084,
          "unit": "KG",
          "per_unit": 0.0007,
          "grams_per_unit": 0.7
        },
        {
          "name": "FLOUR GUNUNG MAS 25KG",
          "code": "CKRM00032",
          "group": "FOOD",
          "qty": 5,
          "unit": "KG",
          "per_unit": 0.0417,
          "grams_per_unit": 41.667
        },
        {
          "name": "water",
          "code": "",
          "group": "",
          "qty": 1.28,
          "unit": "KG",
          "per_unit": 0.0107,
          "grams_per_unit": 10.667
        },
        {
          "name": "P1 SUGAR (50KG X GUNI)",
          "code": "CKRM00063",
          "group": "FOOD",
          "qty": 0.6,
          "unit": "KG",
          "per_unit": 0.005,
          "grams_per_unit": 5.0
        },
        {
          "name": "ANCHOR SALTED BUTTER 25KG",
          "code": "CKRM00005",
          "group": "FOOD",
          "qty": 0.36,
          "unit": "KG",
          "per_unit": 0.003,
          "grams_per_unit": 3.0
        },
        {
          "name": "CARTON BOX LARGE - US PIZZA 510MM X 310MM X 268MM TL150/M150/M150/TL150 ",
          "code": "CKRM00079",
          "group": "PACKAGING",
          "qty": 3,
          "unit": "PCS",
          "per_unit": 0.025,
          "grams_per_unit": null
        },
        {
          "name": "NYLON PE 14X20 (2KG) (60PCS X 15PKT X 1CTN)",
          "code": "CKRM00067",
          "group": "PACKAGING",
          "qty": 10,
          "unit": "PCS",
          "per_unit": 0.0833,
          "grams_per_unit": null
        },
        {
          "name": "ICE",
          "code": "USRW00072",
          "group": "BEVERAGE",
          "qty": 800,
          "unit": "GM",
          "per_unit": 6.6667,
          "grams_per_unit": 6.667
        },
        {
          "name": "INSTANT YEAST (500GM X 20PKT X 1CTN)",
          "code": "CKRM00035",
          "group": "FOOD",
          "qty": 76,
          "unit": "GM",
          "per_unit": 0.6333,
          "grams_per_unit": 0.633
        }
      ]
    },
    {
      "code": "RCP-00005",
      "name": "Italiano Chicken",
      "category": "MEAT",
      "yield_qty": 62,
      "yield_unit": "PKT",
      "dimension": "1 KG X 1 PKT",
      "ingredients": [
        {
          "name": "HOSEN PURE HONEY (1KG X 12TUB X 1CTN)",
          "code": "USRW00070",
          "group": "FOOD",
          "qty": 0.75,
          "unit": "KG",
          "per_unit": 0.0121,
          "grams_per_unit": 12.097
        },
        {
          "name": "KNORR ITALIAN HERB PASTE (1.5KG X 6PKT X 1CTN)",
          "code": "CKRM00038",
          "group": "FOOD",
          "qty": 4.5,
          "unit": "KG",
          "per_unit": 0.0726,
          "grams_per_unit": 72.581
        },
        {
          "name": "SBL FREE SIZE (FROZEN) (PER KG)",
          "code": "CKRM00072",
          "group": "FOOD",
          "qty": 100,
          "unit": "KG",
          "per_unit": 1.6129,
          "grams_per_unit": 1612.903
        },
        {
          "name": "MIXED HERBS WHOLE (1KG X PKT)",
          "code": "USRW00104",
          "group": "FOOD",
          "qty": 0.07,
          "unit": "KG",
          "per_unit": 0.0011,
          "grams_per_unit": 1.129
        },
        {
          "name": "17KG VESAWIT COOKING OIL (PET) ",
          "code": "CKRM00001",
          "group": "FOOD",
          "qty": 1.5,
          "unit": "KG",
          "per_unit": 0.0242,
          "grams_per_unit": 24.194
        },
        {
          "name": "CARTON BOX MEDIUM - US PIZZA 420MM X 320MM X 220MM TL150/M150/M150/TL150 ",
          "code": "CKRM00080",
          "group": "PACKAGING",
          "qty": 7,
          "unit": "PCS",
          "per_unit": 0.1129,
          "grams_per_unit": null
        },
        {
          "name": "NYLON 8X12 (100PCS X PKT)",
          "code": "CKRM00059",
          "group": "PACKAGING",
          "qty": 62,
          "unit": "PCS",
          "per_unit": 1.0,
          "grams_per_unit": null
        }
      ]
    },
    {
      "code": "RCP-00006",
      "name": "Spicy Chicken",
      "category": "MEAT",
      "yield_qty": 110,
      "yield_unit": "PKT",
      "dimension": "500 GM X 1 PKT",
      "ingredients": [
        {
          "name": "NYLON 8X12 (100PCS X PKT)",
          "code": "CKRM00059",
          "group": "PACKAGING",
          "qty": 110,
          "unit": "PCS",
          "per_unit": 1.0,
          "grams_per_unit": null
        },
        {
          "name": "CARTON BOX SMALL - US PIZZA 250MM X 200MM X 180MM TL150/M120/M120/TL150 ",
          "code": "CKRM00081",
          "group": "PACKAGING",
          "qty": 25,
          "unit": "PCS",
          "per_unit": 0.2273,
          "grams_per_unit": null
        },
        {
          "name": "40KG AUSTRALIAN FINE SALT",
          "code": "CKRM00002",
          "group": "FOOD",
          "qty": 0.8,
          "unit": "KG",
          "per_unit": 0.0073,
          "grams_per_unit": 7.273
        },
        {
          "name": "BABAS CHILI POWDER (1KG X 10PKT X 1CTN)",
          "code": "USRW00015",
          "group": "FOOD",
          "qty": 1,
          "unit": "KG",
          "per_unit": 0.0091,
          "grams_per_unit": 9.091
        },
        {
          "name": "SBL FREE SIZE (FROZEN) (PER KG)",
          "code": "CKRM00072",
          "group": "FOOD",
          "qty": 100,
          "unit": "KG",
          "per_unit": 0.9091,
          "grams_per_unit": 909.091
        },
        {
          "name": "BABAS MEAT CURRY POWDER (1KG X 10PKT X 1CTN)",
          "code": "CKRM00009",
          "group": "FOOD",
          "qty": 0.9,
          "unit": "KG",
          "per_unit": 0.0082,
          "grams_per_unit": 8.182
        }
      ]
    },
    {
      "code": "RCP-00007",
      "name": "Ground Beef",
      "category": "MEAT",
      "yield_qty": 62,
      "yield_unit": "PKT",
      "dimension": "200 G X 1 PKT",
      "ingredients": [
        {
          "name": "P1 SUGAR (50KG X GUNI)",
          "code": "CKRM00063",
          "group": "FOOD",
          "qty": 1.2,
          "unit": "KG",
          "per_unit": 0.0194,
          "grams_per_unit": 19.355
        },
        {
          "name": "MIXED HERBS WHOLE (1KG X PKT)",
          "code": "USRW00104",
          "group": "FOOD",
          "qty": 0.15,
          "unit": "KG",
          "per_unit": 0.0024,
          "grams_per_unit": 2.419
        },
        {
          "name": "MINCED BEEF (2.5KG X PKT)",
          "code": "CKRM00051",
          "group": "FOOD",
          "qty": 25,
          "unit": "KG",
          "per_unit": 0.4032,
          "grams_per_unit": 403.226
        },
        {
          "name": "NYLON BAG 6X9 INCH (100PCS X PKT)",
          "code": "CKRM00060",
          "group": "PACKAGING",
          "qty": 62,
          "unit": "PCS",
          "per_unit": 1.0,
          "grams_per_unit": null
        },
        {
          "name": "CARTON BOX SMALL - US PIZZA 250MM X 200MM X 180MM TL150/M120/M120/TL150 ",
          "code": "CKRM00081",
          "group": "PACKAGING",
          "qty": 7,
          "unit": "PCS",
          "per_unit": 0.1129,
          "grams_per_unit": null
        }
      ]
    },
    {
      "code": "RCP-00008",
      "name": "Chicken Wing",
      "category": "MEAT",
      "yield_qty": 36,
      "yield_unit": "PKT",
      "dimension": "30 PAIRS X 1 PKT",
      "ingredients": [
        {
          "name": "NYLON 12X18 (200PCS X PKT)",
          "code": "CKRM00058",
          "group": "PACKAGING",
          "qty": 36,
          "unit": "PCS",
          "per_unit": 1.0,
          "grams_per_unit": null
        },
        {
          "name": "CARTON BOX LARGE - US PIZZA 510MM X 310MM X 268MM TL150/M150/M150/TL150 ",
          "code": "CKRM00079",
          "group": "PACKAGING",
          "qty": 4,
          "unit": "PCS",
          "per_unit": 0.1111,
          "grams_per_unit": null
        },
        {
          "name": "BABAS CHILI POWDER (1KG X 10PKT X 1CTN)",
          "code": "USRW00015",
          "group": "FOOD",
          "qty": 0.9,
          "unit": "KG",
          "per_unit": 0.025,
          "grams_per_unit": 25.0
        },
        {
          "name": "MID JOINT WING (PER KG)",
          "code": "CKRM00050",
          "group": "FOOD",
          "qty": 40,
          "unit": "KG",
          "per_unit": 1.1111,
          "grams_per_unit": 1111.111
        },
        {
          "name": "BABAS MEAT CURRY POWDER (1KG X 10PKT X 1CTN)",
          "code": "CKRM00009",
          "group": "FOOD",
          "qty": 0.9,
          "unit": "KG",
          "per_unit": 0.025,
          "grams_per_unit": 25.0
        },
        {
          "name": "40KG AUSTRALIAN FINE SALT",
          "code": "CKRM00002",
          "group": "FOOD",
          "qty": 0.9,
          "unit": "KG",
          "per_unit": 0.025,
          "grams_per_unit": 25.0
        },
        {
          "name": "DRUMMET (WING) (PER KG)",
          "code": "CKRM00027",
          "group": "FOOD",
          "qty": 60,
          "unit": "KG",
          "per_unit": 1.6667,
          "grams_per_unit": 1666.667
        }
      ]
    },
    {
      "code": "RCP-00009",
      "name": "Beef Patty",
      "category": "MEAT",
      "yield_qty": 64,
      "yield_unit": "PKT",
      "dimension": "4 PCS X 1 PKT",
      "ingredients": [
        {
          "name": "AUST BRISKET (PER KG)",
          "code": "CKRM00007",
          "group": "FOOD",
          "qty": 25,
          "unit": "KG",
          "per_unit": 0.3906,
          "grams_per_unit": 390.625
        },
        {
          "name": "AUST BEEF CHUCK ROLL (PER KG)",
          "code": "CKRM00006",
          "group": "FOOD",
          "qty": 8,
          "unit": "KG",
          "per_unit": 0.125,
          "grams_per_unit": 125.0
        },
        {
          "name": "NYLON 8X12 (100PCS X PKT)",
          "code": "CKRM00059",
          "group": "PACKAGING",
          "qty": 64,
          "unit": "PCS",
          "per_unit": 1.0,
          "grams_per_unit": null
        },
        {
          "name": "PLASTIC - HM 6 X 9 (500GM X 60PKT X GUNI) - FOR SPAGHETTI",
          "code": "USRW00065",
          "group": "PACKAGING",
          "qty": 0.5,
          "unit": "PKT",
          "per_unit": 0.0078,
          "grams_per_unit": null
        }
      ]
    },
    {
      "code": "RCP-00010",
      "name": "Chicken Patty",
      "category": "MEAT",
      "yield_qty": 44,
      "yield_unit": "PKT",
      "dimension": "4 PCS X 1 PKT",
      "ingredients": [
        {
          "name": "PLASTIC - HM 6 X 9 (500GM X 60PKT X GUNI) - FOR SPAGHETTI",
          "code": "USRW00065",
          "group": "PACKAGING",
          "qty": 0.5,
          "unit": "PKT",
          "per_unit": 0.0114,
          "grams_per_unit": null
        },
        {
          "name": "40KG AUSTRALIAN FINE SALT",
          "code": "CKRM00002",
          "group": "FOOD",
          "qty": 0.24,
          "unit": "KG",
          "per_unit": 0.0055,
          "grams_per_unit": 5.455
        },
        {
          "name": "ANCHOR SALTED BUTTER 25KG",
          "code": "CKRM00005",
          "group": "FOOD",
          "qty": 0.6,
          "unit": "KG",
          "per_unit": 0.0136,
          "grams_per_unit": 13.636
        },
        {
          "name": "BONELESS BREAST SKIN ON ( PER KG )",
          "code": "CKRM00014",
          "group": "FOOD",
          "qty": 24,
          "unit": "KG",
          "per_unit": 0.5455,
          "grams_per_unit": 545.455
        },
        {
          "name": "WHITE PEPPER (500GM X PKT)",
          "code": "CKRM00083",
          "group": "FOOD",
          "qty": 0.24,
          "unit": "KG",
          "per_unit": 0.0055,
          "grams_per_unit": 5.455
        },
        {
          "name": "NYLON 8X12 (100PCS X PKT)",
          "code": "CKRM00059",
          "group": "PACKAGING",
          "qty": 44,
          "unit": "PCS",
          "per_unit": 1.0,
          "grams_per_unit": null
        }
      ]
    },
    {
      "code": "RCP-00011",
      "name": "Umami Beef Sauce",
      "category": "MEAT",
      "yield_qty": 3,
      "yield_unit": "PKT",
      "dimension": "500 G X 1 PKT",
      "ingredients": [
        {
          "name": "NYLON BAG 6X9 INCH (100PCS X PKT)",
          "code": "CKRM00060",
          "group": "PACKAGING",
          "qty": 3,
          "unit": "PCS",
          "per_unit": 1.0,
          "grams_per_unit": null
        },
        {
          "name": "MOREHOUSE PURE MUSTARD 1 GAL",
          "code": "CKRM00057",
          "group": "FOOD",
          "qty": 130,
          "unit": "GM",
          "per_unit": 43.3333,
          "grams_per_unit": 43.333
        },
        {
          "name": "ANCHOR SALTED BUTTER 25KG",
          "code": "CKRM00005",
          "group": "FOOD",
          "qty": 30,
          "unit": "GM",
          "per_unit": 10.0,
          "grams_per_unit": 10.0
        },
        {
          "name": "HEINZ ORIGINAL BBQ SAUCE (2.2KG X 6BTL X 1CTN)",
          "code": "USRW00064",
          "group": "FOOD",
          "qty": 350,
          "unit": "GM",
          "per_unit": 116.6667,
          "grams_per_unit": 116.667
        },
        {
          "name": "LEA PERRIN SAUCE (290ML X 12BTL X 1CTN)",
          "code": "CKRM00045",
          "group": "FOOD",
          "qty": 10,
          "unit": "GM",
          "per_unit": 3.3333,
          "grams_per_unit": 3.333
        },
        {
          "name": "BROWN SUGAR",
          "code": "CKRM00015",
          "group": "FOOD",
          "qty": 130,
          "unit": "GM",
          "per_unit": 43.3333,
          "grams_per_unit": 43.333
        },
        {
          "name": "BLACK PEPPER COARSE (1KG X PKT)",
          "code": "USRW00022",
          "group": "FOOD",
          "qty": 25,
          "unit": "GM",
          "per_unit": 8.3333,
          "grams_per_unit": 8.333
        },
        {
          "name": "MINCED BEEF (2.5KG X PKT)",
          "code": "CKRM00051",
          "group": "FOOD",
          "qty": 0.9,
          "unit": "KG",
          "per_unit": 0.3,
          "grams_per_unit": 300.0
        },
        {
          "name": "LIFE TOMATO KETCHUP (1KG X 12PKT X 1CTN)",
          "code": "CKRM00048",
          "group": "FOOD",
          "qty": 0.38,
          "unit": "KG",
          "per_unit": 0.1267,
          "grams_per_unit": 126.667
        }
      ]
    },
    {
      "code": "RCP-00012",
      "name": "Ice Tea Premix",
      "category": "PREMIX",
      "yield_qty": 1,
      "yield_unit": "PKT",
      "dimension": "1 KG X 1 PKT",
      "ingredients": [
        {
          "name": "P1 SUGAR (50KG X GUNI)",
          "code": "CKRM00063",
          "group": "FOOD",
          "qty": 1,
          "unit": "KG",
          "per_unit": 1.0,
          "grams_per_unit": 1000.0
        },
        {
          "name": "LIPTON EXTRA KAW CATERING POTBAG (12GM X 10PCS X 36PKT X 1CTN)",
          "code": "CKRM00049",
          "group": "BEVERAGE",
          "qty": 3,
          "unit": "PCS",
          "per_unit": 3.0,
          "grams_per_unit": null
        },
        {
          "name": "CARTON BOX MEDIUM - US PIZZA 420MM X 320MM X 220MM TL150/M150/M150/TL150 ",
          "code": "CKRM00080",
          "group": "PACKAGING",
          "qty": 0.1,
          "unit": "PCS",
          "per_unit": 0.1,
          "grams_per_unit": null
        },
        {
          "name": "NYLON 8X12 (100PCS X PKT)",
          "code": "CKRM00059",
          "group": "PACKAGING",
          "qty": 1,
          "unit": "PCS",
          "per_unit": 1.0,
          "grams_per_unit": null
        }
      ]
    },
    {
      "code": "RCP-00013",
      "name": "Mushroom Soup Premix",
      "category": "PREMIX",
      "yield_qty": 1,
      "yield_unit": "PKT",
      "dimension": "1 PKT",
      "ingredients": [
        {
          "name": "NYLON BAG 6X9 INCH (100PCS X PKT)",
          "code": "CKRM00060",
          "group": "PACKAGING",
          "qty": 1,
          "unit": "PCS",
          "per_unit": 1.0,
          "grams_per_unit": null
        },
        {
          "name": "CARTON BOX SMALL - US PIZZA 250MM X 200MM X 180MM TL150/M120/M120/TL150 ",
          "code": "CKRM00081",
          "group": "PACKAGING",
          "qty": 0.1,
          "unit": "PCS",
          "per_unit": 0.1,
          "grams_per_unit": null
        },
        {
          "name": "KNORR CHICKEN STOCK (1KG X 8PKT X 1CTN)",
          "code": "USRW00076",
          "group": "FOOD",
          "qty": 0.025,
          "unit": "KG",
          "per_unit": 0.025,
          "grams_per_unit": 25.0
        },
        {
          "name": "TEPUNG UBI KAYU 3A (20KG X PKT)",
          "code": "CKRM00076",
          "group": "FOOD",
          "qty": 0.04,
          "unit": "KG",
          "per_unit": 0.04,
          "grams_per_unit": 40.0
        },
        {
          "name": "KNORR CREAM OF MUSHROOM SOUP (1KG X 6PKT X 1CTN)",
          "code": "CKRM00036",
          "group": "FOOD",
          "qty": 0.25,
          "unit": "KG",
          "per_unit": 0.25,
          "grams_per_unit": 250.0
        }
      ]
    },
    {
      "code": "RCP-00014",
      "name": "Dough Premix",
      "category": "PREMIX",
      "yield_qty": 1,
      "yield_unit": "PKT",
      "dimension": "1 PKT",
      "ingredients": [
        {
          "name": "PIZZA MIX 15KG",
          "code": "USRW00347",
          "group": "FOOD",
          "qty": 340,
          "unit": "GM",
          "per_unit": 340.0,
          "grams_per_unit": 340.0
        },
        {
          "name": "PINNACLE  BREAD IMPROVER - VOLTEX",
          "code": "CKRM00069",
          "group": "FOOD",
          "qty": 50,
          "unit": "GM",
          "per_unit": 50.0,
          "grams_per_unit": 50.0
        },
        {
          "name": "INSTANT YEAST (500GM X 20PKT X 1CTN)",
          "code": "CKRM00035",
          "group": "FOOD",
          "qty": 100,
          "unit": "GM",
          "per_unit": 100.0,
          "grams_per_unit": 100.0
        },
        {
          "name": "NYLON BAG 6X9 INCH (100PCS X PKT)",
          "code": "CKRM00060",
          "group": "PACKAGING",
          "qty": 1,
          "unit": "PCS",
          "per_unit": 1.0,
          "grams_per_unit": null
        }
      ]
    },
    {
      "code": "RCP-00015",
      "name": "Cinnamon Sugar Premix",
      "category": "PREMIX",
      "yield_qty": 11,
      "yield_unit": "PKT",
      "dimension": "1 KG X 1 PKT",
      "ingredients": [
        {
          "name": "NYLON 8X12 (100PCS X PKT)",
          "code": "CKRM00059",
          "group": "PACKAGING",
          "qty": 11,
          "unit": "PCS",
          "per_unit": 1.0,
          "grams_per_unit": null
        },
        {
          "name": "P1 SUGAR (50KG X GUNI)",
          "code": "CKRM00063",
          "group": "FOOD",
          "qty": 10,
          "unit": "KG",
          "per_unit": 0.9091,
          "grams_per_unit": 909.091
        },
        {
          "name": "CINNAMON POWDER (1KG X PKT)",
          "code": "CKRM00022",
          "group": "FOOD",
          "qty": 1,
          "unit": "KG",
          "per_unit": 0.0909,
          "grams_per_unit": 90.909
        }
      ]
    },
    {
      "code": "RCP-00016",
      "name": "Pickle Jam",
      "category": "SAUCES",
      "yield_qty": 1,
      "yield_unit": "PKT",
      "dimension": "500G X 1 PKT",
      "ingredients": [
        {
          "name": "HOSEN PURE HONEY (1KG X 12TUB X 1CTN)",
          "code": "USRW00070",
          "group": "FOOD",
          "qty": 100,
          "unit": "GM",
          "per_unit": 100.0,
          "grams_per_unit": 100.0
        },
        {
          "name": "HOSEN SELECT GHERKINS 12/680GM",
          "code": "CKRM00034",
          "group": "FOOD",
          "qty": 400,
          "unit": "GM",
          "per_unit": 400.0,
          "grams_per_unit": 400.0
        },
        {
          "name": "NYLON BAG 6X9 INCH (100PCS X PKT)",
          "code": "CKRM00060",
          "group": "PACKAGING",
          "qty": 1,
          "unit": "PCS",
          "per_unit": 1.0,
          "grams_per_unit": null
        }
      ]
    },
    {
      "code": "RCP-00017",
      "name": "MARSHALL'S SAUCE (500G)",
      "category": "SAUCES",
      "yield_qty": 8,
      "yield_unit": "PKT",
      "dimension": "500G X 1 PKT",
      "ingredients": [
        {
          "name": "NYLON BAG 6X9 INCH (100PCS X PKT)",
          "code": "CKRM00060",
          "group": "PACKAGING",
          "qty": 8,
          "unit": "PCS",
          "per_unit": 1.0,
          "grams_per_unit": null
        },
        {
          "name": "40KG AUSTRALIAN FINE SALT",
          "code": "CKRM00002",
          "group": "FOOD",
          "qty": 60,
          "unit": "GM",
          "per_unit": 7.5,
          "grams_per_unit": 7.5
        },
        {
          "name": "LIFE TOMATO KETCHUP (1KG X 12PKT X 1CTN)",
          "code": "CKRM00048",
          "group": "FOOD",
          "qty": 600,
          "unit": "GM",
          "per_unit": 75.0,
          "grams_per_unit": 75.0
        },
        {
          "name": "MOREHOUSE PURE MUSTARD 1 GAL",
          "code": "CKRM00057",
          "group": "FOOD",
          "qty": 280,
          "unit": "GM",
          "per_unit": 35.0,
          "grams_per_unit": 35.0
        },
        {
          "name": "LEA PERRIN SAUCE (290ML X 12BTL X 1CTN)",
          "code": "CKRM00045",
          "group": "FOOD",
          "qty": 75,
          "unit": "GM",
          "per_unit": 9.375,
          "grams_per_unit": 9.375
        },
        {
          "name": "BROWN SUGAR",
          "code": "CKRM00015",
          "group": "FOOD",
          "qty": 20,
          "unit": "GM",
          "per_unit": 2.5,
          "grams_per_unit": 2.5
        },
        {
          "name": "CAYENNE POWDER (1KG X PKT)",
          "code": "CKRM00019",
          "group": "FOOD",
          "qty": 20,
          "unit": "GM",
          "per_unit": 2.5,
          "grams_per_unit": 2.5
        },
        {
          "name": "LIFE CHILI SAUCE (1KG X 12PKT X 1CTN)",
          "code": "CKRM00047",
          "group": "FOOD",
          "qty": 600,
          "unit": "GM",
          "per_unit": 75.0,
          "grams_per_unit": 75.0
        },
        {
          "name": "LADY'S CHOICE MAYO MAGIC (3L X 4TUB X 1CTN)",
          "code": "CKRM00043",
          "group": "FOOD",
          "qty": 2500,
          "unit": "GM",
          "per_unit": 312.5,
          "grams_per_unit": 312.5
        },
        {
          "name": "TABASCO SAUCE (60ML X 12PCS X 1CTN)",
          "code": "USRW00173",
          "group": "FOOD",
          "qty": 45,
          "unit": "ML",
          "per_unit": 5.625,
          "grams_per_unit": 5.625
        }
      ]
    },
    {
      "code": "RCP-00018",
      "name": "MARSHALL'S SPICY SAUCE (500G)",
      "category": "SAUCES",
      "yield_qty": 6,
      "yield_unit": "PKT",
      "dimension": "500G X 1 PKT",
      "ingredients": [
        {
          "name": "MOREHOUSE PURE MUSTARD 1 GAL",
          "code": "CKRM00057",
          "group": "FOOD",
          "qty": 170,
          "unit": "GM",
          "per_unit": 28.3333,
          "grams_per_unit": 28.333
        },
        {
          "name": "BROWN SUGAR",
          "code": "CKRM00015",
          "group": "FOOD",
          "qty": 0.04,
          "unit": "KG",
          "per_unit": 0.0067,
          "grams_per_unit": 6.667
        },
        {
          "name": "BLACK PEPPER COARSE (1KG X PKT)",
          "code": "USRW00022",
          "group": "FOOD",
          "qty": 0.02,
          "unit": "KG",
          "per_unit": 0.0033,
          "grams_per_unit": 3.333
        },
        {
          "name": "LEA PERRIN SAUCE (290ML X 12BTL X 1CTN)",
          "code": "CKRM00045",
          "group": "FOOD",
          "qty": 0.1,
          "unit": "KG",
          "per_unit": 0.0167,
          "grams_per_unit": 16.667
        },
        {
          "name": "HEINZ ORIGINAL BBQ SAUCE (2.2KG X 6BTL X 1CTN)",
          "code": "USRW00064",
          "group": "FOOD",
          "qty": 0.2,
          "unit": "KG",
          "per_unit": 0.0333,
          "grams_per_unit": 33.333
        },
        {
          "name": "LIFE CHILI SAUCE (1KG X 12PKT X 1CTN)",
          "code": "CKRM00047",
          "group": "FOOD",
          "qty": 2,
          "unit": "KG",
          "per_unit": 0.3333,
          "grams_per_unit": 333.333
        },
        {
          "name": "LIFE TOMATO KETCHUP (1KG X 12PKT X 1CTN)",
          "code": "CKRM00048",
          "group": "FOOD",
          "qty": 1,
          "unit": "KG",
          "per_unit": 0.1667,
          "grams_per_unit": 166.667
        },
        {
          "name": "NYLON BAG 6X9 INCH (100PCS X PKT)",
          "code": "CKRM00060",
          "group": "PACKAGING",
          "qty": 6,
          "unit": "PCS",
          "per_unit": 1.0,
          "grams_per_unit": null
        }
      ]
    },
    {
      "code": "RCP-00019",
      "name": "MARSHAL'S NACHO CHEESE SAUCE (500G)",
      "category": "SAUCES",
      "yield_qty": 20,
      "yield_unit": "PKT",
      "dimension": "500 G X 1 PKT",
      "ingredients": [
        {
          "name": "water",
          "code": "",
          "group": "",
          "qty": 2,
          "unit": "LTR",
          "per_unit": 0.1,
          "grams_per_unit": 100.0
        },
        {
          "name": "NYLON BAG 6X9 INCH (100PCS X PKT)",
          "code": "CKRM00060",
          "group": "PACKAGING",
          "qty": 10,
          "unit": "PCS",
          "per_unit": 0.5,
          "grams_per_unit": null
        },
        {
          "name": "SWISS BEAR NACHO CHEESE SAUCE 1KG/12PKT/CTN ",
          "code": "USRW00171",
          "group": "FOOD",
          "qty": 10000,
          "unit": "GM",
          "per_unit": 500.0,
          "grams_per_unit": 500.0
        }
      ]
    },
    {
      "code": "RCP-00020",
      "name": "MY US BOLOGNESE SAUCE (500GM)",
      "category": "SAUCES",
      "yield_qty": 100,
      "yield_unit": "PKT",
      "dimension": "500G X 1 PKT",
      "ingredients": [
        {
          "name": "P1 SUGAR (50KG X GUNI)",
          "code": "CKRM00063",
          "group": "FOOD",
          "qty": 0.5,
          "unit": "KG",
          "per_unit": 0.005,
          "grams_per_unit": 5.0
        },
        {
          "name": "PALMDALE TOMATO PUREE (3KG X 6TIN X 1CTN)",
          "code": "CKRM00065",
          "group": "FOOD",
          "qty": 18,
          "unit": "KG",
          "per_unit": 0.18,
          "grams_per_unit": 180.0
        },
        {
          "name": "ANCHOR SALTED BUTTER 25KG",
          "code": "CKRM00005",
          "group": "FOOD",
          "qty": 2.5,
          "unit": "KG",
          "per_unit": 0.025,
          "grams_per_unit": 25.0
        },
        {
          "name": "MINCED CHICKEN (PER KG)",
          "code": "CKRM00052",
          "group": "FOOD",
          "qty": 24,
          "unit": "KG",
          "per_unit": 0.24,
          "grams_per_unit": 240.0
        },
        {
          "name": "KNORR CHICKEN STOCK (1KG X 8PKT X 1CTN)",
          "code": "USRW00076",
          "group": "FOOD",
          "qty": 1.7,
          "unit": "KG",
          "per_unit": 0.017,
          "grams_per_unit": 17.0
        },
        {
          "name": "BAY LEAVE WHOLE (500GM X PKT)",
          "code": "CKRM00013",
          "group": "FOOD",
          "qty": 0.02,
          "unit": "KG",
          "per_unit": 0.0002,
          "grams_per_unit": 0.2
        },
        {
          "name": "BLACK PEPPER COARSE (1KG X PKT)",
          "code": "USRW00022",
          "group": "FOOD",
          "qty": 0.12,
          "unit": "KG",
          "per_unit": 0.0012,
          "grams_per_unit": 1.2
        },
        {
          "name": "HOSEN MUSHROOM SLICED (2.84KG X 6TIN X 1CTN)",
          "code": "USRW00067",
          "group": "FOOD",
          "qty": 2.84,
          "unit": "KG",
          "per_unit": 0.0284,
          "grams_per_unit": 28.4
        },
        {
          "name": "MIXED HERBS WHOLE (1KG X PKT)",
          "code": "USRW00104",
          "group": "FOOD",
          "qty": 0.12,
          "unit": "KG",
          "per_unit": 0.0012,
          "grams_per_unit": 1.2
        },
        {
          "name": "GARLIC PEELED (PER KG)",
          "code": "CKRM00030",
          "group": "FOOD",
          "qty": 0.6,
          "unit": "KG",
          "per_unit": 0.006,
          "grams_per_unit": 6.0
        },
        {
          "name": "CELERY (PER KG)",
          "code": "CKRM00020",
          "group": "FOOD",
          "qty": 2,
          "unit": "KG",
          "per_unit": 0.02,
          "grams_per_unit": 20.0
        },
        {
          "name": "YELLOW ONION",
          "code": "USRW00189",
          "group": "FOOD",
          "qty": 5,
          "unit": "KG",
          "per_unit": 0.05,
          "grams_per_unit": 50.0
        },
        {
          "name": "water",
          "code": "",
          "group": "",
          "qty": 10,
          "unit": "LTR",
          "per_unit": 0.1,
          "grams_per_unit": 100.0
        },
        {
          "name": "CARROT (PER KG)",
          "code": "CKRM00018",
          "group": "FOOD",
          "qty": 2,
          "unit": "KG",
          "per_unit": 0.02,
          "grams_per_unit": 20.0
        },
        {
          "name": "NYLON BAG 6X9 INCH (100PCS X PKT)",
          "code": "CKRM00060",
          "group": "PACKAGING",
          "qty": 100,
          "unit": "PCS",
          "per_unit": 1.0,
          "grams_per_unit": null
        },
        {
          "name": "CARTON BOX SMALL - US PIZZA 250MM X 200MM X 180MM TL150/M120/M120/TL150 ",
          "code": "CKRM00081",
          "group": "PACKAGING",
          "qty": 10,
          "unit": "PCS",
          "per_unit": 0.1,
          "grams_per_unit": null
        }
      ]
    },
    {
      "code": "RCP-00021",
      "name": "MY US CARBONARA 2KG",
      "category": "SAUCES",
      "yield_qty": 18,
      "yield_unit": "PKT",
      "dimension": "2 KG X 1 PKT",
      "ingredients": [
        {
          "name": "ANCHOR EXTRA YIELD COOKING CREAM (1L X 12PKT X 1CTN)",
          "code": "CKRM00004",
          "group": "FOOD",
          "qty": 10,
          "unit": "LTR",
          "per_unit": 0.5556,
          "grams_per_unit": 555.556
        },
        {
          "name": "NYLON 8X12 (100PCS X PKT)",
          "code": "CKRM00059",
          "group": "PACKAGING",
          "qty": 37,
          "unit": "PCS",
          "per_unit": 2.0556,
          "grams_per_unit": null
        },
        {
          "name": "KNORR CHICKEN STOCK (1KG X 8PKT X 1CTN)",
          "code": "USRW00076",
          "group": "FOOD",
          "qty": 1.2,
          "unit": "KG",
          "per_unit": 0.0667,
          "grams_per_unit": 66.667
        },
        {
          "name": "FLOUR DIAMOND (25KG X 1GUNI)",
          "code": "CKRM00026",
          "group": "FOOD",
          "qty": 2,
          "unit": "KG",
          "per_unit": 0.1111,
          "grams_per_unit": 111.111
        },
        {
          "name": "GARLIC PEELED (PER KG)",
          "code": "CKRM00030",
          "group": "FOOD",
          "qty": 0.3,
          "unit": "KG",
          "per_unit": 0.0167,
          "grams_per_unit": 16.667
        },
        {
          "name": "BLACK PEPPER COARSE (1KG X PKT)",
          "code": "USRW00022",
          "group": "FOOD",
          "qty": 0.15,
          "unit": "KG",
          "per_unit": 0.0083,
          "grams_per_unit": 8.333
        },
        {
          "name": "HOSEN MUSHROOM SLICED (2.84KG X 6TIN X 1CTN)",
          "code": "USRW00067",
          "group": "FOOD",
          "qty": 2,
          "unit": "KG",
          "per_unit": 0.1111,
          "grams_per_unit": 111.111
        },
        {
          "name": "YELLOW ONION",
          "code": "USRW00189",
          "group": "FOOD",
          "qty": 1,
          "unit": "KG",
          "per_unit": 0.0556,
          "grams_per_unit": 55.556
        },
        {
          "name": "LC PLANTA CHEF (4.8KG X 2TUB X 1CTN)",
          "code": "CKRM00044",
          "group": "FOOD",
          "qty": 2,
          "unit": "KG",
          "per_unit": 0.1111,
          "grams_per_unit": 111.111
        }
      ]
    },
    {
      "code": "RCP-00022",
      "name": "MY US DUNCAN SAUCE(1KG)",
      "category": "SAUCES",
      "yield_qty": 80,
      "yield_unit": "PKT",
      "dimension": "1 KG X 1 PKT",
      "ingredients": [
        {
          "name": "MIXED HERBS WHOLE (1KG X PKT)",
          "code": "USRW00104",
          "group": "FOOD",
          "qty": 0.3,
          "unit": "KG",
          "per_unit": 0.0037,
          "grams_per_unit": 3.75
        },
        {
          "name": "P1 SUGAR (50KG X GUNI)",
          "code": "CKRM00063",
          "group": "FOOD",
          "qty": 3.75,
          "unit": "KG",
          "per_unit": 0.0469,
          "grams_per_unit": 46.875
        },
        {
          "name": "40KG AUSTRALIAN FINE SALT",
          "code": "CKRM00002",
          "group": "FOOD",
          "qty": 0.2,
          "unit": "KG",
          "per_unit": 0.0025,
          "grams_per_unit": 2.5
        },
        {
          "name": "17KG VESAWIT COOKING OIL (PET) ",
          "code": "CKRM00001",
          "group": "FOOD",
          "qty": 1.125,
          "unit": "KG",
          "per_unit": 0.0141,
          "grams_per_unit": 14.062
        },
        {
          "name": "CARTON BOX MEDIUM - US PIZZA 420MM X 320MM X 220MM TL150/M150/M150/TL150 ",
          "code": "CKRM00080",
          "group": "PACKAGING",
          "qty": 6,
          "unit": "PCS",
          "per_unit": 0.075,
          "grams_per_unit": null
        },
        {
          "name": "PALMDALE TOMATO PASTE (3KG X 6TIN X 1CTN)",
          "code": "CKRM00064",
          "group": "FOOD",
          "qty": 15,
          "unit": "TIN",
          "per_unit": 0.1875,
          "grams_per_unit": null
        },
        {
          "name": "water",
          "code": "",
          "group": "",
          "qty": 37.5,
          "unit": "LTR",
          "per_unit": 0.4688,
          "grams_per_unit": 468.75
        },
        {
          "name": "PET FOIL LL (PLAIN ROLL) 420MM X 500MM X 0.08MM",
          "code": "CKRM00068",
          "group": "PACKAGING",
          "qty": 0.06,
          "unit": "ROLL",
          "per_unit": 0.0008,
          "grams_per_unit": null
        }
      ]
    },
    {
      "code": "RCP-00023",
      "name": "MY US GARLIC BUTTER (1KG)",
      "category": "SAUCES",
      "yield_qty": 32,
      "yield_unit": "PKT",
      "dimension": "1 KG X 1 PKT",
      "ingredients": [
        {
          "name": "LC PLANTA CHEF (4.8KG X 2TUB X 1CTN)",
          "code": "CKRM00044",
          "group": "FOOD",
          "qty": 4,
          "unit": "TUB",
          "per_unit": 0.125,
          "grams_per_unit": null
        },
        {
          "name": "water",
          "code": "",
          "group": "",
          "qty": 5,
          "unit": "LTR",
          "per_unit": 0.1562,
          "grams_per_unit": 156.25
        },
        {
          "name": "CARTON BOX SMALL - US PIZZA 250MM X 200MM X 180MM TL150/M120/M120/TL150 ",
          "code": "CKRM00081",
          "group": "PACKAGING",
          "qty": 8,
          "unit": "PCS",
          "per_unit": 0.25,
          "grams_per_unit": null
        },
        {
          "name": "NYLON 8X12 (100PCS X PKT)",
          "code": "CKRM00059",
          "group": "PACKAGING",
          "qty": 32,
          "unit": "PCS",
          "per_unit": 1.0,
          "grams_per_unit": null
        },
        {
          "name": "40KG AUSTRALIAN FINE SALT",
          "code": "CKRM00002",
          "group": "FOOD",
          "qty": 0.13,
          "unit": "KG",
          "per_unit": 0.0041,
          "grams_per_unit": 4.062
        },
        {
          "name": "GARLIC PEELED (PER KG)",
          "code": "CKRM00030",
          "group": "FOOD",
          "qty": 8,
          "unit": "KG",
          "per_unit": 0.25,
          "grams_per_unit": 250.0
        },
        {
          "name": "PARSLEY WHOLE FLAKES 1KG",
          "code": "USRW00133",
          "group": "FOOD",
          "qty": 100,
          "unit": "GM",
          "per_unit": 3.125,
          "grams_per_unit": 3.125
        }
      ]
    },
    {
      "code": "RCP-00024",
      "name": "MY US ITALIANO MAYO (500GM)",
      "category": "SAUCES",
      "yield_qty": 30,
      "yield_unit": "PKT",
      "dimension": "500G X 1 PKT",
      "ingredients": [
        {
          "name": "LADY'S CHOICE MAYO MAGIC (3L X 4TUB X 1CTN)",
          "code": "CKRM00043",
          "group": "FOOD",
          "qty": 12,
          "unit": "KG",
          "per_unit": 0.4,
          "grams_per_unit": 400.0
        },
        {
          "name": "17KG VESAWIT COOKING OIL (PET) ",
          "code": "CKRM00001",
          "group": "FOOD",
          "qty": 0.12,
          "unit": "KG",
          "per_unit": 0.004,
          "grams_per_unit": 4.0
        },
        {
          "name": "KNORR ITALIAN HERB PASTE (1.5KG X 6PKT X 1CTN)",
          "code": "CKRM00038",
          "group": "FOOD",
          "qty": 0.72,
          "unit": "KG",
          "per_unit": 0.024,
          "grams_per_unit": 24.0
        },
        {
          "name": "water",
          "code": "",
          "group": "",
          "qty": 2.4,
          "unit": "LTR",
          "per_unit": 0.08,
          "grams_per_unit": 80.0
        },
        {
          "name": "NYLON BAG 6X9 INCH (100PCS X PKT)",
          "code": "CKRM00060",
          "group": "PACKAGING",
          "qty": 30,
          "unit": "PCS",
          "per_unit": 1.0,
          "grams_per_unit": null
        },
        {
          "name": "CARTON BOX SMALL - US PIZZA 250MM X 200MM X 180MM TL150/M120/M120/TL150 ",
          "code": "CKRM00081",
          "group": "PACKAGING",
          "qty": 3,
          "unit": "PCS",
          "per_unit": 0.1,
          "grams_per_unit": null
        }
      ]
    },
    {
      "code": "RCP-00025",
      "name": "MY US ITALIANO SAUCE (1KG)",
      "category": "SAUCES",
      "yield_qty": 20,
      "yield_unit": "PKT",
      "dimension": "1 KG X 1 PKT",
      "ingredients": [
        {
          "name": "CARTON BOX SMALL - US PIZZA 250MM X 200MM X 180MM TL150/M120/M120/TL150 ",
          "code": "CKRM00081",
          "group": "PACKAGING",
          "qty": 5,
          "unit": "PCS",
          "per_unit": 0.25,
          "grams_per_unit": null
        },
        {
          "name": "NYLON 8X12 (100PCS X PKT)",
          "code": "CKRM00059",
          "group": "PACKAGING",
          "qty": 20,
          "unit": "PCS",
          "per_unit": 1.0,
          "grams_per_unit": null
        },
        {
          "name": "water",
          "code": "",
          "group": "",
          "qty": 15,
          "unit": "LTR",
          "per_unit": 0.75,
          "grams_per_unit": 750.0
        },
        {
          "name": "ANCHOR EXTRA YIELD COOKING CREAM (1L X 12PKT X 1CTN)",
          "code": "CKRM00004",
          "group": "FOOD",
          "qty": 3,
          "unit": "LTR",
          "per_unit": 0.15,
          "grams_per_unit": 150.0
        },
        {
          "name": "KNORR CHICKEN STOCK (1KG X 8PKT X 1CTN)",
          "code": "USRW00076",
          "group": "FOOD",
          "qty": 0.15,
          "unit": "KG",
          "per_unit": 0.0075,
          "grams_per_unit": 7.5
        },
        {
          "name": "TEPUNG UBI KAYU 3A (20KG X PKT)",
          "code": "CKRM00076",
          "group": "FOOD",
          "qty": 0.12,
          "unit": "KG",
          "per_unit": 0.006,
          "grams_per_unit": 6.0
        },
        {
          "name": "KNORR SAUCE MIX CARBONARA (PS) (750GM X 6PKT X 1CTN)",
          "code": "CKRM00039",
          "group": "FOOD",
          "qty": 3,
          "unit": "KG",
          "per_unit": 0.15,
          "grams_per_unit": 150.0
        }
      ]
    },
    {
      "code": "RCP-00026",
      "name": "MY US LASAGNA (2 PCS)",
      "category": "SIDE DISHES",
      "yield_qty": 10,
      "yield_unit": "PKT",
      "dimension": "2 PIECES X 1 PACKET",
      "ingredients": [
        {
          "name": "ANCHOR MOZARELLA CHEESE (2KG X 6PKT X 1CTN)",
          "code": "USRW00009",
          "group": "FOOD",
          "qty": 0.5,
          "unit": "KG",
          "per_unit": 0.05,
          "grams_per_unit": 50.0
        },
        {
          "name": "MIXED HERBS WHOLE (1KG X PKT)",
          "code": "USRW00104",
          "group": "FOOD",
          "qty": 4.5,
          "unit": "GM",
          "per_unit": 0.45,
          "grams_per_unit": 0.45
        },
        {
          "name": "MY US BOLOGNESE SAUCE 3KG",
          "code": "CKSFG0002",
          "group": "FOOD",
          "qty": 0.666,
          "unit": "PKT",
          "per_unit": 0.0666,
          "grams_per_unit": null
        },
        {
          "name": "MY US CONCASSE SAUCE 3KG",
          "code": "CKSFG0004",
          "group": "FOOD",
          "qty": 0.333,
          "unit": "PKT",
          "per_unit": 0.0333,
          "grams_per_unit": null
        },
        {
          "name": "MY US ITALIANO SAUCE 3KG",
          "code": "CKSFG0001",
          "group": "FOOD",
          "qty": 0.333,
          "unit": "PKT",
          "per_unit": 0.0333,
          "grams_per_unit": null
        },
        {
          "name": "SAN REMO NO. 100 LARGE SHEET LASAGNA (250GM X 12PKT X CTN)",
          "code": "CKRM00071",
          "group": "FOOD",
          "qty": 2.2,
          "unit": "PKT",
          "per_unit": 0.22,
          "grams_per_unit": null
        },
        {
          "name": "CARTON BOX SMALL - US PIZZA 250MM X 200MM X 180MM TL150/M120/M120/TL150 ",
          "code": "CKRM00081",
          "group": "PACKAGING",
          "qty": 2,
          "unit": "PCS",
          "per_unit": 0.2,
          "grams_per_unit": null
        },
        {
          "name": "NYLON 8X12 (100PCS X PKT)",
          "code": "CKRM00059",
          "group": "PACKAGING",
          "qty": 10,
          "unit": "PCS",
          "per_unit": 1.0,
          "grams_per_unit": null
        }
      ]
    },
    {
      "code": "RCP-00027",
      "name": "MY US SALTED EGG GARLIC PASTE (BASE) (300GM)",
      "category": "SAUCES",
      "yield_qty": 90,
      "yield_unit": "PKT",
      "dimension": "300G X 1PKT",
      "ingredients": [
        {
          "name": "17KG VESAWIT COOKING OIL (PET) ",
          "code": "CKRM00001",
          "group": "FOOD",
          "qty": 3,
          "unit": "KG",
          "per_unit": 0.0333,
          "grams_per_unit": 33.333
        },
        {
          "name": "LADY'S CHOICE MAYO MAGIC (3L X 4TUB X 1CTN)",
          "code": "CKRM00043",
          "group": "FOOD",
          "qty": 6,
          "unit": "TUB",
          "per_unit": 0.0667,
          "grams_per_unit": null
        },
        {
          "name": "MARIGOLD UHT FULL CREAM MILK",
          "code": "USRW00098",
          "group": "BEVERAGE",
          "qty": 6,
          "unit": "PKT",
          "per_unit": 0.0667,
          "grams_per_unit": null
        },
        {
          "name": "NYLON BAG 6X9 INCH (100PCS X PKT)",
          "code": "CKRM00060",
          "group": "PACKAGING",
          "qty": 90,
          "unit": "PCS",
          "per_unit": 1.0,
          "grams_per_unit": null
        },
        {
          "name": "FRIED GARLIC 1KG",
          "code": "CKRM00029",
          "group": "FOOD",
          "qty": 4.5,
          "unit": "KG",
          "per_unit": 0.05,
          "grams_per_unit": 50.0
        }
      ]
    },
    {
      "code": "RCP-00028",
      "name": "MY US SALTED EGG SAUCE DRESSING (300GM)",
      "category": "SAUCES",
      "yield_qty": 90,
      "yield_unit": "PKT",
      "dimension": "300G X 1PKT",
      "ingredients": [
        {
          "name": "NYLON BAG 6X9 INCH (100PCS X PKT)",
          "code": "CKRM00060",
          "group": "PACKAGING",
          "qty": 90,
          "unit": "PCS",
          "per_unit": 1.0,
          "grams_per_unit": null
        },
        {
          "name": "CARNATION EVAPORATED MILK (390GM X 48PCS X 1CTN)",
          "code": "CKRM00017",
          "group": "FOOD",
          "qty": 60,
          "unit": "TIN",
          "per_unit": 0.6667,
          "grams_per_unit": null
        },
        {
          "name": "CURRY LEAF (PER KG)",
          "code": "CKRM00023",
          "group": "FOOD",
          "qty": 0.22,
          "unit": "KG",
          "per_unit": 0.0024,
          "grams_per_unit": 2.444
        },
        {
          "name": "KNORR CHICKEN STOCK (1KG X 8PKT X 1CTN)",
          "code": "USRW00076",
          "group": "FOOD",
          "qty": 0.42,
          "unit": "KG",
          "per_unit": 0.0047,
          "grams_per_unit": 4.667
        },
        {
          "name": "ANCHOR SALTED BUTTER 25KG",
          "code": "CKRM00005",
          "group": "FOOD",
          "qty": 5,
          "unit": "KG",
          "per_unit": 0.0556,
          "grams_per_unit": 55.556
        },
        {
          "name": "KNORR GOLDEN SALTED EGG POWDER (800GM X 6PKT X 1CTN)",
          "code": "CKRM00037",
          "group": "FOOD",
          "qty": 4.8,
          "unit": "KG",
          "per_unit": 0.0533,
          "grams_per_unit": 53.333
        },
        {
          "name": "CHILI PADI GREEN (PER KG)",
          "code": "CKRM00021",
          "group": "FOOD",
          "qty": 0.6,
          "unit": "KG",
          "per_unit": 0.0067,
          "grams_per_unit": 6.667
        },
        {
          "name": "P1 SUGAR (50KG X GUNI)",
          "code": "CKRM00063",
          "group": "FOOD",
          "qty": 0.3,
          "unit": "KG",
          "per_unit": 0.0033,
          "grams_per_unit": 3.333
        }
      ]
    },
    {
      "code": "RCP-00029",
      "name": "MY US TERIYAKI SAUCE (300GM)",
      "category": "SAUCES",
      "yield_qty": 44,
      "yield_unit": "PKT",
      "dimension": "300G X 1PKT",
      "ingredients": [
        {
          "name": "MY US DUNCAN SAUCE SFG",
          "code": "CKSFG0003",
          "group": "FOOD",
          "qty": 3,
          "unit": "PKT",
          "per_unit": 0.0682,
          "grams_per_unit": null
        },
        {
          "name": "NYLON BAG 6X9 INCH (100PCS X PKT)",
          "code": "CKRM00060",
          "group": "PACKAGING",
          "qty": 44,
          "unit": "PCS",
          "per_unit": 1.0,
          "grams_per_unit": null
        },
        {
          "name": "Water",
          "code": "",
          "group": "",
          "qty": 5.2,
          "unit": "LTR",
          "per_unit": 0.1182,
          "grams_per_unit": 118.182
        },
        {
          "name": "TEPUNG UBI KAYU 3A (20KG X PKT)",
          "code": "CKRM00076",
          "group": "FOOD",
          "qty": 0.1,
          "unit": "KG",
          "per_unit": 0.0023,
          "grams_per_unit": 2.273
        },
        {
          "name": "OTAFUKU TERIYAKI SAUCE (2.4KG X 6BTL X 1CTN)",
          "code": "CKRM00062",
          "group": "FOOD",
          "qty": 5.1,
          "unit": "KG",
          "per_unit": 0.1159,
          "grams_per_unit": 115.909
        },
        {
          "name": "P1 SUGAR (50KG X GUNI)",
          "code": "CKRM00063",
          "group": "FOOD",
          "qty": 0.3,
          "unit": "KG",
          "per_unit": 0.0068,
          "grams_per_unit": 6.818
        }
      ]
    },
    {
      "code": "RCP-00030",
      "name": "MY US TOMYAM PASTE (300GM)",
      "category": "SAUCES",
      "yield_qty": 140,
      "yield_unit": "PKT",
      "dimension": "300G X 1PKT",
      "ingredients": [
        {
          "name": "RED ONION (PER KG)",
          "code": "USRW00145",
          "group": "FOOD",
          "qty": 4,
          "unit": "KG",
          "per_unit": 0.0286,
          "grams_per_unit": 28.571
        },
        {
          "name": "LEMONGRASS (PER KG)",
          "code": "CKRM00046",
          "group": "FOOD",
          "qty": 1,
          "unit": "KG",
          "per_unit": 0.0071,
          "grams_per_unit": 7.143
        },
        {
          "name": "DAUN LIMAU / LIME (PER KG)",
          "code": "CKRM00025",
          "group": "FOOD",
          "qty": 0.2,
          "unit": "KG",
          "per_unit": 0.0014,
          "grams_per_unit": 1.429
        },
        {
          "name": "17KG VESAWIT COOKING OIL (PET) ",
          "code": "CKRM00001",
          "group": "FOOD",
          "qty": 1.2,
          "unit": "KG",
          "per_unit": 0.0086,
          "grams_per_unit": 8.571
        },
        {
          "name": "GARLIC PEELED (PER KG)",
          "code": "CKRM00030",
          "group": "FOOD",
          "qty": 1.2,
          "unit": "KG",
          "per_unit": 0.0086,
          "grams_per_unit": 8.571
        },
        {
          "name": "THAI LIME JUICE (1L X 12PCS X 1CTN)",
          "code": "CKRM00077",
          "group": "FOOD",
          "qty": 2.6,
          "unit": "KG",
          "per_unit": 0.0186,
          "grams_per_unit": 18.571
        },
        {
          "name": "CHILI PADI GREEN (PER KG)",
          "code": "CKRM00021",
          "group": "FOOD",
          "qty": 4,
          "unit": "KG",
          "per_unit": 0.0286,
          "grams_per_unit": 28.571
        },
        {
          "name": "P1 SUGAR (50KG X GUNI)",
          "code": "CKRM00063",
          "group": "FOOD",
          "qty": 0.2,
          "unit": "KG",
          "per_unit": 0.0014,
          "grams_per_unit": 1.429
        },
        {
          "name": "water",
          "code": "",
          "group": "",
          "qty": 8,
          "unit": "LTR",
          "per_unit": 0.0571,
          "grams_per_unit": 57.143
        },
        {
          "name": "TOMYAM PASTE THAI LADY (3KG X 6PCS X 1CTN)",
          "code": "CKRM00078",
          "group": "FOOD",
          "qty": 4,
          "unit": "TIN",
          "per_unit": 0.0286,
          "grams_per_unit": null
        },
        {
          "name": "PALMDALE TOMATO PUREE (3KG X 6TIN X 1CTN)",
          "code": "CKRM00065",
          "group": "FOOD",
          "qty": 4,
          "unit": "TIN",
          "per_unit": 0.0286,
          "grams_per_unit": null
        },
        {
          "name": "BUNGA KANTAN",
          "code": "CKRM00016",
          "group": "FOOD",
          "qty": 20,
          "unit": "PCS",
          "per_unit": 0.1429,
          "grams_per_unit": null
        },
        {
          "name": "NYLON BAG 6X9 INCH (100PCS X PKT)",
          "code": "CKRM00060",
          "group": "PACKAGING",
          "qty": 140,
          "unit": "PCS",
          "per_unit": 1.0,
          "grams_per_unit": null
        }
      ]
    },
    {
      "code": "RCP-00031",
      "name": "MY US ITALIANO SAUCE 3KG",
      "category": "SAUCES",
      "yield_qty": 6.5,
      "yield_unit": "PKT",
      "dimension": "3 KG X 1 PKT",
      "ingredients": [
        {
          "name": "ANCHOR EXTRA YIELD COOKING CREAM (1L X 12PKT X 1CTN)",
          "code": "CKRM00004",
          "group": "FOOD",
          "qty": 3,
          "unit": "LTR",
          "per_unit": 0.4615,
          "grams_per_unit": 461.538
        },
        {
          "name": "NYLON 12X18 (200PCS X PKT)",
          "code": "CKRM00058",
          "group": "PACKAGING",
          "qty": 7,
          "unit": "PCS",
          "per_unit": 1.0769,
          "grams_per_unit": null
        },
        {
          "name": "water",
          "code": "",
          "group": "",
          "qty": 15,
          "unit": "LTR",
          "per_unit": 2.3077,
          "grams_per_unit": 2307.692
        },
        {
          "name": "KNORR CHICKEN STOCK (1KG X 8PKT X 1CTN)",
          "code": "USRW00076",
          "group": "FOOD",
          "qty": 0.15,
          "unit": "KG",
          "per_unit": 0.0231,
          "grams_per_unit": 23.077
        },
        {
          "name": "KNORR SAUCE MIX CARBONARA (PS) (750GM X 6PKT X 1CTN)",
          "code": "CKRM00039",
          "group": "FOOD",
          "qty": 3,
          "unit": "KG",
          "per_unit": 0.4615,
          "grams_per_unit": 461.538
        },
        {
          "name": "TEPUNG UBI KAYU 3A (20KG X PKT)",
          "code": "CKRM00076",
          "group": "FOOD",
          "qty": 0.12,
          "unit": "KG",
          "per_unit": 0.0185,
          "grams_per_unit": 18.462
        }
      ]
    },
    {
      "code": "RCP-00032",
      "name": "MY US BOLOGNESE SAUCE 3KG",
      "category": "SAUCES",
      "yield_qty": 16.5,
      "yield_unit": "PKT",
      "dimension": "3 KG X 1 PKT",
      "ingredients": [
        {
          "name": "KNORR CHICKEN STOCK (1KG X 8PKT X 1CTN)",
          "code": "USRW00076",
          "group": "FOOD",
          "qty": 1.7,
          "unit": "KG",
          "per_unit": 0.103,
          "grams_per_unit": 103.03
        },
        {
          "name": "PALMDALE TOMATO PUREE (3KG X 6TIN X 1CTN)",
          "code": "CKRM00065",
          "group": "FOOD",
          "qty": 18,
          "unit": "KG",
          "per_unit": 1.0909,
          "grams_per_unit": 1090.909
        },
        {
          "name": "CELERY (PER KG)",
          "code": "CKRM00020",
          "group": "FOOD",
          "qty": 2,
          "unit": "KG",
          "per_unit": 0.1212,
          "grams_per_unit": 121.212
        },
        {
          "name": "CARROT (PER KG)",
          "code": "CKRM00018",
          "group": "FOOD",
          "qty": 2,
          "unit": "KG",
          "per_unit": 0.1212,
          "grams_per_unit": 121.212
        },
        {
          "name": "YELLOW ONION",
          "code": "USRW00189",
          "group": "FOOD",
          "qty": 5,
          "unit": "KG",
          "per_unit": 0.303,
          "grams_per_unit": 303.03
        },
        {
          "name": "ANCHOR SALTED BUTTER 25KG",
          "code": "CKRM00005",
          "group": "FOOD",
          "qty": 2.5,
          "unit": "KG",
          "per_unit": 0.1515,
          "grams_per_unit": 151.515
        },
        {
          "name": "MIXED HERBS WHOLE (1KG X PKT)",
          "code": "USRW00104",
          "group": "FOOD",
          "qty": 0.12,
          "unit": "KG",
          "per_unit": 0.0073,
          "grams_per_unit": 7.273
        },
        {
          "name": "MINCED CHICKEN (PER KG)",
          "code": "CKRM00052",
          "group": "FOOD",
          "qty": 24,
          "unit": "KG",
          "per_unit": 1.4545,
          "grams_per_unit": 1454.545
        },
        {
          "name": "GARLIC PEELED (PER KG)",
          "code": "CKRM00030",
          "group": "FOOD",
          "qty": 0.6,
          "unit": "KG",
          "per_unit": 0.0364,
          "grams_per_unit": 36.364
        },
        {
          "name": "BAY LEAVE WHOLE (500GM X PKT)",
          "code": "CKRM00013",
          "group": "FOOD",
          "qty": 0.02,
          "unit": "KG",
          "per_unit": 0.0012,
          "grams_per_unit": 1.212
        },
        {
          "name": "water",
          "code": "",
          "group": "",
          "qty": 10,
          "unit": "LTR",
          "per_unit": 0.6061,
          "grams_per_unit": 606.061
        },
        {
          "name": "BLACK PEPPER COARSE (1KG X PKT)",
          "code": "USRW00022",
          "group": "FOOD",
          "qty": 0.12,
          "unit": "KG",
          "per_unit": 0.0073,
          "grams_per_unit": 7.273
        },
        {
          "name": "P1 SUGAR (50KG X GUNI)",
          "code": "CKRM00063",
          "group": "FOOD",
          "qty": 0.5,
          "unit": "KG",
          "per_unit": 0.0303,
          "grams_per_unit": 30.303
        },
        {
          "name": "HOSEN MUSHROOM SLICED (2.84KG X 6TIN X 1CTN)",
          "code": "USRW00067",
          "group": "FOOD",
          "qty": 2.84,
          "unit": "KG",
          "per_unit": 0.1721,
          "grams_per_unit": 172.121
        },
        {
          "name": "NYLON 12X18 (200PCS X PKT)",
          "code": "CKRM00058",
          "group": "PACKAGING",
          "qty": 17,
          "unit": "PCS",
          "per_unit": 1.0303,
          "grams_per_unit": null
        }
      ]
    },
    {
      "code": "RCP-00033",
      "name": "MY US DUNCAN SAUCE SFG",
      "category": "SAUCES",
      "yield_qty": 16,
      "yield_unit": "PKT",
      "dimension": "1 KG X 1 PKT",
      "ingredients": [
        {
          "name": "PALMDALE TOMATO PASTE (3KG X 6TIN X 1CTN)",
          "code": "CKRM00064",
          "group": "FOOD",
          "qty": 3,
          "unit": "TIN",
          "per_unit": 0.1875,
          "grams_per_unit": null
        },
        {
          "name": "17KG VESAWIT COOKING OIL (PET) ",
          "code": "CKRM00001",
          "group": "FOOD",
          "qty": 0.225,
          "unit": "KG",
          "per_unit": 0.0141,
          "grams_per_unit": 14.062
        },
        {
          "name": "water",
          "code": "",
          "group": "",
          "qty": 7.5,
          "unit": "LTR",
          "per_unit": 0.4688,
          "grams_per_unit": 468.75
        },
        {
          "name": "PET FOIL LL (PLAIN ROLL) 420MM X 500MM X 0.08MM",
          "code": "CKRM00068",
          "group": "PACKAGING",
          "qty": 0.01,
          "unit": "ROLL",
          "per_unit": 0.0006,
          "grams_per_unit": null
        },
        {
          "name": "40KG AUSTRALIAN FINE SALT",
          "code": "CKRM00002",
          "group": "FOOD",
          "qty": 0.04,
          "unit": "KG",
          "per_unit": 0.0025,
          "grams_per_unit": 2.5
        },
        {
          "name": "P1 SUGAR (50KG X GUNI)",
          "code": "CKRM00063",
          "group": "FOOD",
          "qty": 0.75,
          "unit": "KG",
          "per_unit": 0.0469,
          "grams_per_unit": 46.875
        },
        {
          "name": "MIXED HERBS WHOLE (1KG X PKT)",
          "code": "USRW00104",
          "group": "FOOD",
          "qty": 0.06,
          "unit": "KG",
          "per_unit": 0.0037,
          "grams_per_unit": 3.75
        }
      ]
    },
    {
      "code": "RCP-00034",
      "name": "MY US CONCASSE SAUCE 3KG",
      "category": "SAUCES",
      "yield_qty": 16.5,
      "yield_unit": "PKT",
      "dimension": "3 KG X 1 PKT",
      "ingredients": [
        {
          "name": "MIXED HERBS WHOLE (1KG X PKT)",
          "code": "USRW00104",
          "group": "FOOD",
          "qty": 0.07,
          "unit": "KG",
          "per_unit": 0.0042,
          "grams_per_unit": 4.242
        },
        {
          "name": "GARLIC PEELED (PER KG)",
          "code": "CKRM00030",
          "group": "FOOD",
          "qty": 0.6,
          "unit": "KG",
          "per_unit": 0.0364,
          "grams_per_unit": 36.364
        },
        {
          "name": "KNORR CHICKEN STOCK (1KG X 8PKT X 1CTN)",
          "code": "USRW00076",
          "group": "FOOD",
          "qty": 1.3,
          "unit": "KG",
          "per_unit": 0.0788,
          "grams_per_unit": 78.788
        },
        {
          "name": "P1 SUGAR (50KG X GUNI)",
          "code": "CKRM00063",
          "group": "FOOD",
          "qty": 1,
          "unit": "KG",
          "per_unit": 0.0606,
          "grams_per_unit": 60.606
        },
        {
          "name": "CELERY (PER KG)",
          "code": "CKRM00020",
          "group": "FOOD",
          "qty": 2,
          "unit": "KG",
          "per_unit": 0.1212,
          "grams_per_unit": 121.212
        },
        {
          "name": "PALMDALE TOMATO PUREE (3KG X 6TIN X 1CTN)",
          "code": "CKRM00065",
          "group": "FOOD",
          "qty": 18,
          "unit": "KG",
          "per_unit": 1.0909,
          "grams_per_unit": 1090.909
        },
        {
          "name": "BAY LEAVE WHOLE (500GM X PKT)",
          "code": "CKRM00013",
          "group": "FOOD",
          "qty": 0.06,
          "unit": "KG",
          "per_unit": 0.0036,
          "grams_per_unit": 3.636
        },
        {
          "name": "CARROT (PER KG)",
          "code": "CKRM00018",
          "group": "FOOD",
          "qty": 2,
          "unit": "KG",
          "per_unit": 0.1212,
          "grams_per_unit": 121.212
        },
        {
          "name": "17KG VESAWIT COOKING OIL (PET) ",
          "code": "CKRM00001",
          "group": "FOOD",
          "qty": 4,
          "unit": "KG",
          "per_unit": 0.2424,
          "grams_per_unit": 242.424
        },
        {
          "name": "YELLOW ONION",
          "code": "USRW00189",
          "group": "FOOD",
          "qty": 16,
          "unit": "KG",
          "per_unit": 0.9697,
          "grams_per_unit": 969.697
        },
        {
          "name": "BLACK PEPPER COARSE (1KG X PKT)",
          "code": "USRW00022",
          "group": "FOOD",
          "qty": 0.16,
          "unit": "KG",
          "per_unit": 0.0097,
          "grams_per_unit": 9.697
        },
        {
          "name": "water",
          "code": "",
          "group": "",
          "qty": 14,
          "unit": "LTR",
          "per_unit": 0.8485,
          "grams_per_unit": 848.485
        },
        {
          "name": "NYLON 12X18 (200PCS X PKT)",
          "code": "CKRM00058",
          "group": "PACKAGING",
          "qty": 17,
          "unit": "PCS",
          "per_unit": 1.0303,
          "grams_per_unit": null
        }
      ]
    },
    {
      "code": "RCP-00035",
      "name": "SAMBAL GEPUK",
      "category": "SAUCES",
      "yield_qty": 2.5,
      "yield_unit": "PKT",
      "dimension": "500G X 1 PKT",
      "ingredients": [
        {
          "name": "SESAME OIL  CAP RUSA RED CAP",
          "code": "USRW00384",
          "group": "FOOD",
          "qty": 30,
          "unit": "ML",
          "per_unit": 12.0,
          "grams_per_unit": 12.0
        },
        {
          "name": "AJI NO MOTO",
          "code": "USRW00385",
          "group": "FOOD",
          "qty": 20,
          "unit": "GM",
          "per_unit": 8.0,
          "grams_per_unit": 8.0
        },
        {
          "name": "GARLIC PEELED (PER KG)",
          "code": "CKRM00030",
          "group": "FOOD",
          "qty": 15,
          "unit": "GM",
          "per_unit": 6.0,
          "grams_per_unit": 6.0
        },
        {
          "name": "KACANG GAJUS",
          "code": "USRW00383",
          "group": "FOOD",
          "qty": 125,
          "unit": "GM",
          "per_unit": 50.0,
          "grams_per_unit": 50.0
        },
        {
          "name": "17KG VESAWIT COOKING OIL (PET) ",
          "code": "CKRM00001",
          "group": "FOOD",
          "qty": 550,
          "unit": "GM",
          "per_unit": 220.0,
          "grams_per_unit": 220.0
        },
        {
          "name": "CHILI PADI MERAH WITHOUT TANGKAI",
          "code": "USRW00382",
          "group": "FOOD",
          "qty": 500,
          "unit": "GM",
          "per_unit": 200.0,
          "grams_per_unit": 200.0
        },
        {
          "name": "40KG AUSTRALIAN FINE SALT",
          "code": "CKRM00002",
          "group": "FOOD",
          "qty": 20,
          "unit": "GM",
          "per_unit": 8.0,
          "grams_per_unit": 8.0
        }
      ]
    }
  ]
};

window.__RECMAP__ = [
  {
    "product": "MY US BOLOGNESE SAUCE 2KG",
    "recipe": "MY US BOLOGNESE SAUCE (500GM)"
  },
  {
    "product": "MY US LARGE DOUGH",
    "recipe": "Frozen Dough Large 380g"
  },
  {
    "product": "MY US PERSONAL DOUGH",
    "recipe": "Frozen Dough Personal 100g"
  },
  {
    "product": "MY US REGULAR DOUGH",
    "recipe": "Frozen Dough Regular 210g"
  },
  {
    "product": "MARSHALL'S BURGER BUN (12 PCS/ PACKET)",
    "recipe": "Burger Bun"
  },
  {
    "product": "MARSHALL'S CO BEEF PATTY (4 PIECES/ PACKET)",
    "recipe": "Beef Patty"
  },
  {
    "product": "MY US FROZEN CHICKEN PATTY",
    "recipe": "Chicken Patty"
  },
  {
    "product": "MY US PICKLE JAM",
    "recipe": "Pickle Jam"
  },
  {
    "product": "MY US MARSHALL SAUCE",
    "recipe": "MARSHALL'S SAUCE (500G)"
  },
  {
    "product": "MY US SPICY SAUCE",
    "recipe": "MARSHALL'S SPICY SAUCE (500G)"
  },
  {
    "product": "MY US UMAMI SAUCE (SAUTEED BEEF)",
    "recipe": "Umami Beef Sauce"
  },
  {
    "product": "MARSHAL'S NACHO CHEESE SAUCE (500G)",
    "recipe": "MARSHAL'S NACHO CHEESE SAUCE (500G)"
  },
  {
    "product": "MY US BOLOGNESE SAUCE",
    "recipe": "MY US BOLOGNESE SAUCE (500GM)"
  },
  {
    "product": "MY US CARBONARA 2KG",
    "recipe": "MY US CARBONARA 2KG"
  },
  {
    "product": "MY US CHICKEN WINGS (30 PAIRS)",
    "recipe": "Chicken Wing"
  },
  {
    "product": "MY US DOUGH PREMIX",
    "recipe": "Dough Premix"
  },
  {
    "product": "MY US DUNCAN SAUCE",
    "recipe": "MY US DUNCAN SAUCE(1KG)"
  },
  {
    "product": "MY US GARLIC BUTTER",
    "recipe": "MY US GARLIC BUTTER (1KG)"
  },
  {
    "product": "MY US GROUND BEEF",
    "recipe": "Ground Beef"
  },
  {
    "product": "MY US ICE TEA PREMIX",
    "recipe": "Ice Tea Premix"
  },
  {
    "product": "MY US ITALIANO CHICKEN",
    "recipe": "Italiano Chicken"
  },
  {
    "product": "MY US ITALIAN MAYO",
    "recipe": "MY US ITALIANO MAYO (500GM)"
  },
  {
    "product": "MY US ITALIAN SAUCE",
    "recipe": "MY US ITALIANO SAUCE (1KG)"
  },
  {
    "product": "MY US LASAGNA",
    "recipe": "MY US LASAGNA (2 PCS)"
  },
  {
    "product": "MY US MUSHROOM SOUP PREMIX",
    "recipe": "Mushroom Soup Premix"
  },
  {
    "product": "MY US SALTED EGG GARLIC PASTE",
    "recipe": "MY US SALTED EGG GARLIC PASTE (BASE) (300GM)"
  },
  {
    "product": "MY US SALTED EGG SAUCE",
    "recipe": "MY US SALTED EGG SAUCE DRESSING (300GM)"
  },
  {
    "product": "MY US SPICY CHICKEN",
    "recipe": "Spicy Chicken"
  },
  {
    "product": "MY US TERIYAKI SAUCE",
    "recipe": "MY US TERIYAKI SAUCE (300GM)"
  },
  {
    "product": "MY US TOMYUM PASTE",
    "recipe": "MY US TOMYAM PASTE (300GM)"
  },
  {
    "product": "MY US CINNAMON POWDER PREMIX",
    "recipe": "Cinnamon Sugar Premix"
  },
  {
    "product": "MY US SAMBAL GEPUK",
    "recipe": "SAMBAL GEPUK"
  }
];
