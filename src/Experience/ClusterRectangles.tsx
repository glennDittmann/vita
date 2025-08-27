import { useMemo } from "react";
import {
	BufferGeometry,
	Color,
	Float32BufferAttribute,
	LineBasicMaterial,
} from "three";
import {
	selectClusters,
	selectIsVertexClusteringMethod,
} from "../store/features/clustering/clusteringSlice";
import { useAppSelector } from "../store/hooks";
import type { Cluster2 } from "../types/clustering";

const Y_EPS = 0.001;

interface ClusterRectangleProps {
	cluster: Cluster2;
}

function SingleClusterRectangle({ cluster }: ClusterRectangleProps) {
	const geometry = useMemo(() => {
		const { bounds } = cluster;
		const { bottom_left, bottom_right, top_right, top_left } = bounds;

		// Create rectangle vertices for a wireframe border
		// Rectangle at Y=0 (2D plane) with slight elevation to avoid z-fighting
		const vertices = new Float32Array([
			// Bottom left -> bottom right
			bottom_left.x,
			Y_EPS,
			bottom_left.z,
			bottom_right.x,
			Y_EPS,
			bottom_right.z,
			// bottom right -> top right
			bottom_right.x,
			Y_EPS,
			bottom_right.z,
			top_right.x,
			Y_EPS,
			top_right.z,
			// top right -> top left
			top_right.x,
			Y_EPS,
			top_right.z,
			top_left.x,
			Y_EPS,
			top_left.z,
			// top left -> bottom left
			top_left.x,
			Y_EPS,
			top_left.z,
			bottom_left.x,
			Y_EPS,
			bottom_left.z,
		]);

		const geometry = new BufferGeometry();
		geometry.setAttribute("position", new Float32BufferAttribute(vertices, 3));

		return geometry;
	}, [cluster]);

	const material = useMemo(() => {
		return new LineBasicMaterial({
			color: new Color("green"),
			linewidth: 2,
			transparent: true,
			opacity: 0.8,
			depthTest: true,
			depthWrite: false,
		});
	}, []);

	return <lineSegments geometry={geometry} material={material} />;
}

export default function ClusterRectangles() {
	const clusters = useAppSelector(selectClusters);
	const isVertexClusteringMethod = useAppSelector(
		selectIsVertexClusteringMethod,
	);

	if (!isVertexClusteringMethod) {
		return null;
	}

	return (
		<group name="cluster-rectangles">
			{clusters.map((cluster) => (
				<SingleClusterRectangle key={cluster.id} cluster={cluster} />
			))}
		</group>
	);
}
