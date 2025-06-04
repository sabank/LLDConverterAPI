
// Degrees of latitude per statute mile is relatively constant
export const DEG_LAT_PER_MILE = 1 / 69.054; // approx 0.014481 degrees per mile

// Base latitude for Township 1 (Southern Alberta boundary with Montana)
export const BASE_LATITUDE = 49.0; // degrees North

// Miles per side of a standard Township or Range
export const MILES_PER_TOWNSHIP_SIDE = 6.0;

// Miles per side of a standard Section
export const MILES_PER_SECTION_SIDE = 1.0;

// Degrees of longitude at the equator per statute mile
export const DEG_LON_PER_MILE_AT_EQUATOR = 1 / 69.172; // approx 0.014457 degrees per mile

// Meridian base longitudes (negative for West)
export const MERIDIAN_LONGITUDES: { [key: number]: number } = {
  4: -110.0, // 4th Meridian
  5: -114.0, // 5th Meridian
  6: -118.0, // 6th Meridian
};

// Standard Dominion Land Survey (DLS) section numbering within a township.
// Grid is [row][col] from NW corner (0,0) to SE corner (5,5).
// Row 0 is the northernmost row of sections, Row 5 is the southernmost.
// Col 0 is the westernmost column of sections, Col 5 is the easternmost.
export const SECTION_GRID: number[][] = [
  [31, 32, 33, 34, 35, 36], // Row 0 (North)
  [30, 29, 28, 27, 26, 25], // Row 1
  [19, 20, 21, 22, 23, 24], // Row 2
  [18, 17, 16, 15, 14, 13], // Row 3
  [ 7,  8,  9, 10, 11, 12], // Row 4
  [ 6,  5,  4,  3,  2,  1 ]  // Row 5 (South)
];

export const ALBERTA_LAT_MIN = 49.0;
export const ALBERTA_LAT_MAX = 60.0;
export const ALBERTA_LON_MIN = -120.0;
export const ALBERTA_LON_MAX = -110.0;
    