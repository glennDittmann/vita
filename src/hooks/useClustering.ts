import { useMemo } from "react";
import { useAppSelector } from "../store/hooks";
import {
    selectTriangulationMethod,
    selectClusters,
    selectClusterRectangles,
    selectSimplifiedVertices,
    selectIsClusteringComplete,
    selectIsSimplificationComplete,
    selectIsVertexClusteringMethod,
    selectClusterCount,
    selectClusterRectangleCount,
    selectTotalClusteredVertices,
    selectClusterRectangleColors,
    selectHasClusterRectangles,
    selectCanVisualizeClusters,
} from "../store/features/clustering/clusteringSlice";
import { getClusterArea, getClusterCenter, getClusterDimensions } from "../utils/clusterUtils";
import type { ClusterStats, ClusterRenderData } from "../types/clustering";

/**
 * Custom hook for accessing clustering state and computed values
 */
export function useClustering() {
    const method = useAppSelector(selectTriangulationMethod);
    const clusters = useAppSelector(selectClusters);
    const clusterRectangles = useAppSelector(selectClusterRectangles);
    const simplifiedVertices = useAppSelector(selectSimplifiedVertices);
    const isClusteringComplete = useAppSelector(selectIsClusteringComplete);
    const isSimplificationComplete = useAppSelector(selectIsSimplificationComplete);
    const isVertexClusteringMethod = useAppSelector(selectIsVertexClusteringMethod);
    const clusterCount = useAppSelector(selectClusterCount);
    const clusterRectangleCount = useAppSelector(selectClusterRectangleCount);
    const totalClusteredVertices = useAppSelector(selectTotalClusteredVertices);
    const clusterRectangleColors = useAppSelector(selectClusterRectangleColors);
    const hasClusterRectangles = useAppSelector(selectHasClusterRectangles);
    const canVisualizeClusters = useAppSelector(selectCanVisualizeClusters);

    // Compute cluster statistics
    const clusterStats: ClusterStats = useMemo(() => {
        if (clusters.length === 0) {
            return {
                totalClusters: 0,
                totalVertices: 0,
                averageVerticesPerCluster: 0,
                largestClusterSize: 0,
                smallestClusterSize: 0,
                totalArea: 0,
                averageArea: 0,
            };
        }

        const vertexCounts = clusters.map(cluster => cluster.vertices.length);
        const areas = clusterRectangles.map(rect => getClusterArea(rect.bounds));
        const totalArea = areas.reduce((sum, area) => sum + area, 0);

        return {
            totalClusters: clusters.length,
            totalVertices: totalClusteredVertices,
            averageVerticesPerCluster: totalClusteredVertices / clusters.length,
            largestClusterSize: Math.max(...vertexCounts),
            smallestClusterSize: Math.min(...vertexCounts),
            totalArea,
            averageArea: totalArea / areas.length,
        };
    }, [clusters, clusterRectangles, totalClusteredVertices]);

    // Compute render data for cluster rectangles
    const clusterRenderData: ClusterRenderData[] = useMemo(() => {
        return clusterRectangles.map(rectangle => {
            const [centerX, centerZ] = getClusterCenter(rectangle.bounds);
            const [width, height] = getClusterDimensions(rectangle.bounds);

            return {
                rectangle,
                centerX,
                centerZ,
                width,
                height,
                isHighlighted: false, // This would be managed by component state
                isSelected: false,    // This would be managed by component state
            };
        });
    }, [clusterRectangles]);

    return {
        // Basic state
        method,
        clusters,
        clusterRectangles,
        simplifiedVertices,

        // Status flags
        isClusteringComplete,
        isSimplificationComplete,
        isVertexClusteringMethod,
        hasClusterRectangles,
        canVisualizeClusters,

        // Counts and metrics
        clusterCount,
        clusterRectangleCount,
        totalClusteredVertices,
        clusterRectangleColors,

        // Computed data
        clusterStats,
        clusterRenderData,

        // Workflow status
        canCluster: isVertexClusteringMethod && !isClusteringComplete,
        canSimplify: isVertexClusteringMethod && isClusteringComplete && !isSimplificationComplete,
        canTriangulate: isVertexClusteringMethod && isSimplificationComplete,
    };
}

/**
 * Hook for accessing a specific cluster by ID
 */
export function useCluster(clusterId: string) {
    const clusters = useAppSelector(selectClusters);
    const clusterRectangles = useAppSelector(selectClusterRectangles);

    const cluster = useMemo(() =>
        clusters.find(c => c.id === clusterId),
        [clusters, clusterId]
    );

    const clusterRectangle = useMemo(() =>
        clusterRectangles.find(r => r.id === clusterId),
        [clusterRectangles, clusterId]
    );

    const renderData = useMemo(() => {
        if (!clusterRectangle) return null;

        const [centerX, centerZ] = getClusterCenter(clusterRectangle.bounds);
        const [width, height] = getClusterDimensions(clusterRectangle.bounds);

        return {
            rectangle: clusterRectangle,
            centerX,
            centerZ,
            width,
            height,
            isHighlighted: false,
            isSelected: false,
        };
    }, [clusterRectangle]);

    return {
        cluster,
        clusterRectangle,
        renderData,
        exists: !!cluster,
    };
}