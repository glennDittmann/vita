import { useMemo, useState } from "react";
import { BufferGeometry, Float32BufferAttribute, LineBasicMaterial } from "three";
import { useAppSelector } from "../store/hooks";
import { selectClusterRectangles, selectIsVertexClusteringMethod } from "../store/features/clustering/clusteringSlice";
import { generateClusterColor, getClusterCenter, getClusterDimensions } from "../utils/clusterUtils";
import type { ClusterRectangle } from "../types/clustering";

interface ClusterRectangleProps {
    rectangle: ClusterRectangle;
}

function SingleClusterRectangle({ rectangle }: ClusterRectangleProps) {
    const [isHovered, setIsHovered] = useState(false);

    const geometry = useMemo(() => {
        const { bounds } = rectangle;
        const { min_x, max_x, min_z, max_z } = bounds;

        // Create rectangle vertices for a wireframe border
        // Rectangle at Y=0 (2D plane) with slight elevation to avoid z-fighting
        const y = 0.001;
        const vertices = new Float32Array([
            // Bottom edge
            min_x, y, min_z,
            max_x, y, min_z,
            // Right edge
            max_x, y, min_z,
            max_x, y, max_z,
            // Top edge
            max_x, y, max_z,
            min_x, y, max_z,
            // Left edge
            min_x, y, max_z,
            min_x, y, min_z,
        ]);

        const geometry = new BufferGeometry();
        geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));

        return geometry;
    }, [rectangle.bounds]);

    const material = useMemo(() => {
        // Use the color from the rectangle, or generate one as fallback
        const color = rectangle.color || generateClusterColor(rectangle.id);

        return new LineBasicMaterial({
            color: color,
            linewidth: isHovered ? 3 : 2,
            transparent: true,
            opacity: isHovered ? 1.0 : 0.8,
            depthTest: true,
            depthWrite: false
        });
    }, [rectangle.color, rectangle.id, isHovered]);

    // Calculate cluster info for potential tooltip/debugging
    const [centerX, centerZ] = getClusterCenter(rectangle.bounds);
    const [width, height] = getClusterDimensions(rectangle.bounds);

    return (
        <lineSegments
            geometry={geometry}
            material={material}
            onPointerEnter={() => setIsHovered(true)}
            onPointerLeave={() => setIsHovered(false)}
            userData={{
                clusterId: rectangle.id,
                vertexCount: rectangle.vertex_count,
                center: [centerX, centerZ],
                dimensions: [width, height]
            }}
        />
    );
}

export default function ClusterRectangles() {
    const clusterRectangles = useAppSelector(selectClusterRectangles);
    const isVertexClusteringMethod = useAppSelector(selectIsVertexClusteringMethod);

    // Only render cluster rectangles when using vertex clustering method
    if (!isVertexClusteringMethod || clusterRectangles.length === 0) {
        return null;
    }

    return (
        <group name="cluster-rectangles">
            {clusterRectangles.map((rectangle) => (
                <SingleClusterRectangle
                    key={rectangle.id}
                    rectangle={rectangle}
                />
            ))}
        </group>
    );
}