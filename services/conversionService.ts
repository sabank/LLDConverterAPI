
import { LLDData, Coordinates, QuarterSection, Meridian } from '../types';
import { 
  DEG_LAT_PER_MILE, 
  BASE_LATITUDE, 
  MILES_PER_TOWNSHIP_SIDE, 
  MILES_PER_SECTION_SIDE, 
  DEG_LON_PER_MILE_AT_EQUATOR, 
  MERIDIAN_LONGITUDES,
  SECTION_GRID,
  ALBERTA_LAT_MIN,
  ALBERTA_LAT_MAX,
  ALBERTA_LON_MIN,
  ALBERTA_LON_MAX
} from '../constants';

interface SectionGridPosition {
  rowIndex: number; // 0-5, 0 is Northmost row
  colIndex: number; // 0-5, 0 is Westmost col
}

function findSectionInGrid(section: number): SectionGridPosition | null {
  for (let r = 0; r < SECTION_GRID.length; r++) {
    for (let c = 0; c < SECTION_GRID[r].length; c++) {
      if (SECTION_GRID[r][c] === section) {
        return { rowIndex: r, colIndex: c };
      }
    }
  }
  return null;
}

/**
 * Converts an Alberta Legal Land Description (LLD) to approximate geographic coordinates (centroid).
 * This function forms the core logic that could be adapted for a backend API.
 * 
 * @param lld - The LLD data object.
 * @returns The calculated coordinates or throws an error if input is invalid.
 */
export function convertLLDToCoordinates(lld: LLDData): Coordinates {
  if (!lld.meridian || !lld.range || !lld.township || !lld.section || !lld.quarterSection) {
    throw new Error("All LLD components must be provided.");
  }

  const baseLongitude = MERIDIAN_LONGITUDES[lld.meridian];
  if (baseLongitude === undefined) {
    throw new Error(`Invalid Meridian: ${lld.meridian}. Must be 4, 5, or 6.`);
  }

  if (lld.township < 1 || lld.township > 126) {
    throw new Error(`Invalid Township: ${lld.township}. Must be between 1 and 126.`);
  }
  // Range validation can be complex as it depends on the meridian and proximity to SK border or mountains.
  // For simplicity, we'll use a general range. Max range is around 30-34.
  if (lld.range < 1 || lld.range > 34) { 
    throw new Error(`Invalid Range: ${lld.range}. Must be a positive number (typically 1-34).`);
  }
   if (lld.section < 1 || lld.section > 36) {
    throw new Error(`Invalid Section: ${lld.section}. Must be between 1 and 36.`);
  }


  // 1. Calculate Township Centroid
  // Latitude: Townships are numbered northwards from BASE_LATITUDE (49°N)
  // Each township is 6 miles tall.
  const townshipCenterOffsetY_miles = ((lld.township - 1) * MILES_PER_TOWNSHIP_SIDE) + (MILES_PER_TOWNSHIP_SIDE / 2);
  const townshipCenterLat = BASE_LATITUDE + (townshipCenterOffsetY_miles * DEG_LAT_PER_MILE);

  // Longitude: Ranges are numbered westwards from the Meridian.
  // Each range is 6 miles wide.
  // We need to calculate degrees of longitude per mile at the township's latitude.
  const cosLatRad = Math.cos(townshipCenterLat * Math.PI / 180);
  if (cosLatRad === 0) throw new Error("Cannot calculate longitude at the pole."); // Should not happen for Alberta
  const degLonPerMile = DEG_LON_PER_MILE_AT_EQUATOR / cosLatRad;

  const townshipCenterOffsetX_miles = ((lld.range - 1) * MILES_PER_TOWNSHIP_SIDE) + (MILES_PER_TOWNSHIP_SIDE / 2);
  const townshipCenterLon = baseLongitude - (townshipCenterOffsetX_miles * degLonPerMile); // Subtract as ranges go west


  // 2. Calculate Section Centroid relative to Township Centroid
  const sectionPos = findSectionInGrid(lld.section);
  if (!sectionPos) {
    // This should be caught by earlier validation, but as a safeguard:
    throw new Error(`Section ${lld.section} not found in grid. Should be 1-36.`);
  }

  // sectionPos.colIndex: 0 (West) to 5 (East) within township
  // sectionPos.rowIndex: 0 (North) to 5 (South) within township
  
  // Calculate X offset of section center from township's SW corner.
  // Township SW corner is (0,0) in its local mile-based coordinate system.
  // Township center is at (3 miles, 3 miles) from its SW corner.
  const sectionCenterX_from_TownshipSW_miles = (sectionPos.colIndex + 0.5) * MILES_PER_SECTION_SIDE;
  // Calculate Y offset of section center from township's SW corner.
  const sectionCenterY_from_TownshipSW_miles = ((5 - sectionPos.rowIndex) + 0.5) * MILES_PER_SECTION_SIDE;

  const offsetX_from_TownshipCenter_miles = sectionCenterX_from_TownshipSW_miles - (MILES_PER_TOWNSHIP_SIDE / 2);
  const offsetY_from_TownshipCenter_miles = sectionCenterY_from_TownshipSW_miles - (MILES_PER_TOWNSHIP_SIDE / 2);
  
  const sectionCenterLat = townshipCenterLat + (offsetY_from_TownshipCenter_miles * DEG_LAT_PER_MILE);
  const sectionCenterLon = townshipCenterLon + (offsetX_from_TownshipCenter_miles * degLonPerMile);


  // 3. Calculate Quarter Section Centroid relative to Section Centroid
  let qsOffsetX_miles = 0;
  let qsOffsetY_miles = 0;
  const qsOffsetValue = MILES_PER_SECTION_SIDE / 4; // 0.25 miles

  switch (lld.quarterSection) {
    case QuarterSection.NE:
      qsOffsetX_miles = qsOffsetValue;
      qsOffsetY_miles = qsOffsetValue;
      break;
    case QuarterSection.NW:
      qsOffsetX_miles = -qsOffsetValue;
      qsOffsetY_miles = qsOffsetValue;
      break;
    case QuarterSection.SE:
      qsOffsetX_miles = qsOffsetValue;
      qsOffsetY_miles = -qsOffsetValue;
      break;
    case QuarterSection.SW:
      qsOffsetX_miles = -qsOffsetValue;
      qsOffsetY_miles = -qsOffsetValue;
      break;
    default:
      throw new Error(`Invalid Quarter Section: ${lld.quarterSection}`);
  }

  const finalLat = sectionCenterLat + (qsOffsetY_miles * DEG_LAT_PER_MILE);
  const finalLon = sectionCenterLon + (qsOffsetX_miles * degLonPerMile);
  
  // Sanity check for Alberta bounds
  if (finalLat < ALBERTA_LAT_MIN || finalLat > ALBERTA_LAT_MAX || finalLon < ALBERTA_LON_MIN || finalLon > ALBERTA_LON_MAX) {
      console.warn(`Calculated coordinates (${finalLat}, ${finalLon}) are outside typical Alberta bounds. LLD: ${JSON.stringify(lld)}`);
      // Depending on strictness, could throw error here or let it pass with warning.
      // For now, let it pass, but user should be aware.
  }

  return {
    latitude: parseFloat(finalLat.toFixed(5)), // Standard 5 decimal places for good precision
    longitude: parseFloat(finalLon.toFixed(5)),
  };
}
    