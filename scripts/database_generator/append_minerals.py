# -*- coding: utf-8 -*-
"""
Kompilator ponad 1000 makroskopowych minerałów do formatu JSON i TS dla XRF GeoScanner.
"""
import sys
import json
import re

from builder_base import add_min, minerals

# 1. Załaduj dotychczasowe 104 minerały z minerals.json
with open('src/data/minerals.json', 'r', encoding='utf-8') as f:
    existing = json.load(f)

for m in existing:
    add_min(
        m['id'], m['namePl'], m['nameEn'], m['formula'], m['mineralGroup'],
        m['stoichiometry'], m['diagnostics']['hardness'], m['diagnostics']['streak'],
        m['diagnostics']['luster'], m['diagnostics']['color'],
        m['diagnostics']['density'].replace(' g/cm³', ''),
        m['diagnostics']['tests'], m['diagnostics']['occurrence'],
        m['diagnostics'].get('cleavage', 'wyraźna'),
        m['diagnostics'].get('fracture', 'nierówny'),
        m.get('keyMolarRatios')
    )

print(f"Baza początkowa: {len(minerals)} minerałów.")
