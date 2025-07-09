import { Button, SegmentedControl, Slider } from "@mantine/core";
import { invoke } from "@tauri-apps/api/core";
import { info } from "@tauri-apps/plugin-log";
import { useState } from "react";
import type { TetrahedralizationResult } from "../../src-tauri/bindings/TetrahedralizationResult";
// BINDINGS
import type { TriangulationRequest } from "../../src-tauri/bindings/TriangulationRequest";
import type { TriangulationResult } from "../../src-tauri/bindings/TriangulationResult";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import "./Sidebar.css";
import type { Dimension } from "../../src-tauri/bindings/Dimension";
import type { Triangle3 } from "../../src-tauri/bindings/Triangle3";
import type { Vertex3 } from "../../src-tauri/bindings/Vertex3";
import {
	clearLiftedTriangles,
	setLiftedTriangles,
} from "../store/features/liftedTriangles/liftedTrianglesSlice";
import {
	clearLiftedVertices,
	setLiftedVertices,
} from "../store/features/liftedVertices/liftedVerticesSlice";
import {
	setDimension,
	setTetrahedra,
	setTriangles,
	setVertices,
} from "../store/features/vertexSettings/vertexSettingsSlice";
import { notifications } from "@mantine/notifications";

export default function Sidebar() {
	const dispatch = useAppDispatch();
	const dimension = useAppSelector((state) => state.vertexSettings.dimension);
	const vertices = useAppSelector((state) => state.vertexSettings.vertices);
	const triangles = useAppSelector((state) => state.vertexSettings.triangles);
	const [numVertices, setNumVertices] = useState(4);

	async function triangulate() {
		info(`Triangulating ${numVertices} vertices....`);

		const triangulationResult = await invoke<TriangulationResult>(
			"triangulate",
			{
				request: { vertices } as TriangulationRequest,
			},
		);

		dispatch(setTriangles(triangulationResult.triangles));
		dispatch(clearLiftedTriangles());

		notifications.show({
			title: "Triangulation Complete",
			message: `${triangulationResult.triangles.length} triangles created`,
			withBorder: true,
		});
	}

	async function tetrahedralize() {
		info(`Tetrahedralizing ${numVertices} vertices....`);

		const tetrahedralizationResult = await invoke<TetrahedralizationResult>(
			"tetrahedralize",
			{
				request: { vertices } as TriangulationRequest,
			},
		);

		dispatch(setTetrahedra(tetrahedralizationResult.tetrahedra));
		dispatch(clearLiftedTriangles());

		notifications.show({
			title: "Tetrahedralization Complete",
			message: `${tetrahedralizationResult.tetrahedra.length} tetrahedra created`,
			withBorder: true,
		});
	}

	const handleCreateVertices = () => {
		const vertices: Vertex3[] = new Array(numVertices).fill(0).map(() => ({
			x: (Math.random() - 0.5) * 5,
			y: dimension === "TWO" ? 0 : (Math.random() - 0.5) * 5,
			z: (Math.random() - 0.5) * 5,
		}));
		dispatch(setVertices(vertices));
		dispatch(setTriangles([]));
		dispatch(setTetrahedra([]));
		dispatch(clearLiftedVertices());
		dispatch(clearLiftedTriangles());
	};

	const handleLift = () => {
		if (dimension === "TWO" && vertices.length > 0) {
			const liftedVertices: Vertex3[] = vertices.map((vertex) => ({
				x: vertex.x,
				y: vertex.x * vertex.x + vertex.z * vertex.z,
				z: vertex.z,
			}));
			dispatch(setLiftedVertices(liftedVertices));
		}
	};

	const handleLiftTriangles = () => {
		if (dimension === "TWO" && triangles.length > 0) {
			const liftedTriangles: Triangle3[] = triangles.map((triangle) => ({
				id: `lifted-${triangle.id}`,
				a: {
					x: triangle.a.x,
					y: triangle.a.x * triangle.a.x + triangle.a.z * triangle.a.z,
					z: triangle.a.z,
				},
				b: {
					x: triangle.b.x,
					y: triangle.b.x * triangle.b.x + triangle.b.z * triangle.b.z,
					z: triangle.b.z,
				},
				c: {
					x: triangle.c.x,
					y: triangle.c.x * triangle.c.x + triangle.c.z * triangle.c.z,
					z: triangle.c.z,
				},
			}));
			dispatch(setLiftedTriangles(liftedTriangles));
		}
	};

	function handleDimensionChange(value: string) {
		const newMode = value as Dimension;
		if (newMode === "TWO") {
			dispatch(setDimension("TWO"));
		} else if (newMode === "THREE") {
			dispatch(setDimension("THREE"));
			dispatch(clearLiftedVertices());
			dispatch(clearLiftedTriangles());
		}
	}

	const handleTriangulate = () => {
		if (dimension === "TWO") {
			triangulate();
		} else if (dimension === "THREE") {
			tetrahedralize();
		}
	};

	const minNumVertices = dimension === "TWO" ? 3 : 4;
	const maxNumVertices = 100;
	return (
		<div className="sidebar">
			<div className="sidebar-section">
				<SegmentedControl
					value={dimension}
					onChange={(value) => {
						handleDimensionChange(value);
					}}
					data={[
						{ label: "2D", value: "TWO" },
						{ label: "3D", value: "THREE" },
					]}
				/>
			</div>
			<div className="sidebar-section">
				<h3>Create Vertices</h3>
				<div className="slider-container">
					<Slider
						color="blue"
						defaultValue={numVertices}
						onChange={(value) => setNumVertices(value)}
						min={minNumVertices}
						max={maxNumVertices}
						marks={[
							{ value: 20, label: "20" },
							{ value: 50, label: "50" },
							{ value: 80, label: "80" },
						]}
					/>
					<div className="slider-value">{numVertices} vertices</div>
				</div>
				<Button onClick={handleCreateVertices}>Create Vertices</Button>
			</div>
			{dimension === "TWO" && (
				<div className="sidebar-section">
					<h3>Lift Vertices</h3>
					<Button onClick={handleLift} disabled={vertices.length === 0}>
						Lift
					</Button>
				</div>
			)}
			<div className="sidebar-section">
				<h3>Triangulation</h3>
				<Button onClick={handleTriangulate} disabled={vertices.length < 3}>
					Triangulate
				</Button>
			</div>
			{dimension === "TWO" && (
				<div className="sidebar-section">
					<h3>Lift Triangles</h3>
					<Button
						onClick={handleLiftTriangles}
						disabled={triangles.length === 0}
					>
						Lift Triangles
					</Button>
				</div>
			)}
		</div>
	);
}
