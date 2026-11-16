import { MineralDefinition } from '@/types';

export const MINERALS_DATABASE: MineralDefinition[] = [
  {
    "id": "pyrite",
    "namePl": "Piryt",
    "nameEn": "Pyrite",
    "formula": "FeS₂",
    "mineralGroup": "Siarczki",
    "stoichiometry": {
      "Fe": 1,
      "S": 2
    },
    "keyMolarRatios": {
      "Fe/S": 0.5
    },
    "diagnostics": {
      "hardness": "6.0 - 6.5",
      "streak": "czarnozielona do czarnej",
      "luster": "metaliczny, silny",
      "color": "mosiężnożółta, złocista",
      "cleavage": "niewyraźna",
      "fracture": "muszlowy do nierównego",
      "density": "4.95 - 5.10 g/cm³",
      "tests": "Iskrzy przy uderzeniu młotkiem (zapach SO₂). Wyraźnie twardszy od chalkopirytu i złota (nie daje się zarysować nożem).",
      "occurrence": "Hydrotermalny, skały magmowe, metamorficzne i osadowe (\"złoto głupców\")."
    },
    "totalWeightPercent": {
      "Fe": 46.55,
      "S": 53.45
    },
    "xrfVisibleWeightPercent": {
      "Fe": 46.55,
      "S": 53.45
    }
  },
  {
    "id": "marcasite",
    "namePl": "Markasyt",
    "nameEn": "Marcasite",
    "formula": "FeS₂ (ortorombowy)",
    "mineralGroup": "Siarczki",
    "stoichiometry": {
      "Fe": 1,
      "S": 2
    },
    "keyMolarRatios": {
      "Fe/S": 0.5
    },
    "diagnostics": {
      "hardness": "6.0 - 6.5",
      "streak": "szaroczarna",
      "luster": "metaliczny",
      "color": "blado mosiężnożółta z odcieniem zielonkawym",
      "cleavage": "wyraźna",
      "fracture": "nierówny",
      "density": "4.85 - 4.90 g/cm³",
      "tests": "Kogucie grzebienie lub promieniste agregaty. Bardziej podatny na wietrzenie niż piryt.",
      "occurrence": "Niskotemperaturowe utwory hydrotermalne, konkrecje w węglu i iłach."
    },
    "totalWeightPercent": {
      "Fe": 46.55,
      "S": 53.45
    },
    "xrfVisibleWeightPercent": {
      "Fe": 46.55,
      "S": 53.45
    }
  },
  {
    "id": "chalcopyrite",
    "namePl": "Chalkopiryt",
    "nameEn": "Chalcopyrite",
    "formula": "CuFeS₂",
    "mineralGroup": "Siarczki",
    "stoichiometry": {
      "Cu": 1,
      "Fe": 1,
      "S": 2
    },
    "keyMolarRatios": {
      "Cu/Fe": 1,
      "Cu/S": 0.5
    },
    "diagnostics": {
      "hardness": "3.5 - 4.0",
      "streak": "zielonkawoczarna",
      "luster": "metaliczny",
      "color": "złocistożółta, mosiężna, często z barwną iryzacją",
      "cleavage": "słaba",
      "fracture": "muszlowy, nierówny",
      "density": "4.1 - 4.3 g/cm³",
      "tests": "Miękki – daje się łatwo zarysować nożem (w odróżnieniu od pirytu). Złocista barwa z pstrą iryzacją.",
      "occurrence": "Główna ruda miedzi, złoża hydrotermalne i magmowe porfirowe."
    },
    "totalWeightPercent": {
      "Cu": 34.63,
      "Fe": 30.43,
      "S": 34.94
    },
    "xrfVisibleWeightPercent": {
      "Cu": 34.63,
      "Fe": 30.43,
      "S": 34.94
    }
  },
  {
    "id": "bornite",
    "namePl": "Bornit (ruda pstra)",
    "nameEn": "Bornite",
    "formula": "Cu₅FeS₄",
    "mineralGroup": "Siarczki",
    "stoichiometry": {
      "Cu": 5,
      "Fe": 1,
      "S": 4
    },
    "keyMolarRatios": {
      "Cu/Fe": 5,
      "Cu/S": 1.25
    },
    "diagnostics": {
      "hardness": "3.0",
      "streak": "szaroczarna",
      "luster": "metaliczny",
      "color": "miedzianoczerwona na świeżym przełamie, szybko matowieje na fioletowo-niebiesko",
      "cleavage": "bardzo słaba",
      "fracture": "muszlowy",
      "density": "4.9 - 5.3 g/cm³",
      "tests": "Jaskrawa fioletowo-błękitna iryzacja powierzchniowa (\"pawie pióra\"). Bardzo wysoka zawartość Cu.",
      "occurrence": "Strefy wzbogacenia siarczkowego złóż miedzi."
    },
    "totalWeightPercent": {
      "Cu": 63.32,
      "Fe": 11.13,
      "S": 25.56
    },
    "xrfVisibleWeightPercent": {
      "Cu": 63.32,
      "Fe": 11.13,
      "S": 25.56
    }
  },
  {
    "id": "chalcocite",
    "namePl": "Chalkozyn",
    "nameEn": "Chalcocite",
    "formula": "Cu₂S",
    "mineralGroup": "Siarczki",
    "stoichiometry": {
      "Cu": 2,
      "S": 1
    },
    "keyMolarRatios": {
      "Cu/S": 2
    },
    "diagnostics": {
      "hardness": "2.5 - 3.0",
      "streak": "ciemnoszara do czarnej, błyszcząca",
      "luster": "metaliczny",
      "color": "ołowianoszara do czarnej",
      "cleavage": "słaba",
      "fracture": "muszlowy",
      "density": "5.5 - 5.8 g/cm³",
      "tests": "Daje się strugać nożem jak ołów. Wyjątkowo bogata ruda miedzi (~80% Cu).",
      "occurrence": "Strefy utlenienia i cementacji złóż miedzi (m.in. cechsztyn LGOM)."
    },
    "totalWeightPercent": {
      "Cu": 79.86,
      "S": 20.14
    },
    "xrfVisibleWeightPercent": {
      "Cu": 79.86,
      "S": 20.14
    }
  },
  {
    "id": "galena",
    "namePl": "Galena (błyszcz ołowiu)",
    "nameEn": "Galena",
    "formula": "PbS",
    "mineralGroup": "Siarczki",
    "stoichiometry": {
      "Pb": 1,
      "S": 1
    },
    "keyMolarRatios": {
      "Pb/S": 1
    },
    "diagnostics": {
      "hardness": "2.5 - 2.8",
      "streak": "ołowianoszara",
      "luster": "metaliczny, silny",
      "color": "ołowianoszara",
      "cleavage": "doskonała, kostkowa (sześcienna)",
      "fracture": "stopniowy, nierówny",
      "density": "7.4 - 7.6 g/cm³",
      "tests": "Bardzo duży ciężar właściwy (wyczuwalny w dłoni). Idealna kostkowa łupliwość. Główna ruda ołowiu i srebra.",
      "occurrence": "Żyły hydrotermalne, złoża typu Mississippi Valley (MVT), Olkusz."
    },
    "totalWeightPercent": {
      "Pb": 86.6,
      "S": 13.4
    },
    "xrfVisibleWeightPercent": {
      "Pb": 86.6,
      "S": 13.4
    }
  },
  {
    "id": "sphalerite",
    "namePl": "Sfalleryt (blenda cynkowa)",
    "nameEn": "Sphalerite",
    "formula": "ZnS (często z domieszką Fe)",
    "mineralGroup": "Siarczki",
    "stoichiometry": {
      "Zn": 1,
      "S": 1
    },
    "keyMolarRatios": {
      "Zn/S": 1
    },
    "diagnostics": {
      "hardness": "3.5 - 4.0",
      "streak": "jasnobrązowa do białej (zależnie od Fe)",
      "luster": "diamentowy, żywiczny lub półmetaliczny",
      "color": "żółta, brązowa, czarna (marmatyt)",
      "cleavage": "doskonała w 6 kierunkach (rombowo-dwunastościenna)",
      "fracture": "muszlowy",
      "density": "3.9 - 4.2 g/cm³",
      "tests": "Żywiczny połysk, wielokierunkowa łupliwość. Rozpuszcza się w gorącym HCl wydzielając H₂S.",
      "occurrence": "Hydrotermalny, często występuje z galeną i pirytem."
    },
    "totalWeightPercent": {
      "Zn": 67.1,
      "S": 32.9
    },
    "xrfVisibleWeightPercent": {
      "Zn": 67.1,
      "S": 32.9
    }
  },
  {
    "id": "arsenopyrite",
    "namePl": "Arsenopiryt",
    "nameEn": "Arsenopyrite",
    "formula": "FeAsS",
    "mineralGroup": "Siarczki",
    "stoichiometry": {
      "Fe": 1,
      "As": 1,
      "S": 1
    },
    "keyMolarRatios": {
      "Fe/As": 1,
      "As/S": 1
    },
    "diagnostics": {
      "hardness": "5.5 - 6.0",
      "streak": "szaroczarna",
      "luster": "metaliczny",
      "color": "srebrzystobiała do stalowoszarej",
      "cleavage": "wyraźna",
      "fracture": "nierówny",
      "density": "5.9 - 6.2 g/cm³",
      "tests": "Przy uderzeniu młotkiem wydziela silny czosnkowy zapach arsenu. Ruda arsenu i nośnik złota.",
      "occurrence": "Wysokotemperaturowe żyły hydrotermalne, pegmatyty."
    },
    "totalWeightPercent": {
      "Fe": 34.3,
      "As": 46.01,
      "S": 19.69
    },
    "xrfVisibleWeightPercent": {
      "Fe": 34.3,
      "As": 46.01,
      "S": 19.69
    }
  },
  {
    "id": "molybdenite",
    "namePl": "Molibdenit",
    "nameEn": "Molybdenite",
    "formula": "MoS₂",
    "mineralGroup": "Siarczki",
    "stoichiometry": {
      "Mo": 1,
      "S": 2
    },
    "keyMolarRatios": {
      "Mo/S": 0.5
    },
    "diagnostics": {
      "hardness": "1.0 - 1.5",
      "streak": "szaroniebieska na porcelanie, zielonawa na papierze",
      "luster": "metaliczny",
      "color": "ołowianoszara ze srebrzystym połyskiem",
      "cleavage": "doskonała, jednokierunkowa (blaszki giętkie)",
      "fracture": "haczykowaty",
      "density": "4.7 - 4.8 g/cm³",
      "tests": "Tłusty w dotyku, brudzi palce i papier jak grafit, ale ma niebieskawy odcień rysy.",
      "occurrence": "Złoża porfirowe Mo-Cu, pegmatyty, grejzeny."
    },
    "totalWeightPercent": {
      "Mo": 59.94,
      "S": 40.06
    },
    "xrfVisibleWeightPercent": {
      "Mo": 59.94,
      "S": 40.06
    }
  },
  {
    "id": "cinnabar",
    "namePl": "Cynober",
    "nameEn": "Cinnabar",
    "formula": "HgS",
    "mineralGroup": "Siarczki",
    "stoichiometry": {
      "Hg": 1,
      "S": 1
    },
    "keyMolarRatios": {
      "Hg/S": 1
    },
    "diagnostics": {
      "hardness": "2.0 - 2.5",
      "streak": "szkarłatnoczerwona",
      "luster": "diamentowy do matowego",
      "color": "karminowoczerwona, szkarłatna",
      "cleavage": "doskonała",
      "fracture": "nierówny",
      "density": "8.0 - 8.2 g/cm³",
      "tests": "Uderzająco duża gęstość przy jaskrawoczerwonej barwie i rysie. Główna ruda rtęci.",
      "occurrence": "Niskotemperaturowe żyły hydrotermalne wokół wulkanów."
    },
    "totalWeightPercent": {
      "Hg": 86.22,
      "S": 13.78
    },
    "xrfVisibleWeightPercent": {
      "Hg": 86.22,
      "S": 13.78
    }
  },
  {
    "id": "stibnite",
    "namePl": "Antymonit (stibnit)",
    "nameEn": "Stibnite",
    "formula": "Sb₂S₃",
    "mineralGroup": "Siarczki",
    "stoichiometry": {
      "Sb": 2,
      "S": 3
    },
    "keyMolarRatios": {
      "Sb/S": 0.667
    },
    "diagnostics": {
      "hardness": "2.0",
      "streak": "ołowianoszara",
      "luster": "metaliczny, bardzo silny",
      "color": "ołowianoszara, stalowoszara",
      "cleavage": "doskonała, wzdłuż słupków",
      "fracture": "nierówny",
      "density": "4.5 - 4.7 g/cm³",
      "tests": "Igiełkowe i pręcikowe kryształy z poprzecznym prążkowaniem. Topi się w płomieniu świecy.",
      "occurrence": "Niskotemperaturowe żyły hydrotermalne, ruda antymonu."
    },
    "totalWeightPercent": {
      "Sb": 71.69,
      "S": 28.31
    },
    "xrfVisibleWeightPercent": {
      "Sb": 71.69,
      "S": 28.31
    }
  },
  {
    "id": "pyrrhotite",
    "namePl": "Pirotyn",
    "nameEn": "Pyrrhotite",
    "formula": "Fe₁₋ₓS (Fe₇S₈)",
    "mineralGroup": "Siarczki",
    "stoichiometry": {
      "Fe": 7,
      "S": 8
    },
    "keyMolarRatios": {
      "Fe/S": 0.875
    },
    "diagnostics": {
      "hardness": "3.5 - 4.5",
      "streak": "szaroczarna",
      "luster": "metaliczny",
      "color": "brązowobrązowa, tombakowa",
      "cleavage": "brak (wyraźna oddzielność)",
      "fracture": "nierówny",
      "density": "4.6 g/cm³",
      "tests": "Wykazuje wyraźne właściwości magnetyczne (przyciąga igłę kompasu lub magnes neodymowy).",
      "occurrence": "Złoża magmowe magnezowo-żelaziste (noryty), skarny."
    },
    "totalWeightPercent": {
      "Fe": 60.38,
      "S": 39.62
    },
    "xrfVisibleWeightPercent": {
      "Fe": 60.38,
      "S": 39.62
    }
  },
  {
    "id": "cobaltite",
    "namePl": "Kobaltyn",
    "nameEn": "Cobaltite",
    "formula": "CoAsS",
    "mineralGroup": "Siarczki",
    "stoichiometry": {
      "Co": 1,
      "As": 1,
      "S": 1
    },
    "keyMolarRatios": {
      "Co/As": 1,
      "Co/S": 1
    },
    "diagnostics": {
      "hardness": "5.5",
      "streak": "szaroczarna",
      "luster": "metaliczny",
      "color": "srebrzystobiała z różowym odcieniem",
      "cleavage": "wyraźna, kostkowa",
      "fracture": "nierówny",
      "density": "6.3 g/cm³",
      "tests": "Kryształy izometryczne podobne do pirytu, ale z różowawym odcieniem. Ruda kobaltu.",
      "occurrence": "Żyły hydrotermalne wysokotemperaturowe."
    },
    "totalWeightPercent": {
      "Co": 35.52,
      "As": 45.16,
      "S": 19.32
    },
    "xrfVisibleWeightPercent": {
      "Co": 35.52,
      "As": 45.16,
      "S": 19.32
    }
  },
  {
    "id": "hematite",
    "namePl": "Hematyt",
    "nameEn": "Hematite",
    "formula": "Fe₂O₃",
    "mineralGroup": "Tlenki",
    "stoichiometry": {
      "Fe": 2,
      "O": 3
    },
    "diagnostics": {
      "hardness": "5.5 - 6.5",
      "streak": "wiśniowoczerwona do czerwonobrunatnej (niezawodna cecha)",
      "luster": "metaliczny do matowego",
      "color": "stalowoszara, czarna (błyszcz żelaza) lub krwistoczerwona",
      "cleavage": "brak",
      "fracture": "nierówny do muszlowego",
      "density": "5.2 - 5.3 g/cm³",
      "tests": "Wiśniowoczerwona rysa na nieszkliwionej porcelanie. Niemagnetyczny (lub b. słabo po prażeniu). XRF widzi wyłącznie Fe.",
      "occurrence": "Wstęgowe rudy żelaza (BIF), osady sedymentacyjne, hydrotermalne."
    },
    "totalWeightPercent": {
      "Fe": 69.94,
      "O": 30.06
    },
    "xrfVisibleWeightPercent": {
      "Fe": 100
    }
  },
  {
    "id": "magnetite",
    "namePl": "Magnetyt",
    "nameEn": "Magnetite",
    "formula": "Fe₃O₄",
    "mineralGroup": "Tlenki",
    "stoichiometry": {
      "Fe": 3,
      "O": 4
    },
    "diagnostics": {
      "hardness": "5.5 - 6.5",
      "streak": "czarna",
      "luster": "metaliczny do półmetalicznego",
      "color": "żelazistoczarna",
      "cleavage": "brak (oddzielność ośmiościenna)",
      "fracture": "nierówny",
      "density": "5.1 - 5.2 g/cm³",
      "tests": "Silny naturalny ferromagnetyzm – silnie przyciąga magnes. Czarna rysa.",
      "occurrence": "Skały magmowe zasadowe, skarny, piaski magnetytowe."
    },
    "totalWeightPercent": {
      "Fe": 72.36,
      "O": 27.64
    },
    "xrfVisibleWeightPercent": {
      "Fe": 100
    }
  },
  {
    "id": "rutile",
    "namePl": "Rutyl",
    "nameEn": "Rutile",
    "formula": "TiO₂",
    "mineralGroup": "Tlenki",
    "stoichiometry": {
      "Ti": 1,
      "O": 2
    },
    "diagnostics": {
      "hardness": "6.0 - 6.5",
      "streak": "jasnobrązowa do żółtawej",
      "luster": "diamentowy do półmetalicznego",
      "color": "czerwonobrunatna, krwistoczerwona, czarna",
      "cleavage": "wyraźna",
      "fracture": "muszlowy",
      "density": "4.2 - 4.3 g/cm³",
      "tests": "Diamentowy połysk. XRF widzi ~100% Ti w widzialnym spektrum. Często igiełki w kwarcu (włosy Wenus).",
      "occurrence": "Główna ruda tytanu, pegmatyty, piaski ciężkie."
    },
    "totalWeightPercent": {
      "Ti": 59.93,
      "O": 40.07
    },
    "xrfVisibleWeightPercent": {
      "Ti": 100
    }
  },
  {
    "id": "ilmenite",
    "namePl": "Ilmenit",
    "nameEn": "Ilmenite",
    "formula": "FeTiO₃",
    "mineralGroup": "Tlenki",
    "stoichiometry": {
      "Fe": 1,
      "Ti": 1,
      "O": 3
    },
    "keyMolarRatios": {
      "Fe/Ti": 1
    },
    "diagnostics": {
      "hardness": "5.0 - 6.0",
      "streak": "brązowoczarna",
      "luster": "metaliczny do półmetalicznego",
      "color": "żelazistoczarna",
      "cleavage": "brak",
      "fracture": "muszlowy",
      "density": "4.7 - 4.8 g/cm³",
      "tests": "Równy stosunek molowy Fe do Ti (~1:1). Słabo magnetyczny.",
      "occurrence": "Anortozyty, gabra, piaski tytanonośne."
    },
    "totalWeightPercent": {
      "Fe": 36.81,
      "Ti": 31.55,
      "O": 31.64
    },
    "xrfVisibleWeightPercent": {
      "Fe": 53.85,
      "Ti": 46.15
    }
  },
  {
    "id": "cassiterite",
    "namePl": "Kasyteryt (kamień cynowy)",
    "nameEn": "Cassiterite",
    "formula": "SnO₂",
    "mineralGroup": "Tlenki",
    "stoichiometry": {
      "Sn": 1,
      "O": 2
    },
    "diagnostics": {
      "hardness": "6.0 - 7.0",
      "streak": "biała do jasnobrązowej",
      "luster": "diamentowy do tłustego",
      "color": "brunatnoczarna, żółtawa, czarna",
      "cleavage": "niewyraźna",
      "fracture": "nierówny",
      "density": "6.8 - 7.1 g/cm³",
      "tests": "Uderzająco ciężki kamień o diamentowym połysku. XRF wykazuje dominację cyny (Sn ~100% visible).",
      "occurrence": "Grejzeny, pegmatyty granitowe, piaski aluwialne."
    },
    "totalWeightPercent": {
      "Sn": 78.77,
      "O": 21.23
    },
    "xrfVisibleWeightPercent": {
      "Sn": 100
    }
  },
  {
    "id": "chromite",
    "namePl": "Chromit",
    "nameEn": "Chromite",
    "formula": "FeCr₂O₄",
    "mineralGroup": "Tlenki (spinele)",
    "stoichiometry": {
      "Fe": 1,
      "Cr": 2,
      "O": 4
    },
    "keyMolarRatios": {
      "Cr/Fe": 2
    },
    "diagnostics": {
      "hardness": "5.5",
      "streak": "ciemnobrązowa",
      "luster": "metaliczny do tłustego",
      "color": "czarna do brunatnoczarnej",
      "cleavage": "brak",
      "fracture": "nierówny",
      "density": "4.5 - 4.8 g/cm³",
      "tests": "Stosunek Cr do Fe bliski 2:1. Słabo magnetyczny lub niemagnetyczny. Ciemnobrązowa rysa.",
      "occurrence": "Skały ultramaficzne (perydotyty, serpentynity), jedyna ruda chromu."
    },
    "totalWeightPercent": {
      "Fe": 24.95,
      "Cr": 46.46,
      "O": 28.59
    },
    "xrfVisibleWeightPercent": {
      "Fe": 34.94,
      "Cr": 65.06
    }
  },
  {
    "id": "corundum",
    "namePl": "Korund (rubin / szafir)",
    "nameEn": "Corundum",
    "formula": "Al₂O₃",
    "mineralGroup": "Tlenki",
    "stoichiometry": {
      "Al": 2,
      "O": 3
    },
    "diagnostics": {
      "hardness": "9.0 (wzorzec skali Mohsa)",
      "streak": "biała (bardzo trudna do uzyskania)",
      "luster": "szklisty do diamentowego",
      "color": "bezbarwna, czerwona (rubin), niebieska (szafir), żółta",
      "cleavage": "brak (oddzielność romboedryczna)",
      "fracture": "muszlowy",
      "density": "3.98 - 4.10 g/cm³",
      "tests": "Ekstremalna twardość (rysuje wszystko oprócz diamentu). W XRF widoczny w 100% jako Al.",
      "occurrence": "Skały metamorficzne (marmury, gnejsy), pegmatyty sjenitowe."
    },
    "totalWeightPercent": {
      "Al": 52.93,
      "O": 47.07
    },
    "xrfVisibleWeightPercent": {
      "Al": 100
    }
  },
  {
    "id": "pyrolusite",
    "namePl": "Piroluzyt",
    "nameEn": "Pyrolusite",
    "formula": "MnO₂",
    "mineralGroup": "Tlenki",
    "stoichiometry": {
      "Mn": 1,
      "O": 2
    },
    "diagnostics": {
      "hardness": "2.0 - 2.5 (kryształy polerowane do 6)",
      "streak": "czarna, smolista, brudzi palce",
      "luster": "metaliczny do matowego",
      "color": "stalowoszara do aksamitnoczarnej",
      "cleavage": "doskonała",
      "fracture": "nierówny",
      "density": "4.8 - 5.0 g/cm³",
      "tests": "Intensywnie brudzi ręce i papier na czarno. W XRF dominuje mangan (Mn ~100% visible).",
      "occurrence": "Złoża osadowe, strefy utlenienia kruszców manganu."
    },
    "totalWeightPercent": {
      "Mn": 63.19,
      "O": 36.81
    },
    "xrfVisibleWeightPercent": {
      "Mn": 100
    }
  },
  {
    "id": "goethite",
    "namePl": "Getyt",
    "nameEn": "Goethite",
    "formula": "α-FeO(OH)",
    "mineralGroup": "Wodorotlenki",
    "stoichiometry": {
      "Fe": 1,
      "O": 2,
      "H": 1
    },
    "diagnostics": {
      "hardness": "5.0 - 5.5",
      "streak": "żółtobrunatna do ochrowej (rdzawa)",
      "luster": "diamentowy, jedwabisty lub matowy",
      "color": "brunatnoczarna, żółtobrunatna",
      "cleavage": "doskonała",
      "fracture": "nierówny",
      "density": "4.2 - 4.3 g/cm³",
      "tests": "Rdzawo-żółta rysa. Występuje w postaci nerkowatych lub promienistych skupień (\"szklana głowa\").",
      "occurrence": "Czapki żelazne (gossan), utwory wietrzeniowe, ruda darniowa."
    },
    "totalWeightPercent": {
      "Fe": 62.85,
      "O": 36.01,
      "H": 1.13
    },
    "xrfVisibleWeightPercent": {
      "Fe": 100
    }
  },
  {
    "id": "spinel",
    "namePl": "Spinel",
    "nameEn": "Spinel",
    "formula": "MgAl₂O₄",
    "mineralGroup": "Tlenki",
    "stoichiometry": {
      "Mg": 1,
      "Al": 2,
      "O": 4
    },
    "keyMolarRatios": {
      "Al/Mg": 2
    },
    "diagnostics": {
      "hardness": "7.5 - 8.0",
      "streak": "biała",
      "luster": "szklisty",
      "color": "czerwona, niebieska, zielona, czarna (hercynit/pleonast)",
      "cleavage": "brak",
      "fracture": "muszlowy",
      "density": "3.6 - 4.1 g/cm³",
      "tests": "Ośmiościenne kryształy (oktaedry), wysoka twardość. Stosunek molowy Al:Mg = 2:1.",
      "occurrence": "Marmury metamorficzne kontaktowe, bazalty, piaski kamieni szlachetnych."
    },
    "totalWeightPercent": {
      "Mg": 17.08,
      "Al": 37.93,
      "O": 44.98
    },
    "xrfVisibleWeightPercent": {
      "Mg": 31.05,
      "Al": 68.95
    }
  },
  {
    "id": "cuprite",
    "namePl": "Kupryt",
    "nameEn": "Cuprite",
    "formula": "Cu₂O",
    "mineralGroup": "Tlenki",
    "stoichiometry": {
      "Cu": 2,
      "O": 1
    },
    "diagnostics": {
      "hardness": "3.5 - 4.0",
      "streak": "brunatnoczerwona, lśniąca",
      "luster": "diamentowy do półmetalicznego",
      "color": "rubinowoczerwona do ciemnoczerwonej",
      "cleavage": "wyraźna",
      "fracture": "muszlowy",
      "density": "6.1 g/cm³",
      "tests": "Intensywnie czerwona barwa, diamentowy połysk. Bogata ruda miedzi (~88% Cu).",
      "occurrence": "Strefy utlenienia złóż kruszców miedzi."
    },
    "totalWeightPercent": {
      "Cu": 88.82,
      "O": 11.18
    },
    "xrfVisibleWeightPercent": {
      "Cu": 100
    }
  },
  {
    "id": "calcite",
    "namePl": "Kalcyt",
    "nameEn": "Calcite",
    "formula": "CaCO₃",
    "mineralGroup": "Węglany",
    "stoichiometry": {
      "Ca": 1,
      "C": 1,
      "O": 3
    },
    "diagnostics": {
      "hardness": "3.0 (wzorzec skali Mohsa)",
      "streak": "biała",
      "luster": "szklisty do perłowego",
      "color": "bezbarwna, biała, żółtawa, miodowa",
      "cleavage": "doskonała w 3 kierunkach (romboedryczna pod kątem 75°)",
      "fracture": "muszlowy (trudny ze wzgl. na łupliwość)",
      "density": "2.71 g/cm³",
      "tests": "GWAŁTOWNIE burzy (pieni się) z zimnym rozcieńczonym kwasem solnym (10% HCl). Podwójne załamanie światła.",
      "occurrence": "Wapienie, marmury, nacieki jaskiniowe, żyły hydrotermalne."
    },
    "totalWeightPercent": {
      "Ca": 40.04,
      "C": 12,
      "O": 47.96
    },
    "xrfVisibleWeightPercent": {
      "Ca": 100
    }
  },
  {
    "id": "aragonite",
    "namePl": "Aragonit",
    "nameEn": "Aragonite",
    "formula": "CaCO₃ (ortorombowy)",
    "mineralGroup": "Węglany",
    "stoichiometry": {
      "Ca": 1,
      "C": 1,
      "O": 3
    },
    "diagnostics": {
      "hardness": "3.5 - 4.0",
      "streak": "biała",
      "luster": "szklisty",
      "color": "biała, żółtawa, czerwonawo-brązowa",
      "cleavage": "wyraźna",
      "fracture": "podmuszlowy",
      "density": "2.95 g/cm³",
      "tests": "Burzy z zimnym HCl jak kalcyt, ale jest twardszy (3.5-4) i gęstszy. Słupkowe zbliźniaczenia.",
      "occurrence": "Strefy utlenienia, źródła termalne, perły i muszle mięczaków."
    },
    "totalWeightPercent": {
      "Ca": 40.04,
      "C": 12,
      "O": 47.96
    },
    "xrfVisibleWeightPercent": {
      "Ca": 100
    }
  },
  {
    "id": "dolomite",
    "namePl": "Dolomit",
    "nameEn": "Dolomite",
    "formula": "CaMg(CO₃)₂",
    "mineralGroup": "Węglany",
    "stoichiometry": {
      "Ca": 1,
      "Mg": 1,
      "C": 2,
      "O": 6
    },
    "keyMolarRatios": {
      "Ca/Mg": 1
    },
    "diagnostics": {
      "hardness": "3.5 - 4.0",
      "streak": "biała",
      "luster": "szklisty do perłowego",
      "color": "biała, szarawa, różowawa",
      "cleavage": "doskonała, romboedryczna (często siodełkowato wygięte ściany)",
      "fracture": "muszlowy",
      "density": "2.85 g/cm³",
      "tests": "Reaguje ze słabym HCl DOPIERO PO SPROSZKOWANIU lub na gorąco! W XRF widoczne Ca i Mg w stosunku molowym 1:1.",
      "occurrence": "Skały osadowe (dolomity), marmury dolomitowe, żyły kruszcowe."
    },
    "totalWeightPercent": {
      "Ca": 21.73,
      "Mg": 13.18,
      "C": 13.03,
      "O": 52.06
    },
    "xrfVisibleWeightPercent": {
      "Ca": 62.25,
      "Mg": 37.75
    }
  },
  {
    "id": "siderite",
    "namePl": "Syderyt",
    "nameEn": "Siderite",
    "formula": "FeCO₃",
    "mineralGroup": "Węglany",
    "stoichiometry": {
      "Fe": 1,
      "C": 1,
      "O": 3
    },
    "diagnostics": {
      "hardness": "3.5 - 4.5",
      "streak": "biała do żółtawoszarej",
      "luster": "szklisty do perłowego",
      "color": "jasnobrunatna, żółtobrązowa, szara",
      "cleavage": "doskonała, romboedryczna",
      "fracture": "nierówny",
      "density": "3.8 - 4.0 g/cm³",
      "tests": "Wysoka gęstość jak na węglan. Reaguje z gorącym HCl. Po prażeniu staje się magnetyczny.",
      "occurrence": "Żyły hydrotermalne kruszców, sferosyderyty w iłach ilastych."
    },
    "totalWeightPercent": {
      "Fe": 48.2,
      "C": 10.37,
      "O": 41.43
    },
    "xrfVisibleWeightPercent": {
      "Fe": 100
    }
  },
  {
    "id": "malachite",
    "namePl": "Malachit",
    "nameEn": "Malachite",
    "formula": "Cu₂CO₃(OH)₂",
    "mineralGroup": "Węglany",
    "stoichiometry": {
      "Cu": 2,
      "C": 1,
      "H": 2,
      "O": 5
    },
    "diagnostics": {
      "hardness": "3.5 - 4.0",
      "streak": "jasnozielona (charakterystyczna)",
      "luster": "diamentowy, jedwabisty do matowego",
      "color": "szmaragdowozielona, trawiasta, pasiaste wstęgi",
      "cleavage": "doskonała",
      "fracture": "nierówny",
      "density": "3.9 - 4.0 g/cm³",
      "tests": "Pieni się z rozcieńczonym HCl zabarwiając roztwór na zielono. Intensywna zielona barwa i rysa.",
      "occurrence": "Strefy wietrzenia i utlenienia kruszców miedzi."
    },
    "totalWeightPercent": {
      "Cu": 57.48,
      "C": 5.43,
      "H": 0.91,
      "O": 36.18
    },
    "xrfVisibleWeightPercent": {
      "Cu": 100
    }
  },
  {
    "id": "azurite",
    "namePl": "Azuryt",
    "nameEn": "Azurite",
    "formula": "Cu₃(CO₃)₂(OH)₂",
    "mineralGroup": "Węglany",
    "stoichiometry": {
      "Cu": 3,
      "C": 2,
      "H": 2,
      "O": 8
    },
    "diagnostics": {
      "hardness": "3.5 - 4.0",
      "streak": "jasnoniebieska",
      "luster": "szklisty do diamentowego",
      "color": "lazurowoniebieska, ciemnobłękitna",
      "cleavage": "doskonała",
      "fracture": "muszlowy",
      "density": "3.7 - 3.9 g/cm³",
      "tests": "Głęboka lazurowa barwa, burzy z kwasem solnym. Często współwystępuje z zielonym malachitem.",
      "occurrence": "Strefy utlenienia złóż miedzi."
    },
    "totalWeightPercent": {
      "Cu": 55.31,
      "C": 6.97,
      "H": 0.58,
      "O": 37.13
    },
    "xrfVisibleWeightPercent": {
      "Cu": 100
    }
  },
  {
    "id": "rhodochrosite",
    "namePl": "Rodochrozyt",
    "nameEn": "Rhodochrosite",
    "formula": "MnCO₃",
    "mineralGroup": "Węglany",
    "stoichiometry": {
      "Mn": 1,
      "C": 1,
      "O": 3
    },
    "diagnostics": {
      "hardness": "3.5 - 4.0",
      "streak": "biała",
      "luster": "szklisty do perłowego",
      "color": "malinoworóżowa, różowoczerwona",
      "cleavage": "doskonała, romboedryczna",
      "fracture": "nierówny",
      "density": "3.7 g/cm³",
      "tests": "Cudowna malinowa barwa. W XRF widoczny niemal wyłącznie Mn. Pieni się w ciepłym HCl.",
      "occurrence": "Niskotemperaturowe żyły kruszcowe z Ag, Pb, Zn."
    },
    "totalWeightPercent": {
      "Mn": 47.79,
      "C": 10.45,
      "O": 41.76
    },
    "xrfVisibleWeightPercent": {
      "Mn": 100
    }
  },
  {
    "id": "smithsonite",
    "namePl": "Smithsonit (galman cynkowy)",
    "nameEn": "Smithsonite",
    "formula": "ZnCO₃",
    "mineralGroup": "Węglany",
    "stoichiometry": {
      "Zn": 1,
      "C": 1,
      "O": 3
    },
    "diagnostics": {
      "hardness": "4.0 - 4.5",
      "streak": "biała",
      "luster": "szklisty do perłowego",
      "color": "biała, szara, zielonkawa, błękitna",
      "cleavage": "doskonała",
      "fracture": "nierówny",
      "density": "4.4 - 4.5 g/cm³",
      "tests": "Wysoka gęstość jak na węglan (Zn). Reaguje z ciepłym HCl. W XRF dominuje Zn.",
      "occurrence": "Strefy wietrzenia sfalerytu w wapieniach (śląsko-krakowskie złoża Zn-Pb)."
    },
    "totalWeightPercent": {
      "Zn": 52.14,
      "C": 9.58,
      "O": 38.28
    },
    "xrfVisibleWeightPercent": {
      "Zn": 100
    }
  },
  {
    "id": "cerussite",
    "namePl": "Cerusyt (ruda ołowiu biała)",
    "nameEn": "Cerussite",
    "formula": "PbCO₃",
    "mineralGroup": "Węglany",
    "stoichiometry": {
      "Pb": 1,
      "C": 1,
      "O": 3
    },
    "diagnostics": {
      "hardness": "3.0 - 3.5",
      "streak": "biała",
      "luster": "diamentowy, silny",
      "color": "bezbarwna, biała, szarawa",
      "cleavage": "wyraźna",
      "fracture": "muszlowy",
      "density": "6.5 - 6.6 g/cm³",
      "tests": "Bardzo ciężki minerał o intensywnym diamentowym połysku. Burzy z musowaniem w kwasie azotowym.",
      "occurrence": "Strefy utlenienia galeny."
    },
    "totalWeightPercent": {
      "Pb": 77.54,
      "C": 4.5,
      "O": 17.96
    },
    "xrfVisibleWeightPercent": {
      "Pb": 100
    }
  },
  {
    "id": "gypsum",
    "namePl": "Gips",
    "nameEn": "Gypsum",
    "formula": "CaSO₄ · 2H₂O",
    "mineralGroup": "Siarczany",
    "stoichiometry": {
      "Ca": 1,
      "S": 1,
      "H": 4,
      "O": 6
    },
    "keyMolarRatios": {
      "Ca/S": 1
    },
    "diagnostics": {
      "hardness": "2.0 (wzorzec skali Mohsa)",
      "streak": "biała",
      "luster": "szklisty, perłowy na płaszczyznach łupliwości",
      "color": "bezbarwna, biała, szara, miodowa (jaskółcze ogony)",
      "cleavage": "bardzo doskonała w jednym kierunku",
      "fracture": "włóknisty lub nierówny",
      "density": "2.31 - 2.33 g/cm³",
      "tests": "Można zarysować paznokciem (H=2). W XRF widoczne Ca i S w proporcji molowej 1:1.",
      "occurrence": "Ewaporaty morskie, osady gipsowo-solne (Nida, Wieliczka)."
    },
    "totalWeightPercent": {
      "Ca": 23.28,
      "S": 18.62,
      "H": 2.34,
      "O": 55.76
    },
    "xrfVisibleWeightPercent": {
      "Ca": 55.56,
      "S": 44.44
    }
  },
  {
    "id": "anhydrite",
    "namePl": "Anhydryt",
    "nameEn": "Anhydrite",
    "formula": "CaSO₄",
    "mineralGroup": "Siarczany",
    "stoichiometry": {
      "Ca": 1,
      "S": 1,
      "O": 4
    },
    "keyMolarRatios": {
      "Ca/S": 1
    },
    "diagnostics": {
      "hardness": "3.5",
      "streak": "biała",
      "luster": "szklisty do perłowego",
      "color": "biała, szaroniebieskawa, fiołkowa",
      "cleavage": "doskonała w 3 prostopadłych kierunkach (kostkowa)",
      "fracture": "nierówny",
      "density": "2.9 - 3.0 g/cm³",
      "tests": "Twardszy od gipsu (nie daje się zarysować paznokciem). W odróżnieniu od kalcytu nie burzy z HCl.",
      "occurrence": "Ewaporaty solne poniżej złóż gipsu."
    },
    "totalWeightPercent": {
      "Ca": 29.44,
      "S": 23.55,
      "O": 47.01
    },
    "xrfVisibleWeightPercent": {
      "Ca": 55.56,
      "S": 44.44
    }
  },
  {
    "id": "barite",
    "namePl": "Baryt (szpat ciężki)",
    "nameEn": "Barite",
    "formula": "BaSO₄",
    "mineralGroup": "Siarczany",
    "stoichiometry": {
      "Ba": 1,
      "S": 1,
      "O": 4
    },
    "keyMolarRatios": {
      "Ba/S": 1
    },
    "diagnostics": {
      "hardness": "3.0 - 3.5",
      "streak": "biała",
      "luster": "szklisty do perłowego",
      "color": "biała, żółtawa, brunatna, błękitna",
      "cleavage": "doskonała",
      "fracture": "nierówny",
      "density": "4.48 g/cm³",
      "tests": "Uderzająco ciężki jak na jasny, niemacierzysty minerał. Nie burzy z HCl. W XRF potężny pik Ba i S.",
      "occurrence": "Żyły hydrotermalne średnio- i niskotemperaturowe (Boguszów, Stanisławów)."
    },
    "totalWeightPercent": {
      "Ba": 58.84,
      "S": 13.74,
      "O": 27.42
    },
    "xrfVisibleWeightPercent": {
      "Ba": 81.07,
      "S": 18.93
    }
  },
  {
    "id": "celestite",
    "namePl": "Celestyn",
    "nameEn": "Celestine",
    "formula": "SrSO₄",
    "mineralGroup": "Siarczany",
    "stoichiometry": {
      "Sr": 1,
      "S": 1,
      "O": 4
    },
    "keyMolarRatios": {
      "Sr/S": 1
    },
    "diagnostics": {
      "hardness": "3.0 - 3.5",
      "streak": "biała",
      "luster": "szklisty do perłowego",
      "color": "jasnobłękitna, niebieskawa, biała",
      "cleavage": "doskonała",
      "fracture": "nierówny",
      "density": "3.97 g/cm³",
      "tests": "Delikatny błękitny odcień. Barwi płomień na jaskrawy karminowoczerwony kolor (stront). W XRF pik Sr i S.",
      "occurrence": "Osadowy w wapieniach, gipsach i ewaporatach."
    },
    "totalWeightPercent": {
      "Sr": 47.7,
      "S": 17.45,
      "O": 34.84
    },
    "xrfVisibleWeightPercent": {
      "Sr": 73.21,
      "S": 26.79
    }
  },
  {
    "id": "quartz",
    "namePl": "Kwarc",
    "nameEn": "Quartz",
    "formula": "SiO₂",
    "mineralGroup": "Krzemiany (tekto)",
    "stoichiometry": {
      "Si": 1,
      "O": 2
    },
    "diagnostics": {
      "hardness": "7.0 (wzorzec skali Mohsa)",
      "streak": "biała (rysuje szkło i nóż)",
      "luster": "szklisty, na przełamie tłusty",
      "color": "bezbarwny (kryształ górski), mleczny, dymny, fioletowy (ametyst)",
      "cleavage": "brak (brak płaszczyzn łupliwości)",
      "fracture": "doskonały muszlowy",
      "density": "2.65 g/cm³",
      "tests": "Rysuje szkło (H=7). Brak łupliwości, charakterystyczny muszlowy przełam. W XRF 100% widzialnego to Si.",
      "occurrence": "Jeden z najpospolitszych minerałów skorupy ziemskiej (granity, piaskowce, kwarcyty)."
    },
    "totalWeightPercent": {
      "Si": 46.74,
      "O": 53.26
    },
    "xrfVisibleWeightPercent": {
      "Si": 100
    }
  },
  {
    "id": "orthoclase",
    "namePl": "Ortoklaz (skaleń potasowy)",
    "nameEn": "Orthoclase / K-Feldspar",
    "formula": "KAlSi₃O₈",
    "mineralGroup": "Krzemiany (skalenie)",
    "stoichiometry": {
      "K": 1,
      "Al": 1,
      "Si": 3,
      "O": 8
    },
    "keyMolarRatios": {
      "Si/Al": 3,
      "K/Al": 1
    },
    "diagnostics": {
      "hardness": "6.0 (wzorzec skali Mohsa)",
      "streak": "biała",
      "luster": "szklisty do perłowego",
      "color": "różowa, mięsna, czerwonawo-łososiowa, biała",
      "cleavage": "doskonała w 2 kierunkach pod kątem prostym (90°)",
      "fracture": "nierówny do muszlowego",
      "density": "2.56 - 2.58 g/cm³",
      "tests": "Różowa barwa, łupliwość pod kątem prostym. W XRF obecność K, Al, Si w stosunku molowym 1:1:3.",
      "occurrence": "Główny składnik granitów, sjenitów i pegmatytów."
    },
    "totalWeightPercent": {
      "K": 14.05,
      "Al": 9.69,
      "Si": 30.27,
      "O": 45.99
    },
    "xrfVisibleWeightPercent": {
      "K": 26.01,
      "Al": 17.95,
      "Si": 56.04
    }
  },
  {
    "id": "albite",
    "namePl": "Albit (plagioklaz sodowy)",
    "nameEn": "Albite",
    "formula": "NaAlSi₃O₈",
    "mineralGroup": "Krzemiany (plagioklazy)",
    "stoichiometry": {
      "Na": 1,
      "Al": 1,
      "Si": 3,
      "O": 8
    },
    "keyMolarRatios": {
      "Si/Al": 3,
      "Na/Al": 1
    },
    "diagnostics": {
      "hardness": "6.0 - 6.5",
      "streak": "biała",
      "luster": "szklisty",
      "color": "czysto biała, szarobiała, niebieskawa (perysteryt)",
      "cleavage": "doskonała pod kątem 86° (charakterystyczne prążkowanie polisyntetyczne)",
      "fracture": "nierówny",
      "density": "2.62 g/cm³",
      "tests": "Delikatne rysy (prążki zbliźniaczeń) na powierzchniach łupliwości. W XRF widoczne Na, Al, Si.",
      "occurrence": "Granity, pegmatyty, skały metamorficzne facji zieleńcowej."
    },
    "totalWeightPercent": {
      "Na": 8.77,
      "Al": 10.29,
      "Si": 32.13,
      "O": 48.81
    },
    "xrfVisibleWeightPercent": {
      "Na": 17.13,
      "Al": 20.1,
      "Si": 62.77
    }
  },
  {
    "id": "anorthite",
    "namePl": "Anortyt (plagioklaz wapniowy)",
    "nameEn": "Anorthite",
    "formula": "CaAl₂Si₂O₈",
    "mineralGroup": "Krzemiany (plagioklazy)",
    "stoichiometry": {
      "Ca": 1,
      "Al": 2,
      "Si": 2,
      "O": 8
    },
    "keyMolarRatios": {
      "Si/Al": 1,
      "Ca/Al": 0.5
    },
    "diagnostics": {
      "hardness": "6.0 - 6.5",
      "streak": "biała",
      "luster": "szklisty",
      "color": "biała, szarawa",
      "cleavage": "doskonała",
      "fracture": "nierówny",
      "density": "2.73 - 2.76 g/cm³",
      "tests": "Skaleń zasadowy. W XRF dominują Ca, Al, Si z proporcją molową Ca:Al:Si = 1:2:2.",
      "occurrence": "Skały zasadowe (gabra, bazalty, anortozyty, meteoryty księżycowe)."
    },
    "totalWeightPercent": {
      "Ca": 14.41,
      "Al": 19.4,
      "Si": 20.19,
      "O": 46.01
    },
    "xrfVisibleWeightPercent": {
      "Ca": 26.68,
      "Al": 35.92,
      "Si": 37.39
    }
  },
  {
    "id": "muscovite",
    "namePl": "Muskowit (łyszczyk jasny)",
    "nameEn": "Muscovite",
    "formula": "KAl₂(AlSi₃O₁₀)(OH)₂",
    "mineralGroup": "Krzemiany (fyllokrzemiany)",
    "stoichiometry": {
      "K": 1,
      "Al": 3,
      "Si": 3,
      "H": 2,
      "O": 12
    },
    "keyMolarRatios": {
      "Si/Al": 1,
      "K/Al": 0.333
    },
    "diagnostics": {
      "hardness": "2.0 - 2.5 (równolegle do blaszek)",
      "streak": "biała",
      "luster": "perłowy do srebrzystoszklistego",
      "color": "bezbarwna, srebrzysta, jasnożółta",
      "cleavage": "wyjątkowo doskonała (rozszczepia się na cienkie, sprężyste blaszki)",
      "fracture": "haczykowaty",
      "density": "2.76 - 2.88 g/cm³",
      "tests": "Cienkie, przezroczyste, sprężyste blaszki (po zgięciu powracają do stanu płaskiego). Izolator.",
      "occurrence": "Łupki łyszczykowe, gnejsy, pegmatyty granitowe."
    },
    "totalWeightPercent": {
      "K": 9.82,
      "Al": 20.32,
      "Si": 21.15,
      "H": 0.51,
      "O": 48.2
    },
    "xrfVisibleWeightPercent": {
      "K": 19.14,
      "Al": 39.62,
      "Si": 41.24
    }
  },
  {
    "id": "biotite",
    "namePl": "Biotyt (łyszczyk ciemny)",
    "nameEn": "Biotite",
    "formula": "K(Mg,Fe)₃(AlSi₃O₁₀)(OH)₂",
    "mineralGroup": "Krzemiany (fyllokrzemiany)",
    "stoichiometry": {
      "K": 1,
      "Mg": 1.5,
      "Fe": 1.5,
      "Al": 1,
      "Si": 3,
      "H": 2,
      "O": 12
    },
    "diagnostics": {
      "hardness": "2.5 - 3.0",
      "streak": "biała do szarawej",
      "luster": "szklisty do perłowego",
      "color": "ciemnobrązowa do czarnej",
      "cleavage": "wyjątkowo doskonała w jednym kierunku",
      "fracture": "nierówny",
      "density": "2.8 - 3.2 g/cm³",
      "tests": "Czarne sprężyste blaszki. W odróżnieniu od muskowitu bogaty w Fe i Mg.",
      "occurrence": "Granity, dioryty, gnejsy, łupki krystaliczne."
    },
    "totalWeightPercent": {
      "K": 8.42,
      "Mg": 7.85,
      "Fe": 18.03,
      "Al": 5.81,
      "Si": 18.14,
      "H": 0.43,
      "O": 41.33
    },
    "xrfVisibleWeightPercent": {
      "K": 14.45,
      "Mg": 13.47,
      "Fe": 30.96,
      "Al": 9.97,
      "Si": 31.14
    }
  },
  {
    "id": "forsterite",
    "namePl": "Forsteryt / Oliwin",
    "nameEn": "Forsterite / Olivine",
    "formula": "Mg₂SiO₄",
    "mineralGroup": "Krzemiany (neso)",
    "stoichiometry": {
      "Mg": 2,
      "Si": 1,
      "O": 4
    },
    "keyMolarRatios": {
      "Mg/Si": 2
    },
    "diagnostics": {
      "hardness": "6.5 - 7.0",
      "streak": "biała",
      "luster": "szklisty",
      "color": "oliwkowozielona, żółtozielona",
      "cleavage": "słaba",
      "fracture": "muszlowy",
      "density": "3.22 - 3.30 g/cm³",
      "tests": "Charakterystyczna oliwkowa barwa, muszlowy przełam, brak łupliwości. W XRF wysokie Mg i Si.",
      "occurrence": "Główny składnik płaszcza Ziemi, perydotyty, bazalty, meteoryty."
    },
    "totalWeightPercent": {
      "Mg": 34.55,
      "Si": 19.96,
      "O": 45.49
    },
    "xrfVisibleWeightPercent": {
      "Mg": 63.38,
      "Si": 36.62
    }
  },
  {
    "id": "fayalite",
    "namePl": "Fajalit (oliwin żelazisty)",
    "nameEn": "Fayalite",
    "formula": "Fe₂SiO₄",
    "mineralGroup": "Krzemiany (neso)",
    "stoichiometry": {
      "Fe": 2,
      "Si": 1,
      "O": 4
    },
    "keyMolarRatios": {
      "Fe/Si": 2
    },
    "diagnostics": {
      "hardness": "6.5",
      "streak": "szara",
      "luster": "szklisty do żywicznego",
      "color": "brunatnoczarna do czarnej",
      "cleavage": "słaba",
      "fracture": "muszlowy",
      "density": "4.39 g/cm³",
      "tests": "Ciemna barwa, wysoka gęstość (Fe). Stosunek molowy Fe do Si = 2:1.",
      "occurrence": "Żużle hutnicze, rzadkie skały magmowe bogate w żelazo."
    },
    "totalWeightPercent": {
      "Fe": 54.81,
      "Si": 13.78,
      "O": 31.41
    },
    "xrfVisibleWeightPercent": {
      "Fe": 79.91,
      "Si": 20.09
    }
  },
  {
    "id": "almandine",
    "namePl": "Almandyn (granat żelazowy)",
    "nameEn": "Almandine Garnet",
    "formula": "Fe₃Al₂(SiO₄)₃",
    "mineralGroup": "Krzemiany (granaty)",
    "stoichiometry": {
      "Fe": 3,
      "Al": 2,
      "Si": 3,
      "O": 12
    },
    "keyMolarRatios": {
      "Fe/Al": 1.5,
      "Si/Al": 1.5
    },
    "diagnostics": {
      "hardness": "7.0 - 7.5",
      "streak": "biała",
      "luster": "szklisty do żywicznego",
      "color": "ciemnoczerwona, brunatnoczerwona, fioletowoczerwona",
      "cleavage": "brak (oddzielność)",
      "fracture": "muszlowy do nierównego",
      "density": "4.1 - 4.3 g/cm³",
      "tests": "Kryształy dwunastościany rombowe (dodekaedry) lub dwudziestoczterościany. Bardzo twardy, rysuje kwarc.",
      "occurrence": "Łupki mikowe, gnejsy, amfibolity."
    },
    "totalWeightPercent": {
      "Fe": 33.66,
      "Al": 10.84,
      "Si": 16.93,
      "O": 38.57
    },
    "xrfVisibleWeightPercent": {
      "Fe": 54.79,
      "Al": 17.65,
      "Si": 27.56
    }
  },
  {
    "id": "pyrope",
    "namePl": "Pirop (granat magnezowy)",
    "nameEn": "Pyrope Garnet",
    "formula": "Mg₃Al₂(SiO₄)₃",
    "mineralGroup": "Krzemiany (granaty)",
    "stoichiometry": {
      "Mg": 3,
      "Al": 2,
      "Si": 3,
      "O": 12
    },
    "keyMolarRatios": {
      "Mg/Al": 1.5,
      "Si/Al": 1.5
    },
    "diagnostics": {
      "hardness": "7.0 - 7.5",
      "streak": "biała",
      "luster": "szklisty",
      "color": "krwistoczerwona, rubinowa",
      "cleavage": "brak",
      "fracture": "muszlowy",
      "density": "3.6 - 3.8 g/cm³",
      "tests": "Intensywnie krwistoczerwony granat (\"czeski granat\"). W XRF wysokie Mg, Al, Si bez znacznego Fe.",
      "occurrence": "Eklogity, perydotyty, kominy kimberlitowe z diamentami."
    },
    "totalWeightPercent": {
      "Mg": 18.09,
      "Al": 13.39,
      "Si": 20.9,
      "O": 47.63
    },
    "xrfVisibleWeightPercent": {
      "Mg": 34.54,
      "Al": 25.56,
      "Si": 39.91
    }
  },
  {
    "id": "grossular",
    "namePl": "Grossular (granat wapniowy)",
    "nameEn": "Grossular Garnet",
    "formula": "Ca₃Al₂(SiO₄)₃",
    "mineralGroup": "Krzemiany (granaty)",
    "stoichiometry": {
      "Ca": 3,
      "Al": 2,
      "Si": 3,
      "O": 12
    },
    "keyMolarRatios": {
      "Ca/Al": 1.5,
      "Si/Al": 1.5
    },
    "diagnostics": {
      "hardness": "6.5 - 7.0",
      "streak": "biała",
      "luster": "szklisty do żywicznego",
      "color": "zielona (tsavoryt), miodowożółta (hessonit), brunatna",
      "cleavage": "brak",
      "fracture": "muszlowy",
      "density": "3.5 - 3.7 g/cm³",
      "tests": "Granat wapniowo-glinowy. Typowy dla skarnów i zmetamorfizowanych wapieni.",
      "occurrence": "Skarny, wapienie metamorficzne."
    },
    "totalWeightPercent": {
      "Ca": 26.69,
      "Al": 11.98,
      "Si": 18.71,
      "O": 42.62
    },
    "xrfVisibleWeightPercent": {
      "Ca": 46.52,
      "Al": 20.88,
      "Si": 32.6
    }
  },
  {
    "id": "zircon",
    "namePl": "Cyrkon",
    "nameEn": "Zircon",
    "formula": "ZrSiO₄",
    "mineralGroup": "Krzemiany (neso)",
    "stoichiometry": {
      "Zr": 1,
      "Si": 1,
      "O": 4
    },
    "keyMolarRatios": {
      "Zr/Si": 1
    },
    "diagnostics": {
      "hardness": "7.5",
      "streak": "biała",
      "luster": "diamentowy do tłustego",
      "color": "brązowa, czerwonobrązowa, żółtawa",
      "cleavage": "słaba",
      "fracture": "muszlowy",
      "density": "4.6 - 4.7 g/cm³",
      "tests": "Diamentowy blask, wysoka twardość i gęstość. W XRF potężny pik cyrkonu (Zr) i krzemu (Si) 1:1 molowo.",
      "occurrence": "Granity, syenity, piaski cyrkonowe, najstarszy znany minerał Ziemi."
    },
    "totalWeightPercent": {
      "Zr": 49.77,
      "Si": 15.32,
      "O": 34.91
    },
    "xrfVisibleWeightPercent": {
      "Zr": 76.46,
      "Si": 23.54
    }
  },
  {
    "id": "titanite",
    "namePl": "Tytanit (sfen)",
    "nameEn": "Titanite / Sphene",
    "formula": "CaTiSiO₅",
    "mineralGroup": "Krzemiany (neso)",
    "stoichiometry": {
      "Ca": 1,
      "Ti": 1,
      "Si": 1,
      "O": 5
    },
    "keyMolarRatios": {
      "Ca/Ti": 1,
      "Ti/Si": 1
    },
    "diagnostics": {
      "hardness": "5.0 - 5.5",
      "streak": "biała",
      "luster": "diamentowy do żywicznego",
      "color": "żółtawozielona, brązowa, miodowa",
      "cleavage": "wyraźna",
      "fracture": "podmuszlowy",
      "density": "3.45 - 3.55 g/cm³",
      "tests": "Kopertowate kryształy klinowe. W XRF równy molowy udział Ca, Ti i Si (1:1:1).",
      "occurrence": "Sjenity, pegmatyty, skarny, gnejsy."
    },
    "totalWeightPercent": {
      "Ca": 20.45,
      "Ti": 24.42,
      "Si": 14.33,
      "O": 40.81
    },
    "xrfVisibleWeightPercent": {
      "Ca": 34.54,
      "Ti": 41.25,
      "Si": 24.2
    }
  },
  {
    "id": "talc",
    "namePl": "Talk",
    "nameEn": "Talc",
    "formula": "Mg₃Si₄O₁₀(OH)₂",
    "mineralGroup": "Krzemiany (fyllokrzemiany)",
    "stoichiometry": {
      "Mg": 3,
      "Si": 4,
      "H": 2,
      "O": 12
    },
    "keyMolarRatios": {
      "Mg/Si": 0.75
    },
    "diagnostics": {
      "hardness": "1.0 (wzorzec skali Mohsa)",
      "streak": "biała",
      "luster": "perłowy do tłustego",
      "color": "biała, szarozielonkawa, srebrzystobiała",
      "cleavage": "doskonała w jednym kierunku",
      "fracture": "nierówny",
      "density": "2.7 - 2.8 g/cm³",
      "tests": "Najbardziej miękki minerał (H=1) – zarysowuje się paznokciem bez najmniejszego oporu, tłusty w dotyku.",
      "occurrence": "Skały metamorficzne (łupki talkowe), hydrotermalne przeobrażenia perydotytów."
    },
    "totalWeightPercent": {
      "Mg": 19.23,
      "Si": 29.62,
      "H": 0.53,
      "O": 50.62
    },
    "xrfVisibleWeightPercent": {
      "Mg": 39.36,
      "Si": 60.64
    }
  },
  {
    "id": "serpentine",
    "namePl": "Serpentyn (antygoryt / chryzotyl)",
    "nameEn": "Serpentine",
    "formula": "Mg₃Si₂O₅(OH)₄",
    "mineralGroup": "Krzemiany",
    "stoichiometry": {
      "Mg": 3,
      "Si": 2,
      "H": 4,
      "O": 9
    },
    "keyMolarRatios": {
      "Mg/Si": 1.5
    },
    "diagnostics": {
      "hardness": "2.5 - 3.5",
      "streak": "biała",
      "luster": "tłusty, woskowy lub jedwabisty (azbest)",
      "color": "różne odcienie zieleni (od jaskrawozielonej do ciemnej, plamiste)",
      "cleavage": "brak (agregaty)",
      "fracture": "muszlowy, zadziorowaty",
      "density": "2.5 - 2.6 g/cm³",
      "tests": "Plamista, wężowa barwa (stąd nazwa), woskowy połysk. W XRF widoczne tylko Mg i Si (3:2 molowo).",
      "occurrence": "Serpentynity (przeobrażone perydotyty)."
    },
    "totalWeightPercent": {
      "Mg": 26.31,
      "Si": 20.27,
      "H": 1.46,
      "O": 51.96
    },
    "xrfVisibleWeightPercent": {
      "Mg": 56.49,
      "Si": 43.51
    }
  },
  {
    "id": "epidote",
    "namePl": "Epidot",
    "nameEn": "Epidote",
    "formula": "Ca₂Al₂Fe(Si₂O₇)(SiO₄)O(OH)",
    "mineralGroup": "Krzemiany (soro)",
    "stoichiometry": {
      "Ca": 2,
      "Al": 2,
      "Fe": 1,
      "Si": 3,
      "H": 1,
      "O": 13
    },
    "diagnostics": {
      "hardness": "6.0 - 7.0",
      "streak": "szarobiała",
      "luster": "szklisty",
      "color": "pistacjowozielona do żółtawozielonej",
      "cleavage": "doskonała",
      "fracture": "nierówny",
      "density": "3.3 - 3.5 g/cm³",
      "tests": "Charakterystyczna pistacjowa zieleń. W XRF obecność Ca, Al, Fe i Si.",
      "occurrence": "Zieleńce, skarny, amfibolity, zmetamorfizowane bazalty."
    },
    "totalWeightPercent": {
      "Ca": 16.59,
      "Al": 11.17,
      "Fe": 11.56,
      "Si": 17.44,
      "H": 0.21,
      "O": 43.04
    },
    "xrfVisibleWeightPercent": {
      "Ca": 29.23,
      "Al": 19.68,
      "Fe": 20.37,
      "Si": 30.73
    }
  },
  {
    "id": "kaolinite",
    "namePl": "Kaolinit",
    "nameEn": "Kaolinite",
    "formula": "Al₂Si₂O₅(OH)₄",
    "mineralGroup": "Krzemiany (minerały ilaste)",
    "stoichiometry": {
      "Al": 2,
      "Si": 2,
      "H": 4,
      "O": 9
    },
    "keyMolarRatios": {
      "Al/Si": 1
    },
    "diagnostics": {
      "hardness": "2.0 - 2.5",
      "streak": "biała",
      "luster": "matowy, ziemisty",
      "color": "śnieżnobiała, kremowa",
      "cleavage": "doskonała (mikroskopowa)",
      "fracture": "ziemisty",
      "density": "2.6 g/cm³",
      "tests": "Plastyczny po zwilżeniu wodą, zapach gliny. W XRF równy stosunek molowy Al i Si (1:1).",
      "occurrence": "Wietrzenie granitów i skaleni w klimacie ciepłym (glinki kaolinowe)."
    },
    "totalWeightPercent": {
      "Al": 20.9,
      "Si": 21.76,
      "H": 1.56,
      "O": 55.78
    },
    "xrfVisibleWeightPercent": {
      "Al": 49,
      "Si": 51
    }
  },
  {
    "id": "beryl",
    "namePl": "Beryl (szmaragd / akwamaryn)",
    "nameEn": "Beryl",
    "formula": "Be₃Al₂Si₆O₁₈",
    "mineralGroup": "Krzemiany (cyklo)",
    "stoichiometry": {
      "Be": 3,
      "Al": 2,
      "Si": 6,
      "O": 18
    },
    "keyMolarRatios": {
      "Si/Al": 3
    },
    "diagnostics": {
      "hardness": "7.5 - 8.0",
      "streak": "biała",
      "luster": "szklisty",
      "color": "szmaragdowozielona, błękitna (akwamaryn), żółta (helidor), różowa (morganit)",
      "cleavage": "niewyraźna",
      "fracture": "muszlowy do nierównego",
      "density": "2.6 - 2.9 g/cm³",
      "tests": "Heksagonalne słupy. UWAGA: Beryl (Be, Z=4) jest niewidoczny dla XRF! XRF widzi tylko Al i Si w stosunku molowym 1:3.",
      "occurrence": "Pegmatyty granitowe, grejzeny."
    },
    "totalWeightPercent": {
      "Be": 5.03,
      "Al": 10.04,
      "Si": 31.35,
      "O": 53.58
    },
    "xrfVisibleWeightPercent": {
      "Al": 24.26,
      "Si": 75.74
    }
  },
  {
    "id": "apatite",
    "namePl": "Apatyt",
    "nameEn": "Apatite",
    "formula": "Ca₅(PO₄)₃(F,Cl,OH)",
    "mineralGroup": "Fosforany",
    "stoichiometry": {
      "Ca": 5,
      "P": 3,
      "O": 12,
      "F": 1
    },
    "keyMolarRatios": {
      "Ca/P": 1.667
    },
    "diagnostics": {
      "hardness": "5.0 (wzorzec skali Mohsa)",
      "streak": "biała",
      "luster": "szklisty do tłustego",
      "color": "zielona, niebieskozielona, żółtawa, fioletowa",
      "cleavage": "słaba",
      "fracture": "muszlowy",
      "density": "3.1 - 3.2 g/cm³",
      "tests": "Rysuje się nożem ze stalowym ostrzem (H=5). W XRF dominują Ca i P w stosunku molowym ~5:3 (1.67).",
      "occurrence": "Skały magmowe, fosforyty osadowe, główny składnik kości i zębów."
    },
    "totalWeightPercent": {
      "Ca": 39.74,
      "P": 18.43,
      "O": 38.07,
      "F": 3.77
    },
    "xrfVisibleWeightPercent": {
      "Ca": 68.32,
      "P": 31.68
    }
  },
  {
    "id": "fluorite",
    "namePl": "Fluoryt",
    "nameEn": "Fluorite",
    "formula": "CaF₂",
    "mineralGroup": "Halogenki",
    "stoichiometry": {
      "Ca": 1,
      "F": 2
    },
    "diagnostics": {
      "hardness": "4.0 (wzorzec skali Mohsa)",
      "streak": "biała",
      "luster": "szklisty",
      "color": "fioletowa, zielona, żółta, bezbarwna (często pasowa)",
      "cleavage": "doskonała, ośmiościenna (w 4 kierunkach)",
      "fracture": "podmuszlowy",
      "density": "3.18 g/cm³",
      "tests": "UWAGA: Fluor (F, Z=9) jest niewidoczny dla XRF! XRF widzi ~100% Ca. Doskonała ośmiościenna łupliwość, silna fluorescencja UV.",
      "occurrence": "Żyły hydrotermalne z barytem, galeną i sfalerytem (Kletno)."
    },
    "totalWeightPercent": {
      "Ca": 51.33,
      "F": 48.67
    },
    "xrfVisibleWeightPercent": {
      "Ca": 100
    }
  },
  {
    "id": "halite",
    "namePl": "Halit (sól kamienna)",
    "nameEn": "Halite / Rock Salt",
    "formula": "NaCl",
    "mineralGroup": "Halogenki",
    "stoichiometry": {
      "Na": 1,
      "Cl": 1
    },
    "keyMolarRatios": {
      "Na/Cl": 1
    },
    "diagnostics": {
      "hardness": "2.5",
      "streak": "biała",
      "luster": "szklisty",
      "color": "bezbarwna, biała, szara, pomarańczowa, niebieska",
      "cleavage": "doskonała, sześciana (kostkowa w 3 kierunkach pod kątem 90°)",
      "fracture": "muszlowy",
      "density": "2.16 g/cm³",
      "tests": "Słony smak! Łatwo rozpuszcza się w wodzie. W XRF widoczne Na i Cl w stosunku molowym 1:1.",
      "occurrence": "Ewaporaty morskie i jeziorne (Wieliczka, Bochnia, Kłodawa)."
    },
    "totalWeightPercent": {
      "Na": 39.34,
      "Cl": 60.66
    },
    "xrfVisibleWeightPercent": {
      "Na": 39.34,
      "Cl": 60.66
    }
  },
  {
    "id": "sylvite",
    "namePl": "Sylwin (sól potasowa)",
    "nameEn": "Sylvite",
    "formula": "KCl",
    "mineralGroup": "Halogenki",
    "stoichiometry": {
      "K": 1,
      "Cl": 1
    },
    "keyMolarRatios": {
      "K/Cl": 1
    },
    "diagnostics": {
      "hardness": "2.0",
      "streak": "biała",
      "luster": "szklisty",
      "color": "bezbarwna, mleczna, czerwonawa",
      "cleavage": "doskonała, sześciana",
      "fracture": "nierówny",
      "density": "1.99 g/cm³",
      "tests": "Pieczołowicie gorzki / ostry słony smak. W XRF wyraźne piki K i Cl w proporcji 1:1 molowo.",
      "occurrence": "Złoża soli potasowo-magnezowych."
    },
    "totalWeightPercent": {
      "K": 52.45,
      "Cl": 47.55
    },
    "xrfVisibleWeightPercent": {
      "K": 52.45,
      "Cl": 47.55
    }
  },
  {
    "id": "gold",
    "namePl": "Złoto rodzime",
    "nameEn": "Native Gold",
    "formula": "Au (często z domieszką Ag - elektrum)",
    "mineralGroup": "Pierwiastki rodzime",
    "stoichiometry": {
      "Au": 1
    },
    "diagnostics": {
      "hardness": "2.5 - 3.0",
      "streak": "złocistożółta, błyszcząca (nigdy czarna jak w pirycie!)",
      "luster": "metaliczny, bardzo silny",
      "color": "złotożółta",
      "cleavage": "brak",
      "fracture": "haczykowaty",
      "density": "15.6 - 19.3 g/cm³ (ekstremalnie duża)",
      "tests": "Kowalne i ciągliwe – daje się spłaszczać uderzeniem bez kruszenia. Ciężkie w misce płuczkarskiej. W XRF potężny pik Au.",
      "occurrence": "Żyły kwarcowe hydrotermalne, piaski złotonośne (samorodki)."
    },
    "totalWeightPercent": {
      "Au": 100
    },
    "xrfVisibleWeightPercent": {
      "Au": 100
    }
  },
  {
    "id": "silver",
    "namePl": "Srebro rodzime",
    "nameEn": "Native Silver",
    "formula": "Ag",
    "mineralGroup": "Pierwiastki rodzime",
    "stoichiometry": {
      "Ag": 1
    },
    "diagnostics": {
      "hardness": "2.5 - 3.0",
      "streak": "srebrzystobiała, lśniąca",
      "luster": "metaliczny",
      "color": "srebrzystobiała, na powietrzu czernieje",
      "cleavage": "brak",
      "fracture": "haczykowaty",
      "density": "10.1 - 11.1 g/cm³",
      "tests": "Kowalne, drutowate lub dendrytyczne skupienia. W XRF dominacja Ag.",
      "occurrence": "Strefy utlenienia złóż kruszców srebra i ołowiu."
    },
    "totalWeightPercent": {
      "Ag": 100
    },
    "xrfVisibleWeightPercent": {
      "Ag": 100
    }
  },
  {
    "id": "copper",
    "namePl": "Miedź rodzima",
    "nameEn": "Native Copper",
    "formula": "Cu",
    "mineralGroup": "Pierwiastki rodzime",
    "stoichiometry": {
      "Cu": 1
    },
    "diagnostics": {
      "hardness": "2.5 - 3.0",
      "streak": "miedzianoczerwona, błyszcząca",
      "luster": "metaliczny",
      "color": "miedzianoczerwona, pokrywa się zieloną patyną",
      "cleavage": "brak",
      "fracture": "haczykowaty",
      "density": "8.9 g/cm³",
      "tests": "Kowalna, daje się ciąć nożem. Charakterystyczna barwa i patyna malachitowa. W XRF 100% Cu.",
      "occurrence": "Strefy utlenienia złóż miedzi, bazalty migdałowcowe (Lake Superior)."
    },
    "totalWeightPercent": {
      "Cu": 100
    },
    "xrfVisibleWeightPercent": {
      "Cu": 100
    }
  },
  {
    "id": "sulfur",
    "namePl": "Siarka rodzima",
    "nameEn": "Native Sulfur",
    "formula": "S",
    "mineralGroup": "Pierwiastki rodzime",
    "stoichiometry": {
      "S": 1
    },
    "diagnostics": {
      "hardness": "1.5 - 2.5",
      "streak": "biała do jasnożółtej",
      "luster": "żywiczny do tłustego",
      "color": "siarkowożółta, cytrynowa, miodowa",
      "cleavage": "niewyraźna",
      "fracture": "muszlowy do nierównego",
      "density": "2.05 - 2.09 g/cm³",
      "tests": "Pali się niebieskim płomieniem wydzielając gryzący SO₂. Pęka w dłoni od ciepła. W XRF 100% S.",
      "occurrence": "Ewaporaty gipsowe (Tarnobrzeg), wyziewy wulkaniczne (solfatary)."
    },
    "totalWeightPercent": {
      "S": 100
    },
    "xrfVisibleWeightPercent": {
      "S": 100
    }
  }
];
