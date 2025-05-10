import { LandingCoordinate } from "@/services/coordinatesService";

/**
 * Calculates the cross product of vectors OA and OB
 */
function cross(O: LandingCoordinate, A: LandingCoordinate, B: LandingCoordinate): number {
  return (A.longitude - O.longitude) * (B.latitude - O.latitude) - 
         (A.latitude - O.latitude) * (B.longitude - O.longitude);
}

/**
 * Calculates the convex hull of a set of points using the Graham scan algorithm
 */
export function calculateConvexHull(points: LandingCoordinate[]): LandingCoordinate[] {
  if (points.length <= 3) return points;

  // Clone the points array to avoid modifying the original
  const sortedPoints = [...points];
  
  // Sort points lexicographically
  sortedPoints.sort((a, b) => {
    return a.longitude === b.longitude 
      ? a.latitude - b.latitude 
      : a.longitude - b.longitude;
  });

  const lowerHull: LandingCoordinate[] = [];
  
  // Build lower hull
  for (const point of sortedPoints) {
    while (
      lowerHull.length >= 2 && 
      cross(lowerHull[lowerHull.length - 2], lowerHull[lowerHull.length - 1], point) <= 0
    ) {
      lowerHull.pop();
    }
    lowerHull.push(point);
  }
  
  const upperHull: LandingCoordinate[] = [];
  
  // Build upper hull
  for (let i = sortedPoints.length - 1; i >= 0; i--) {
    const point = sortedPoints[i];
    while (
      upperHull.length >= 2 && 
      cross(upperHull[upperHull.length - 2], upperHull[upperHull.length - 1], point) <= 0
    ) {
      upperHull.pop();
    }
    upperHull.push(point);
  }
  
  // Remove duplicates
  upperHull.pop();
  lowerHull.pop();
  
  return [...lowerHull, ...upperHull];
}

/**
 * Clusters points based on a simple distance threshold approach
 */
export function clusterCoordinates(
  coordinates: LandingCoordinate[], 
  distanceThreshold = 0.1
): LandingCoordinate[][] {
  if (coordinates.length === 0) return [];
  if (coordinates.length === 1) return [coordinates];

  const clusters: LandingCoordinate[][] = [];
  const visited = new Set<number>();

  for (let i = 0; i < coordinates.length; i++) {
    if (visited.has(i)) continue;
    
    const cluster: LandingCoordinate[] = [coordinates[i]];
    visited.add(i);
    
    for (let j = 0; j < coordinates.length; j++) {
      if (visited.has(j)) continue;
      
      const distance = Math.sqrt(
        Math.pow(coordinates[i].longitude - coordinates[j].longitude, 2) +
        Math.pow(coordinates[i].latitude - coordinates[j].latitude, 2)
      );
      
      if (distance <= distanceThreshold) {
        cluster.push(coordinates[j]);
        visited.add(j);
      }
    }
    
    clusters.push(cluster);
  }
  
  return clusters;
}

/**
 * Generate convex hulls for each cluster of coordinates
 */
export function generateClusteredConvexHulls(
  coordinates: LandingCoordinate[],
  distanceThreshold = 0.1
): LandingCoordinate[][] {
  const clusters = clusterCoordinates(coordinates, distanceThreshold);
  return clusters.map(cluster => calculateConvexHull(cluster));
}