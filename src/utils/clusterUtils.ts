import type { ClusterRectangle } from "../../src-tauri/bindings/ClusterRectangle";
import type { ClusterBounds2 } from "../../src-tauri/bindings/ClusterBounds2";

/**
 * Calculate the center point of a cluster rectangle
 * @param bounds - The cluster bounds
 * @returns The center point as [x, z] coordinates
 */
export function getClusterCenter(bounds: ClusterBounds2): [number, number] {
	const centerX = (bounds.min_x + bounds.max_x) / 2;
	const centerZ = (bounds.min_z + bounds.max_z) / 2;
	return [centerX, centerZ];
}

/**
 * Calculate the dimensions of a cluster rectangle
 * @param bounds - The cluster bounds
 * @returns The width and height as [width, height]
 */
export function getClusterDimensions(bounds: ClusterBounds2): [number, number] {
	const width = bounds.max_x - bounds.min_x;
	const height = bounds.max_z - bounds.min_z;
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
	byVertexCount: (a: ClusterRectangle, b: ClusterRectangle) =>
		b.vertex_count - a.vertex_count,

	/**
	 * Sort clusters by area (descending)
	 */
	byArea: (a: ClusterRectangle, b: ClusterRectangle) =>
		getClusterArea(b.bounds) - getClusterArea(a.bounds),

	/**
	 * Sort clusters by ID (alphabetical)
	 */
	byId: (a: ClusterRectangle, b: ClusterRectangle) => a.id.localeCompare(b.id),
};

/**
 * Filter cluster rectangles by various criteria
 */
export const clusterFilters = {
	/**
	 * Filter clusters by minimum vertex count
	 */
	byMinVertexCount: (minCount: number) => (cluster: ClusterRectangle) =>
		cluster.vertex_count >= minCount,

	/**
	 * Filter clusters by minimum area
	 */
	byMinArea: (minArea: number) => (cluster: ClusterRectangle) =>
		getClusterArea(cluster.bounds) >= minArea,

	/**
	 * Filter clusters that contain a specific point
	 */
	containingPoint: (x: number, z: number) => (cluster: ClusterRectangle) => {
		const { bounds } = cluster;
		return (
			x >= bounds.min_x &&
			x <= bounds.max_x &&
			z >= bounds.min_z &&
			z <= bounds.max_z
		);
	},
};
