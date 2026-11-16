# -*- coding: utf-8 -*-
"""
compile_complete_database.py
Główny kompilator scalający wszystkie batche minerałów w jeden spójny plik src/data/minerals.json.
Oblicza:
- Dokładne masy cząsteczkowe z wag atomowych IUPAC
- Udziały wagowe całkowite (totalWeightPercent)
- Udział pierwiastków lekkich (Z < 11: H, He, Li, Be, B, C, N, O, F)
- Widełki tolerancji +-2.0% dla pierwiastków lekkich
- Znormalizowany profil widzialny XRF (xrfVisibleWeightPercent dla Z >= 11)
- Widełki tolerancji +-2.0% dla każdego pierwiastka widzialnego w XRF
- Właściwości fizyczne i diagnostyczne w języku polskim
"""

import json
import os
import sys

from builder_base import add_min, minerals, seen_ids
from batch_1 import BATCH_1
from batch_carbonates import BATCH_CARBONATES
from batch_sulfates_phosphates import BATCH_SULFATES_PHOSPHATES
from batch_silicates import MORE_MINERALS
from batch_extra_sulfides import EXTRA_MINERALS
from expand_to_1050 import SYSTEMATIC_SPECIES
from minerals_part2 import PART_2_MINERALS
from minerals_part3 import PART_3_MINERALS
from minerals_part4 import PART_4_MINERALS
from minerals_part5 import PART_5_MINERALS
from minerals_part6 import PART_6_MINERALS
from minerals_part7 import PART_7_MINERALS

# 1. Wczytaj 104 pierwotne minerały
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

# 2. Załaduj wszystkie kolejne batche
all_batches = [
    ("Batch 1 (Kruszce, rodzime, tlenki)", BATCH_1),
    ("Batch Carbonates (Węglany)", BATCH_CARBONATES),
    ("Batch Sulfates & Phosphates", BATCH_SULFATES_PHOSPHATES),
    ("Batch Silicates (Krzemiany)", MORE_MINERALS),
    ("Batch Extra Sulfides (Siarczki)", EXTRA_MINERALS),
    ("Batch Systematic (Cyklo- i neso-)", SYSTEMATIC_SPECIES),
    ("Part 2 (Siarczki, halogenki, tlenki, borany)", PART_2_MINERALS),
    ("Part 3 (Chromiany, molibdeniany, wanadany, miki)", PART_3_MINERALS),
    ("Part 4 (Granaty, pirokseny, zeolity, uranyle)", PART_4_MINERALS),
    ("Part 5 (Rzadkie kruszce, halogenki, wodorotlenki)", PART_5_MINERALS),
    ("Part 6 (Fosfofyllit, kamienie szlachetne, fosforany)", PART_6_MINERALS),
    ("Part 7 (Thortveityt, Armalkolit, siarkosole)", PART_7_MINERALS),
]

for name, batch in all_batches:
    before = len(minerals)
    for item in batch:
        min_id, name_pl, name_en, formula, group, stoich, h, streak, luster, color, density, tests, occ = item
        add_min(min_id, name_pl, name_en, formula, group, stoich, h, streak, luster, color, density, tests, occ)
    print(f"Dodano {name}: +{len(minerals) - before} minerałów (Łącznie: {len(minerals)}).")

total_count = len(minerals)
print("\n" + "="*50)
print(f"RAZEM W BAZIE: {total_count} MINERAŁÓW MAKROSKOPOWYCH!")
print("="*50)

# Weryfikacja poprawności danych
for m in minerals:
    assert 'id' in m and m['id'], "Brak ID minerału!"
    assert 'namePl' in m and m['namePl'], f"Brak nazwy PL dla {m['id']}!"
    assert 'formula' in m and m['formula'], f"Brak wzoru dla {m['id']}!"
    assert 'lightElementsPercent' in m, f"Brak bilansu pierwiastków lekkich dla {m['id']}!"
    assert 'lightElementsToleranceWindow' in m, f"Brak widełek lekkich dla {m['id']}!"
    assert 'toleranceWindows' in m, f"Brak widełek tolerancji dla {m['id']}!"
    assert 'xrfVisibleWeightPercent' in m, f"Brak profilu XRF dla {m['id']}!"

# Zapis do src/data/minerals.json
output_path = 'src/data/minerals.json'
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(minerals, f, ensure_ascii=False, indent=2)

file_size_kb = os.path.getsize(output_path) / 1024
print(f"\nPomyślnie zapisano bazę danych do '{output_path}'. Rozmiar pliku: {file_size_kb:.1f} KB.")
