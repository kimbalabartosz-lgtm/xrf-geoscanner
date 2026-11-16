# -*- coding: utf-8 -*-
import json
import os

ATOMIC_MASSES = {
    'H': 1.008, 'He': 4.0026, 'Li': 6.94, 'Be': 9.0122, 'B': 10.81, 'C': 12.011, 'N': 14.007, 'O': 15.999, 'F': 18.998,
    'Na': 22.9897, 'Mg': 24.305, 'Al': 26.9815, 'Si': 28.085, 'P': 30.9738, 'S': 32.06, 'Cl': 35.45,
    'K': 39.0983, 'Ca': 40.078, 'Sc': 44.9559, 'Ti': 47.867, 'V': 50.9415, 'Cr': 51.9961, 'Mn': 54.938,
    'Fe': 55.845, 'Co': 58.9332, 'Ni': 58.6934, 'Cu': 63.546, 'Zn': 65.38, 'Ga': 69.723, 'Ge': 72.63,
    'As': 74.9216, 'Se': 78.971, 'Br': 79.904, 'Rb': 85.4678, 'Sr': 87.62, 'Y': 88.9058, 'Zr': 91.224,
    'Nb': 92.9064, 'Mo': 95.95, 'Ru': 101.07, 'Rh': 102.9055, 'Pd': 106.42, 'Ag': 107.8682, 'Cd': 112.414,
    'In': 114.818, 'Sn': 118.71, 'Sb': 121.76, 'Te': 127.6, 'I': 126.9045, 'Cs': 132.9055, 'Ba': 137.327,
    'La': 138.9055, 'Ce': 140.116, 'Pr': 140.9077, 'Nd': 144.242, 'Sm': 150.36, 'Eu': 151.964, 'Gd': 157.25,
    'Tb': 158.9254, 'Dy': 162.5, 'Ho': 164.9303, 'Er': 167.259, 'Tm': 168.9342, 'Yb': 173.054, 'Lu': 174.9668,
    'Hf': 178.49, 'Ta': 180.9479, 'W': 183.84, 'Re': 186.207, 'Os': 190.23, 'Ir': 192.217, 'Pt': 195.084,
    'Au': 196.9666, 'Hg': 200.592, 'Tl': 204.38, 'Pb': 207.2, 'Bi': 208.9804, 'Th': 232.0377, 'U': 238.0289
}

LIGHT_ELEMENTS = {'H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne'}

minerals = []
seen_ids = set()

def add_min(min_id, name_pl, name_en, formula, group, stoich, h, streak, luster, color, density, tests, occ, cleav="wyraźna", frac="nierówny", ratios=None):
    if min_id in seen_ids:
        min_id = f"{min_id}_{len(seen_ids)}"
    seen_ids.add(min_id)
    
    # oblicz masę molową całkowitą
    tot_mass = sum(ATOMIC_MASSES[k] * v for k, v in stoich.items())
    
    # udziały całkowite
    tot_pct = {k: round((ATOMIC_MASSES[k] * v / tot_mass) * 100, 2) for k, v in stoich.items()}
    
    # pierwiastki lekkie (Z < 11)
    light_pct = round(sum(tot_pct[k] for k in stoich if k in LIGHT_ELEMENTS), 2)
    light_breakdown = {k: tot_pct[k] for k in stoich if k in LIGHT_ELEMENTS}
    
    # widzialna matryca XRF (Z >= 11)
    vis_mass = sum(ATOMIC_MASSES[k] * v for k, v in stoich.items() if k not in LIGHT_ELEMENTS)
    
    xrf_vis = {}
    tol_win = {}
    if vis_mass > 0:
        for k, v in stoich.items():
            if k not in LIGHT_ELEMENTS:
                pct = round((ATOMIC_MASSES[k] * v / vis_mass) * 100, 2)
                xrf_vis[k] = pct
                tol_win[k] = {
                    'expected': pct,
                    'min': round(max(0, pct - 2.0), 2),
                    'max': round(min(100, pct + 2.0), 2)
                }
    
    minerals.append({
        'id': min_id,
        'namePl': name_pl,
        'nameEn': name_en,
        'formula': formula,
        'mineralGroup': group,
        'stoichiometry': stoich,
        'totalWeightPercent': tot_pct,
        'lightElementsPercent': light_pct,
        'lightElementsBreakdown': light_breakdown,
        'lightElementsToleranceWindow': {
            'expected': light_pct,
            'min': round(max(0, light_pct - 2.0), 2),
            'max': round(min(100, light_pct + 2.0), 2)
        },
        'xrfVisibleWeightPercent': xrf_vis,
        'toleranceWindows': tol_win,
        'keyMolarRatios': ratios or {},
        'diagnostics': {
            'hardness': str(h),
            'streak': streak,
            'luster': luster,
            'color': color,
            'cleavage': cleav,
            'fracture': frac,
            'density': f"{density} g/cm³",
            'tests': tests,
            'occurrence': occ
        }
    })

print("Skrypt inicjalizacyjny przygotowany.")
