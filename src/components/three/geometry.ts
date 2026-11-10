import * as THREE from "three";

/** Distributes points evenly on a sphere (golden-angle spiral). */
export function fibonacciSphere(count: number, radius: number): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < count; i += 1) {
    const y = count === 1 ? 0 : 1 - (i / (count - 1)) * 2;
    const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = goldenAngle * i;
    points.push(
      new THREE.Vector3(
        Math.cos(theta) * radiusAtY * radius,
        y * radius,
        Math.sin(theta) * radiusAtY * radius,
      ),
    );
  }

  return points;
}

/**
 * Connects every point to its nearest neighbours, without duplicate pairs.
 * Keeps the constellation readable and the draw cost low.
 */
export function nearestNeighbourEdges(
  points: THREE.Vector3[],
  neighbours = 2,
): Array<[number, number]> {
  const edges = new Map<string, [number, number]>();

  points.forEach((point, index) => {
    const distances = points
      .map((other, otherIndex) => ({
        otherIndex,
        distance: point.distanceTo(other),
      }))
      .filter((entry) => entry.otherIndex !== index)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, neighbours);

    for (const { otherIndex } of distances) {
      const a = Math.min(index, otherIndex);
      const b = Math.max(index, otherIndex);
      edges.set(`${a}:${b}`, [a, b]);
    }
  });

  return Array.from(edges.values());
}

/** Flattens edge pairs into a Float32Array for a LineSegments geometry. */
export function edgePositions(
  points: THREE.Vector3[],
  edges: Array<[number, number]>,
): Float32Array {
  const positions = new Float32Array(edges.length * 6);

  edges.forEach(([a, b], index) => {
    const start = points[a];
    const end = points[b];
    positions.set([start.x, start.y, start.z], index * 6);
    positions.set([end.x, end.y, end.z], index * 6 + 3);
  });

  return positions;
}
