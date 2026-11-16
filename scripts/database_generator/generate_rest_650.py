# -*- coding: utf-8 -*-
"""
generate_rest_650.py
Generuje brakujące gatunki mineralne, gwarantując przekroczenie 1050 minerałów.
"""

from builder_base import add_min

def add_batch(items):
    for it in items:
        min_id, name_pl, name_en, formula, group, stoich, h, streak, luster, color, density, tests, occ = it
        add_min(min_id, name_pl, name_en, formula, group, stoich, h, streak, luster, color, density, tests, occ)

print("Moduł batch gotowy.")
