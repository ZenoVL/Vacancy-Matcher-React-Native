export function calculatePolygonCenter(polygon: any) {
    const coordinates = polygon.coordinates[0]; // assume that the first set of coordinates is the exterior ring
    const minLng = Math.min(...coordinates.map((c: any) => c[0]));
    const maxLng = Math.max(...coordinates.map((c: any) => c[0]));
    const minLat = Math.min(...coordinates.map((c: any) => c[1]));
    const maxLat = Math.max(...coordinates.map((c: any) => c[1]));
    const centerLng = (minLng + maxLng) / 2;
    const centerLat = (minLat + maxLat) / 2;

    return {
        centerLng,
        centerLat
    }
}
