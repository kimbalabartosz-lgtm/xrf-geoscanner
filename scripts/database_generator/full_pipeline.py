# -*- coding: utf-8 -*-
"""
Generator kompletnego zestawu 1000+ minerałów makroskopowych
"""
import json
from builder_base import add_min, minerals
from batch_1 import BATCH_1
from batch_carbonates import BATCH_CARBONATES
from batch_sulfates_phosphates import BATCH_SULFATES_PHOSPHATES

# Wczytaj początkowe
with open('src/data/minerals.json', 'r', encoding='utf-8') as f:
    existing_104 = json.load(f)

for m in existing_104:
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

for b in [BATCH_1, BATCH_CARBONATES, BATCH_SULFATES_PHOSPHATES]:
    for item in b:
        min_id, name_pl, name_en, formula, group, stoich, h, streak, luster, color, density, tests, occ = item
        add_min(min_id, name_pl, name_en, formula, group, stoich, h, streak, luster, color, density, tests, occ)

print(f"Baza przed generacją wielką: {len(minerals)} minerałów.")
