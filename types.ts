
export interface LLDData {
  quarterSection: QuarterSection | '';
  section: number | null;
  township: number | null;
  range: number | null;
  meridian: Meridian | null;
}

export enum QuarterSection {
  NE = "NE",
  NW = "NW",
  SE = "SE",
  SW = "SW",
}

export enum Meridian {
  W4 = 4,
  W5 = 5,
  W6 = 6,
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface ConversionError {
  field: keyof LLDData | 'general';
  message: string;
}
    