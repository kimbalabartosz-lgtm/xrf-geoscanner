import { DetectedElement } from '@/types';

export interface SamplePreset {
  id: string;
  name: string;
  description: string;
  elements: DetectedElement[];
}

export const SAMPLE_PRESETS: SamplePreset[] = [
  {
    id: 'pyrite-sample',
    name: 'Piryt (FeS₂)',
    description: 'Typowy odczyt XRF z próbki pirytu ze złoża polimetalicznego',
    elements: [
      { id: '1', symbol: 'Fe', value: 46.4, errorMargin: 0.2 },
      { id: '2', symbol: 'S', value: 53.2, errorMargin: 0.3 },
      { id: '3', symbol: 'Cu', value: 0.3, errorMargin: 0.05 },
      { id: '4', symbol: 'As', value: 0.1, errorMargin: 0.02 }
    ]
  },
  {
    id: 'chalcopyrite-sample',
    name: 'Chalkopiryt (CuFeS₂)',
    description: 'Ruda miedzi z kopalni KGHM Lubin / Polkowice',
    elements: [
      { id: '1', symbol: 'Cu', value: 34.2, errorMargin: 0.2 },
      { id: '2', symbol: 'Fe', value: 30.5, errorMargin: 0.2 },
      { id: '3', symbol: 'S', value: 34.8, errorMargin: 0.3 },
      { id: '4', symbol: 'Ag', value: 0.2, errorMargin: 0.02 },
      { id: '5', symbol: 'Zn', value: 0.3, errorMargin: 0.04 }
    ]
  },
  {
    id: 'galena-sample',
    name: 'Galena (PbS)',
    description: 'Odczyt kruszcu ołowiu i srebra ze śląsko-krakowskiego złoża Zn-Pb',
    elements: [
      { id: '1', symbol: 'Pb', value: 85.8, errorMargin: 0.4 },
      { id: '2', symbol: 'S', value: 13.5, errorMargin: 0.2 },
      { id: '3', symbol: 'Ag', value: 0.4, errorMargin: 0.03 },
      { id: '4', symbol: 'Fe', value: 0.3, errorMargin: 0.05 }
    ]
  },
  {
    id: 'sphalerite-sample',
    name: 'Sfalleryt (ZnS)',
    description: 'Blenda cynkowa bogata w cynk z domieszką żelaza',
    elements: [
      { id: '1', symbol: 'Zn', value: 64.1, errorMargin: 0.3 },
      { id: '2', symbol: 'S', value: 32.8, errorMargin: 0.2 },
      { id: '3', symbol: 'Fe', value: 2.8, errorMargin: 0.1 },
      { id: '4', symbol: 'Cd', value: 0.3, errorMargin: 0.04 }
    ]
  },
  {
    id: 'dolomite-sample',
    name: 'Dolomit (CaMg(CO₃)₂)',
    description: 'Węglan wapniowo-magnezowy (XRF widzi wyłącznie Ca i Mg, C i O są niewidoczne)',
    elements: [
      { id: '1', symbol: 'Ca', value: 61.8, errorMargin: 0.3 },
      { id: '2', symbol: 'Mg', value: 37.5, errorMargin: 0.4 },
      { id: '3', symbol: 'Fe', value: 0.7, errorMargin: 0.05 }
    ]
  },
  {
    id: 'feldspar-sample',
    name: 'Skaleń potasowy / Ortoklaz (KAlSi₃O₈)',
    description: 'Pegmatyt granitowy (K-Al-Si, tlen niewidoczny)',
    elements: [
      { id: '1', symbol: 'Si', value: 55.4, errorMargin: 0.4 },
      { id: '2', symbol: 'K', value: 26.2, errorMargin: 0.3 },
      { id: '3', symbol: 'Al', value: 17.8, errorMargin: 0.2 },
      { id: '4', symbol: 'Na', value: 0.6, errorMargin: 0.05 }
    ]
  },
  {
    id: 'barite-sample',
    name: 'Baryt (BaSO₄)',
    description: 'Ciężki siarczan baru ze złoża hydrotermalnego Stanisławów',
    elements: [
      { id: '1', symbol: 'Ba', value: 80.6, errorMargin: 0.5 },
      { id: '2', symbol: 'S', value: 18.9, errorMargin: 0.2 },
      { id: '3', symbol: 'Sr', value: 0.5, errorMargin: 0.04 }
    ]
  },
  {
    id: 'zircon-sample',
    name: 'Cyrkon (ZrSiO₄)',
    description: 'Ciężki minerał krzemianowy cyrkonu',
    elements: [
      { id: '1', symbol: 'Zr', value: 76.2, errorMargin: 0.4 },
      { id: '2', symbol: 'Si', value: 23.3, errorMargin: 0.3 },
      { id: '3', symbol: 'Hf', value: 0.5, errorMargin: 0.05 }
    ]
  }
];
