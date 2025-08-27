/**
 * Re-export clustering-related types for easier importing throughout the frontend
 */

import type { Cluster2 } from "../../src-tauri/bindings/Cluster2";
import type { ClusterBounds2 } from "../../src-tauri/bindings/ClusterBounds2";
import type { ClusteringRequest } from "../../src-tauri/bindings/ClusteringRequest";
import type { ClusteringResult2 } from "../../src-tauri/bindings/ClusteringResult2";
// Import types from Tauri bindings
import type { ClusterRectangle } from "../../src-tauri/bindings/ClusterRectangle";
import type { SimplificationRequest2 } from "../../src-tauri/bindings/SimplificationRequest2";
import type { SimplificationResult } from "../../src-tauri/bindings/SimplificationResult";

// Re-export types
export type {
	ClusterRectangle,
	ClusterBounds2,
	Cluster2,
	ClusteringRequest,
	ClusteringResult2,
	SimplificationRequest2,
	SimplificationResult,
};

// Re-export enum from clustering slice
export { TriangulationMethod } from "../store/features/clustering/clusteringSlice";

/**
 * Frontend-specific types for cluster visualization
 */

export interface ClusterVisualizationOptions {
	showBorders: boolean;
	showLabels: boolean;
	borderWidth: number;
	opacity: number;
	highlightOnHover: boolean;
}

export interface ClusterStats {
	totalClusters: number;
	totalVertices: number;
	averageVerticesPerCluster: number;
	largestClusterSize: number;
	smallestClusterSize: number;
	totalArea: number;
	averageArea: number;
}

export interface ClusterRenderData {
	rectangle: ClusterRectangle;
	centerX: number;
	centerZ: number;
	width: number;
	height: number;
	isHighlighted: boolean;
	isSelected: boolean;
}
