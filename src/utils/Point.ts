import { randBetween } from "./Random";

// Point-in-polygon check using ray casting algorithm
export function isPointInPolygon(
  point: [number, number],
  polygon: [number, number][]
): boolean {
  const [x, y] = point;
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];

    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }

  return inside;
}

// Generate random point within polygon bounds
export function generateRandomPointInPolygon(
  polygon: [number, number][],
  min: [number, number],
  max: [number, number]
): [number, number] | null {
  // Try to find a point inside polygon (max 100 attempts)
  for (let attempt = 0; attempt < 100; attempt++) {
    const lat = randBetween(min[0], max[0]);
    const lng = randBetween(min[1], max[1]);

    if (isPointInPolygon([lat, lng], polygon)) {
      return [lat, lng];
    }
  }

  return null;
}
