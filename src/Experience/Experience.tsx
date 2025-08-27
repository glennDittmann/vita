import { Grid, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useMemo } from "react";
import { AxesHelper } from "three";
import { useAppSelector } from "../store/hooks";
import "./styles.css";
import { useControls } from "leva";
import { Perf } from "r3f-perf";
import type { Tetrahedron3 } from "../../src-tauri/bindings/Tetrahedron3";
import type { Triangle3 } from "../../src-tauri/bindings/Triangle3";
import type { Vertex3 } from "../../src-tauri/bindings/Vertex3";
import { selectSimplifiedVertices } from "../store/features/clustering/clusteringSlice";
import { selectShowVertices } from "../store/features/experienceSettings/experienceSettingsSlice";
import ClusterRectangles from "./ClusterRectangles";
import LiftedTriangle from "./LiftedTriangle";
import Lights from "./Lights";
import Tet from "./Tet";
import Triangle from "./Triangle";

function Vertices({
	vertices,
	color = "#ffffff",
}: {
	vertices: Vertex3[];
	color?: string;
}) {
	const points = useMemo(() => {
		const points = new Float32Array(vertices.length * 3);
		for (let i = 0; i < vertices.length; i++) {
			const i3 = i * 3;
			points[i3] = vertices[i].x;
			points[i3 + 1] = vertices[i].y;
			points[i3 + 2] = vertices[i].z;
		}
		return points;
	}, [vertices]);

	return (
		<points>
			<bufferGeometry>
				<bufferAttribute
					attach="attributes-position"
					count={vertices.length}
					array={points}
					itemSize={3}
					args={[points, 3]}
				/>
			</bufferGeometry>
			<pointsMaterial size={0.1} color={color} />
		</points>
	);
}

function LiftedVertices() {
	const liftedVertices = useAppSelector(
		(state) => state.liftedVertices.liftedVertices,
	);

	const points = useMemo(() => {
		const points = new Float32Array(liftedVertices.length * 3);
		for (let i = 0; i < liftedVertices.length; i++) {
			const i3 = i * 3;
			points[i3] = liftedVertices[i].x;
			points[i3 + 1] = liftedVertices[i].y;
			points[i3 + 2] = liftedVertices[i].z;
		}
		return points;
	}, [liftedVertices]);

	return (
		<points>
			<bufferGeometry>
				<bufferAttribute
					attach="attributes-position"
					count={liftedVertices.length}
					array={points}
					itemSize={3}
					args={[points, 3]}
				/>
			</bufferGeometry>
			<pointsMaterial size={0.15} color="#ff6b6b" />
		</points>
	);
}

export default function Experience() {
	const { showPerf } = useControls("perf", {
		showPerf: false,
	});

	const vertices = useAppSelector((state) => state.vertexSettings.vertices);
	const simplifiedVertices = useAppSelector(selectSimplifiedVertices);
	const triangles = useAppSelector((state) => state.vertexSettings.triangles);
	const tetrahedra = useAppSelector((state) => state.vertexSettings.tetrahedra);
	const liftedVertices = useAppSelector(
		(state) => state.liftedVertices.liftedVertices,
	);
	const liftedTriangles = useAppSelector(
		(state) => state.liftedTriangles.liftedTriangles,
	);
	const gridActive = useAppSelector(
		(state) => state.experienceSettings.gridActive,
	);
	const axisActive = useAppSelector(
		(state) => state.experienceSettings.axisActive,
	);
	const showVertices = useAppSelector(selectShowVertices);

	const vertexColor = simplifiedVertices.length > 0 ? "#808080" : "#ffffff";

	return (
		<Canvas
			className="container"
			camera={{
				position: [5, 5, 5],
				fov: 75,
				near: 0.1,
				far: 1000,
			}}
		>
			{showPerf && <Perf position="top-left" />}
			<Lights />
			<OrbitControls />
			{gridActive && <Grid infiniteGrid position={[0, -0.001, 0]} />}
			{axisActive && <primitive object={new AxesHelper(5)} />}
			{vertices.length > 0 && showVertices && (
				<Vertices vertices={vertices} color={vertexColor} />
			)}
			{simplifiedVertices.length > 0 && (
				<Vertices vertices={simplifiedVertices} color="#00ff00" />
			)}
			{liftedVertices.length > 0 && <LiftedVertices />}
			{triangles.length > 0 &&
				triangles.map((triangle: Triangle3) => (
					<Triangle key={triangle.id} triangle={triangle} />
				))}
			{liftedTriangles.length > 0 &&
				liftedTriangles.map((triangle: Triangle3) => (
					<LiftedTriangle key={triangle.id} triangle={triangle} />
				))}
			{tetrahedra.length > 0 &&
				tetrahedra.map((tetrahedron: Tetrahedron3) => (
					<Tet key={tetrahedron.id} tetrahedron={tetrahedron} />
				))}
			<ClusterRectangles />
		</Canvas>
	);
}
