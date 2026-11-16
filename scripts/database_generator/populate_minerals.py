# -*- coding: utf-8 -*-
import json
import re

from builder_base import add_min, minerals

# Wczytaj początkowe 104
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

print(f"Baza startowa: {len(minerals)} minerałów.")
