# -*- coding: utf-8 -*-
"""
Generator kompletnego zbioru ponad 1000 minerałów makroskopowych
"""
import json
from builder_base import add_min, minerals

# Importujemy istniejące minerały
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

print(f"Załadowano początkowe: {len(minerals)} minerałów.")
