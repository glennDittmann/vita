import type { Cluster2 } from "../../src-tauri/bindings/Cluster2";
import type { ClusterBounds2 } from "../../src-tauri/bindings/ClusterBounds2";

/**
 * Calculate the center point of a cluster rectangle
 * @param bounds - The cluster bounds
 * @returns The center point as [x, z] coordinates
 */
export function getClusterCenter(bounds: ClusterBounds2): [number, number] {
	const centerX = (bounds.bottom_left.x + bounds.top_right.x) / 2;
	const centerZ = (bounds.bottom_left.z + bounds.top_right.z) / 2;
	return [centerX, centerZ];
}

/**
 * Calculate the dimensions of a cluster rectangle
 * @param bounds - The cluster bounds
 * @returns The width and height as [width, height]
 */
export function getClusterDimensions(bounds: ClusterBounds2): [number, number] {
	const width = bounds.top_right.x - bounds.bottom_left.x;
	const height = bounds.top_right.z - bounds.bottom_left.z;
	return [width, height];
}

/**
 * Get the area of a cluster rectangle
 * @param bounds - The cluster bounds
 * @returns The area of the cluster rectangle
 */
export function getClusterArea(bounds: ClusterBounds2): number {
	const [width, height] = getClusterDimensions(bounds);
	return width * height;
}

/**
 * Sort cluster rectangles by various criteria
 */
export const clusterSorters = {
	/**
	 * Sort clusters by vertex count (descending)
	 */
	byVertexCount: (a: Cluster2, b: Cluster2) =>
		b.vertices.length - a.vertices.length,

	/**
	 * Sort clusters by area (descending)
	 */
	byArea: (a: Cluster2, b: Cluster2) =>
		getClusterArea(b.bounds) - getClusterArea(a.bounds),

	/**
	 * Sort clusters by ID (alphabetical)
	 */
	byId: (a: Cluster2, b: Cluster2) => a.id.localeCompare(b.id),
};

/**
 * Filter cluster rectangles by various criteria
 */
export const clusterFilters = {
	/**
	 * Filter clusters by minimum vertex count
	 */
	byMinVertexCount: (minCount: number) => (cluster: Cluster2) =>
		cluster.vertices.length >= minCount,

	/**
	 * Filter clusters by minimum area
	 */
	byMinArea: (minArea: number) => (cluster: Cluster2) =>
		getClusterArea(cluster.bounds) >= minArea,

	/**
	 * Filter clusters that contain a specific point
	 */
	containingPoint: (x: number, z: number) => (cluster: Cluster2) => {
		const { bounds } = cluster;
		return (
			x >= bounds.bottom_left.x &&
			x <= bounds.top_right.x &&
			z >= bounds.bottom_left.z &&
			z <= bounds.top_right.z
		);
	},
};
