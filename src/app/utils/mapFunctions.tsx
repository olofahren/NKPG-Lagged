/**
 * Types for coordinate data
 */
type Coordinate = [number, number];

interface Area {
    name: string;
    coordinates: Coordinate[];
}

/**
 * Checks if a coordinate is inside a polygon defined by an array of coordinates
 * @param point - The coordinate [latitude, longitude] to check
 * @param polygon - Array of coordinates defining the polygon
 * @returns boolean indicating if the point is inside the polygon
 */
function isPointInPolygon(point: Coordinate, polygon: Coordinate[]): boolean {
    // Implementation of the ray casting algorithm
    // A point is in a polygon if a line drawn from the point to infinity
    // crosses an odd number of polygon edges

    const [lat, lng] = point;
    let inside = false;

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const [iLat, iLng] = polygon[i];
        const [jLat, jLng] = polygon[j];

        // Check if the point is on a polygon vertex
        if ((iLat === lat && iLng === lng) || (jLat === lat && jLng === lng)) {
            return true;
        }

        // Check if the point is on a polygon edge
        const onSegment =
            (iLng === jLng && iLng === lng && lat > Math.min(iLat, jLat) && lat < Math.max(iLat, jLat)) ||
            (iLat === jLat && iLat === lat && lng > Math.min(iLng, jLng) && lng < Math.max(iLng, jLng));

        if (onSegment) {
            return true;
        }

        // Check if the ray intersects with the polygon edge
        const intersect = ((iLat > lat) !== (jLat > lat)) &&
            (lng < (jLng - iLng) * (lat - iLat) / (jLat - iLat) + iLng);

        if (intersect) {
            inside = !inside;
        }
    }

    return inside;
}

/**
 * Checks if a point is inside any of the defined areas
 * @param point - The coordinate [latitude, longitude] to check
 * @param areas - Array of areas with their coordinates
 * @returns Object with area name and boolean indicating if the point is inside
 */
export function checkCoordinateInAreas(
    point: [number, number],
    areas: Area[]
): { isInside: boolean; areaName?: string } {
    for (const area of areas) {
        if (isPointInPolygon(point, area.coordinates)) {
            return { isInside: true, areaName: area.name };
        }
    }

    return { isInside: false };
}
