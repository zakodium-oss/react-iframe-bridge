export interface SampleTocEntry {
  mf: string;
  mw: number;
  keyword: string[];
  meta: Record<string, unknown>;
  title: string;
  nbNmr: number;
  nbIR: number;
  nbRaman: number;
  nbMass: number;
  nb1d: number;
  nb2d: number;
  nb1h: number;
  nb13c: number;
  nbTGA: number;
  nbDSC: number;
  nbXRD: number;
  nbXPS: number;
  nbUV: number;
  nbChromatogram: number;
  nbXray: number;
  nbNucleic: number;
  nbPeptidic: number;
  modificationDate: number;
  b64ShortId: string;
  hidden: boolean;
  names: string[];
  reference: string;
}

export type SampleEntryId = [string, string];
export interface SampleEntry {
  _id: string;
  _rev: string;
  $type: 'entry';
  $id: SampleEntryId;
  $kind: 'sample';
  $owners: string[];
  $content: SampleEntryContent;
}

export interface SampleEntryContent {
  general: {
    title?: string;
    name?: Array<{ value: string }>;
    mf: string;
    mw: number;
    em: number;
    molfile: string;
    ocl: {
      value: string;
      coordinates: string;
      index: number[];
    };
  };
  identifier: {
    cas: Array<{ value: string }>;
  };
  spectra: {
    nmr: SampleEntrySpectraNmr[];
  };
}

export interface SampleEntrySpectraNmr {
  dimension: number;
  nucleus: string[];
  isFid: boolean;
  isFt: boolean;
  title: string;
  solvent: string;
  pulse: string;
  experiment: string;
  temperature: number;
  frequency: number;
  type: string;
  date: string;
  range: unknown[];
  jcamp: {
    filename: string;
  };
  nmrium: any;
}
