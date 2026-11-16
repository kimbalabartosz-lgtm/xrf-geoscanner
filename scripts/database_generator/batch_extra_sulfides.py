# -*- coding: utf-8 -*-
"""
generate_1000_species.py
Generuje brakujące minerały makroskopowe do osiągnięcia >1050 gatunków.
"""

# Zdefiniujmy obszerne listy minerałów makroskopowych
EXTRA_MINERALS = [
    # --- SIARCZKI I SULFOSOLE ---
    ("berzelianite", "Berzelianit", "Berzelianite", "Cu₂Se", "Siarczki i selenki", {"Cu": 2, "Se": 1}, "2.0", "lśniąca", "metaliczny", "srebrzystobiała", "6.71", "Selenek miedzi, zapach rzodkwi.", "Złoża selenowe."),
    ("umangite", "Umangit", "Umangite", "Cu₃Se₂", "Siarczki i selenki", {"Cu": 3, "Se": 2}, "3.0", "ciemnoczerwona", "metaliczny", "czerwonofioletowa", "6.30", "Fioletowoczerwona barwa miedziowa.", "Złoża selenowe."),
    ("klockmannite", "Klockmannit", "Klockmannite", "CuSe", "Siarczki i selenki", {"Cu": 1, "Se": 1}, "2.0 - 2.5", "ciemnoszara", "metaliczny", "stalowoszara", "6.00", "Tabliczkowy selenek miedzi.", "Żyły hydrotermalne."),
    ("penroseite", "Penroseit", "Penroseite", "(Ni,Co,Cu)Se₂", "Siarczki i selenki", {"Ni": 1, "Se": 2}, "2.5 - 3.0", "czarna", "metaliczny", "ołowianoszara", "6.90", "Analog pirytu z selenem.", "Złoża selenu."),
    ("tiemannite", "Tiemannit", "Tiemannite", "HgSe", "Siarczki i selenki", {"Hg": 1, "Se": 1}, "2.5", "czarna", "metaliczny", "stalowoszara", "8.24", "Ciężki selenek rtęci.", "Żyły hydrotermalne."),
    ("guanajuatite", "Guanajuatyt", "Guanajuatite", "Bi₂Se₃", "Siarczki i selenki", {"Bi": 2, "Se": 3}, "2.5 - 3.0", "szara", "metaliczny", "ołowianoszara", "6.98", "Igiełkowy selenek bizmutu.", "Żyły hydrotermalne."),
    ("tetradymite_se", "Kawazulit", "Kawazulite", "Bi₂Te₂Se", "Siarczki i tellurki", {"Bi": 2, "Te": 2, "Se": 1}, "1.5", "szara", "metaliczny", "srebrzystoszara", "7.90", "Blaszkowy telluro-selenek bizmutu.", "Złoża złota."),
    ("joseite_a", "Joseit-A", "Joseite-A", "Bi₄TeS₂", "Siarczki i tellurki", {"Bi": 4, "Te": 1, "S": 2}, "1.5 - 2.0", "szara", "metaliczny", "jasnoszara", "8.10", "Miękkie elastyczne blaszki bizmutowe.", "Złotonośne żyły kwarcowe."),
    ("joseite_b", "Joseit-B", "Joseite-B", "Bi₄Te₂S", "Siarczki i tellurki", {"Bi": 4, "Te": 2, "S": 1}, "1.5 - 2.0", "szara", "metaliczny", "srebrzystoszara", "8.30", "Telluro-siarczek bizmutu.", "Złoża Au-Bi."),
    ("pilsenite", "Pilsenit", "Pilsenite", "Bi₄Te₃", "Tellurki", {"Bi": 4, "Te": 3}, "1.5 - 2.0", "szara", "metaliczny", "srebrzystobiała", "8.06", "Czysty tellurek bizmutu.", "Żyły hydrotermalne Au-Bi."),
    ("hedleyite", "Hedleyit", "Hedleyite", "Bi₇Te₃", "Tellurki", {"Bi": 7, "Te": 3}, "2.0", "szara", "metaliczny", "cynowobiała", "8.90", "Bardzo bogaty w bizmut tellurek.", "Skarny z Au."),
    ("ingodite", "Ingodyt", "Ingodite", "Bi(S,Te)", "Tellurki", {"Bi": 2, "Te": 1, "S": 1}, "2.5", "szara", "metaliczny", "ołowianoszara", "7.85", "Siarczko-tellurek bizmutu.", "Żyły kwarcowe."),
    ("boulangerite_fe", "Falkmanit", "Falkmanite", "Pb₅Sb₄S₁₁", "Sulfosole", {"Pb": 5, "Sb": 4, "S": 11}, "2.5", "szara", "metaliczny", "ołowianoszara", "6.20", "Pilśniowate skupienia antymonowo-ołowiane.", "Złoża Pb-Sb."),
    ("geocronite", "Geokronit", "Geocronite", "Pb₁₄(Sb,As)₆S₂₃", "Sulfosole", {"Pb": 14, "Sb": 4, "As": 2, "S": 23}, "2.5", "ołowianoszara", "metaliczny", "ołowianoszara", "6.40", "Tabliczkowe kryształy ołowiano-antymonowe.", "Żyły kruszcowe."),
    ("jordanite", "Jordanit", "Jordanite", "Pb₁₄(As,Sb)₆S₂₃", "Sulfosole", {"Pb": 14, "As": 4, "Sb": 2, "S": 23}, "3.0", "czarna", "metaliczny", "ołowianoszara", "6.38", "Sześcioboczne tabliczki w dolomitach (Binnatal).", "Dolomity kruszconośne."),
    ("gratonite", "Gratonit", "Gratonite", "Pb₉As₄S₁₅", "Sulfosole", {"Pb": 9, "As": 4, "S": 15}, "2.5", "czarna", "metaliczny", "ciemnoołowianoszara", "6.22", "Trójkątne piramidki ołowiano-arsenowe.", "Złoża Cerro de Pasco."),
    ("sartorite", "Sartoryt", "Sartorite", "PbAs₂S₄", "Sulfosole", {"Pb": 1, "As": 2, "S": 4}, "3.0", "czerwonobrązowa", "metaliczny", "ciemnostalowoszara", "5.05", "Drobne słupki w białym dolomicie.", "Binnatal (Szwajcaria)."),
    ("baumhauerite", "Baumhaueryt", "Baumhauerite", "Pb₁₂As₁₆S₃₆", "Sulfosole", {"Pb": 12, "As": 16, "S": 36}, "3.0", "brązowa", "metaliczny", "stalowoszara", "5.33", "Rombowe słupki ze złożonym prążkowaniem.", "Dolomity Lengenbach."),
    ("dufrenoysite", "Dufrenoysyt", "Dufrenoysite", "Pb₂As₂S₅", "Sulfosole", {"Pb": 2, "As": 2, "S": 5}, "3.0", "czerwonobrązowa", "metaliczny", "stalowoszara", "5.50", "Dobre kryształy ołowiano-arsenowe.", "Złoża Binnatal."),
    ("rathite", "Ratyt", "Rathite", "Pb₈As₁₂S₂₆", "Sulfosole", {"Pb": 8, "As": 12, "S": 26}, "3.0", "brązowa", "metaliczny", "ołowianoszara", "5.41", "Jednoskośne kryształy w dolomitach.", "Alpy Szwajcarskie."),
    ("cosalite", "Kosalit", "Cosalite", "Pb₂Bi₂S₅", "Sulfosole", {"Pb": 2, "Bi": 2, "S": 5}, "2.5 - 3.0", "szaroczarna", "metaliczny", "ołowianoszara, srebrzysta", "6.76", "Włókniste igły ołowiano-bizmutowe.", "Wysokotemperaturowe żyły hydrotermalne."),
    ("galenobismutite", "Galenobizmutyt", "Galenobismutite", "PbBi₂S₄", "Sulfosole", {"Pb": 1, "Bi": 2, "S": 4}, "2.5 - 3.5", "szara", "metaliczny", "stalowoszara", "7.04", "Bardzo ciężka sulfosól bizmutowa.", "Żyły kruszcowe z berylem."),
    ("aikinite", "Aikinit", "Aikinite", "PbCuBiS₃", "Sulfosole", {"Pb": 1, "Cu": 1, "Bi": 1, "S": 3}, "2.0 - 2.5", "szaroczarna", "metaliczny", "ołowianoszara z miedzianym nalotem", "7.07", "Igiełkowe kryształy w kwarcu, ruda Bi-Pb-Cu.", "Żyły kwarcowo-złotonośne (Bieriezowsk)."),
    ("wittichenite", "Wittichenit", "Wittichenite", "Cu₃BiS₃", "Sulfosole", {"Cu": 3, "Bi": 1, "S": 3}, "2.5 - 3.0", "czarna", "metaliczny", "ołowianoszara do cynowobiałej", "4.50", "Siarczko-bizmutek miedzi.", "Żyły Co-Ni-Bi."),
    ("emplectite", "Emplektyt", "Emplectite", "CuBiS₂", "Sulfosole", {"Cu": 1, "Bi": 1, "S": 2}, "2.0", "szara", "metaliczny", "cynowobiała", "6.38", "Igiełkowe słupki z prążkowaniem.", "Żyły kruszcowe."),
    ("matildite", "Matyldyt", "Matildite", "AgBiS₂", "Sulfosole", {"Ag": 1, "Bi": 1, "S": 2}, "2.5", "szaroczarna", "metaliczny", "szara", "6.90", "Srebrzysto-bizmutowa sulfosól.", "Złoża Ag-Bi."),
    ("miargyrite", "Miargiryt", "Miargyrite", "AgSbS₂", "Sulfosole", {"Ag": 1, "Sb": 1, "S": 2}, "2.0 - 2.5", "wiśniowoczerwona", "metaliczny do diamentowego", "stalowoszara do żelazistoczarnej", "5.26", "Tabliczkowe kryształy, bogata ruda srebra (~36% Ag).", "Żyły hydrotermalne Ag."),
    ("aramayoite", "Aramayot", "Aramayoite", "Ag(Sb,Bi)S₂", "Sulfosole", {"Ag": 1, "Sb": 0.5, "Bi": 0.5, "S": 2}, "2.5", "czarna", "metaliczny", "żelazistoczarna", "5.60", "Blaszkowa łupliwość, złoża Boliwii.", "Złoża Ag-Sn."),
    ("diaphorite", "Diaforyt", "Diaphorite", "Pb₂Ag₃Sb₃S₈", "Sulfosole", {"Pb": 2, "Ag": 3, "Sb": 3, "S": 8}, "2.5 - 3.0", "stalowoszara", "metaliczny", "stalowoszara", "6.04", "Wspaniałe kryształy słupkowe o silnym połysku.", "Żyły Ag-Pb."),
    ("freieslebenite", "Freieslebenit", "Freieslebenite", "AgPbSbS₃", "Sulfosole", {"Ag": 1, "Pb": 1, "Sb": 1, "S": 3}, "2.0 - 2.5", "stalowoszara", "metaliczny", "stalowoszara", "6.22", "Rombowe słupki z prążkowaniem wzdłużnym.", "Freiberg w Saksonii."),
    ("pyrargyrite_as", "Xanthoconite", "Xanthoconite", "Ag₃AsS₃ (jednoskośny)", "Sulfosole", {"Ag": 3, "As": 1, "S": 3}, "2.0 - 2.5", "pomarańczowożółta", "diamentowy", "pomarańczowożółta, bursztynowa", "5.54", "Jednoskośny polimorf proustytu o pomarańczowo-żółtej barwie.", "Żyły srebra."),
    ("pyrostilpnite", "Pirostylpnit (ogień srebrny)", "Pyrostilpnite", "Ag₃SbS₃ (jednoskośny)", "Sulfosole", {"Ag": 3, "Sb": 1, "S": 3}, "2.0", "pomarańczowa", "diamentowy", "ognistoczerwona, rubinowa", "5.94", "Ognistoczerwone tabliczkowe kryształy o olśniewającym blasku.", "Żyły hydrotermalne Ag."),
    ("stephanite_br", "Pearceite", "Pearceite", "Cu(Ag,Cu)₆Ag₉As₂S₁₁", "Sulfosole", {"Ag": 9, "Cu": 7, "As": 2, "S": 11}, "3.0", "czarna", "metaliczny", "żelazistoczarna", "6.15", "Arsenowy odpowiednik polibazytu.", "Żyły kruszcowe srebra."),
    ("luzonite", "Luzonit", "Luzonite", "Cu₃AsS₄ (tetragonalny)", "Sulfosole", {"Cu": 3, "As": 1, "S": 4}, "3.5", "czarna", "metaliczny", "ciemnoczerwonobrązowa", "4.50", "Tetragonalny polimorf enargitu.", "Złoża Cu-As (Luzon na Filipinach)."),
    ("famatinite", "Famatynit", "Famatinite", "Cu₃SbS₄", "Sulfosole", {"Cu": 3, "Sb": 1, "S": 4}, "3.5", "czarna", "metaliczny", "stalowoszara z odcieniem fioletowym", "4.57", "Antymonowy odpowiednik luzonitu.", "Złoża miedziowe (Sierra de Famatina, Argentyna)."),
    ("stannite", "Stannit (piryt cynowy)", "Stannite", "Cu₂FeSnS₄", "Siarczki", {"Cu": 2, "Fe": 1, "Sn": 1, "S": 4}, "4.0", "czarna", "metaliczny", "stalowoszara z oliwkowym odcieniem", "4.40", "Ważna ruda cyny i miedzi ('kamień dzwonowy').", "Żyły hydrotermalne Sn-Cu."),
    ("kesterite", "Kesteryt", "Kesterite", "Cu₂ZnSnS₄", "Siarczki", {"Cu": 2, "Zn": 1, "Sn": 1, "S": 4}, "4.0", "czarna", "metaliczny", "zielonkawoczarna", "4.54", "Cynkowy odpowiednik stannitu (materiał ogniw fotowoltaicznych CZTS!).", "Złoża cynowe."),
    ("mawsonite", "Mawsonit", "Mawsonite", "Cu₆Fe₂SnS₈", "Siarczki", {"Cu": 6, "Fe": 2, "Sn": 1, "S": 8}, "3.5 - 4.0", "czarna", "metaliczny", "brązowo-pomarańczowa metaliczna", "4.65", "Charakterystyczny pomarańczowy odcień brązu na zgładach.", "Złoża porfirowe miedzi."),
    ("germanite", "Germanit", "Germanite", "Cu₁₃Fe₂Ge₂S₁₆", "Siarczki", {"Cu": 13, "Fe": 2, "Ge": 2, "S": 16}, "4.0", "szaroczarna", "metaliczny", "czerwonawoszara", "4.40", "GŁÓWNA NATURALNA RUDA GERMANU (Ge) na świecie!", "Złoża Tsumeb w Namibii."),
    ("renierite", "Renierit", "Renierite", "(Cu,Zn)₁₁Fe₄(Ge,As)₂S₁₆", "Siarczki", {"Cu": 10, "Zn": 1, "Fe": 4, "Ge": 2, "S": 16}, "4.5", "brązowoczarna", "metaliczny", "mosiężnobrązowa", "4.40", "Silnie magnetyczny minerał germanu.", "Kipushi w Kongo."),
    ("colusite", "Kolusyt", "Colusite", "Cu₁₂VAs₃S₁₆", "Sulfosole", {"Cu": 12, "V": 1, "As": 3, "S": 16}, "3.0 - 4.0", "czarna", "metaliczny", "mosiężnobrązowa", "4.50", "Sulfosól miedziowo-wanadowa.", "Złoża Butte w Montanie."),
    ("argyrodite", "Argirodyt", "Argyrodite", "Ag₈GeS₆", "Siarczki", {"Ag": 8, "Ge": 1, "S": 6}, "2.5", "szaroczarna", "metaliczny", "stalowoszara z odcieniem fioletowym", "6.29", "Minerał w którym Clemens Winkler w 1886 r. odkrył pierwiastek GERMAN!", "Freiberg w Saksonii."),
    ("canfieldite", "Kanfieldyt", "Canfieldite", "Ag₈SnS₆", "Siarczki", {"Ag": 8, "Sn": 1, "S": 6}, "2.5", "szara", "metaliczny", "żelazistoczarna z fioletowym blaskiem", "6.28", "Cynowy analog argirodytu, bogata ruda srebra.", "Złoża Boliwii."),
    ("teallite", "Teallit", "Teallite", "PbSnS₂", "Siarczki", {"Pb": 1, "Sn": 1, "S": 2}, "1.5 - 2.0", "czarna", "metaliczny", "ołowianoszara", "6.36", "Blaszkowa łupliwość jak mika lub grafit, ruda Sn-Pb.", "Złoża cyny Boliwii."),
    ("alacranite", "Alakranit", "Alacranite", "As₈S₉", "Siarczki", {"As": 8, "S": 9}, "1.5", "pomarańczowa", "diamentowy", "pomarańczowożółta", "3.43", "Rzadki siarczek arsenu ze spieków wulkanicznych.", "Kamczatka, kopalnia Uzon."),
]

print(f"EXTRA_MINERALS zdefiniowano: {len(EXTRA_MINERALS)}")
