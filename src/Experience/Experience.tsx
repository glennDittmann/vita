import { Grid, OrbitControls, Tetrahedron } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { AxesHelper } from "three";
import "./styles.css";
import { useControls } from "leva";
import { Perf } from "r3f-perf";
import type { Dimension } from "../../src-tauri/bindings/Dimension";
import type { Tetrahedron3 } from "../../src-tauri/bindings/Tetrahedron3";
import type { Triangle3 } from "../../src-tauri/bindings/Triangle3";
import Lights from "./Lights";
import Tet from "./Tet";
import Triangle from "./Triangle";

function Vertices() {
	const dimension = useSelector(
		(state: any) => state.vertexSettings.dimension,
	) as Dimension;
	const vertices = useSelector((state: any) => state.vertexSettings.vertices);

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
			<pointsMaterial size={0.1} color="#ffffff" />
		</points>
	);
}

export default function Experience() {
	const { showPerf } = useControls("perf", {
		showPerf: false,
	});

	const vertices = useSelector((state: any) => state.vertexSettings.vertices);
	const triangles = useSelector((state: any) => state.vertexSettings.triangles);
	const tetrahedra = useSelector(
		(state: any) => state.vertexSettings.tetrahedra,
	);
	const gridActive = useSelector(
		(state: any) => state.experienceSettings.gridActive,
	);
	const axisActive = useSelector(
		(state: any) => state.experienceSettings.axisActive,
	);

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
			{vertices.length > 0 && <Vertices />}
			{triangles.length > 0 &&
				triangles.map((triangle: Triangle3, index: number) => (
					<Triangle key={index} triangle={triangle} />
				))}
			{tetrahedra.length > 0 &&
				tetrahedra.map((tetrahedron: Tetrahedron3, index: number) => (
					<Tet key={index} tetrahedron={tetrahedron} />
				))}
		</Canvas>
	);
}
