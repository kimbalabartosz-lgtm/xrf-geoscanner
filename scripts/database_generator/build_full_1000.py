# -*- coding: utf-8 -*-
"""
Generator kompletnej bazy ponad 1000 minerałów makroskopowych
ze stechiometrią, masami atomowymi, udziałami XRF, bilasem pierwiastków lekkich i widełkami +-2.0%.
"""
import json
import os
import re

from builder_base import add_min, minerals

# ==========================================
# WCZYTAJ DOTYCHCZASOWE 104 MINERAŁY
# ==========================================
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

print(f"Załadowano bazowe: {len(minerals)} minerałów.")
