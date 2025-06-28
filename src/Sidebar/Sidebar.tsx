import type SlRadioGroupElement from "@shoelace-style/shoelace/dist/components/radio-group/radio-group.js";
import type SlRangeElement from "@shoelace-style/shoelace/dist/components/range/range.js";
import SlButton from "@shoelace-style/shoelace/dist/react/button/index.js";
import SlRadioButton from "@shoelace-style/shoelace/dist/react/radio-button/index.js";
import SlRadioGroup from "@shoelace-style/shoelace/dist/react/radio-group/index.js";
import SlRange from "@shoelace-style/shoelace/dist/react/range/index.js";
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

interface SidebarProps {
	onTriangulationComplete: (numTriangles: number) => void;
}

export default function Sidebar({ onTriangulationComplete }: SidebarProps) {
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

		onTriangulationComplete(triangulationResult.triangles.length);
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

		onTriangulationComplete(tetrahedralizationResult.tetrahedra.length);
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

	function handleDimensionChange(e: Event) {
		const newMode = (e.currentTarget as SlRadioGroupElement).value as Dimension;
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
				<SlRadioGroup
					size="small"
					label="Dimension"
					name="dimension"
					value={dimension}
					onSlChange={handleDimensionChange}
				>
					<SlRadioButton value="TWO">2D</SlRadioButton>
					<SlRadioButton value="THREE">3D</SlRadioButton>
				</SlRadioGroup>
			</div>
			<div className="sidebar-section">
				<h3>Create Vertices</h3>
				<div className="slider-container">
					<SlRange
						min={minNumVertices}
						max={maxNumVertices}
						value={numVertices}
						onSlChange={(e) =>
							setNumVertices((e.currentTarget as SlRangeElement).value)
						}
					/>
					<div className="slider-value">{numVertices} vertices</div>
				</div>
				<SlButton variant="primary" onClick={handleCreateVertices}>
					Create Vertices
				</SlButton>
			</div>
			{dimension === "TWO" && (
				<div className="sidebar-section">
					<h3>Lift Vertices</h3>
					<SlButton
						variant="primary"
						onClick={handleLift}
						disabled={vertices.length === 0}
					>
						Lift
					</SlButton>
				</div>
			)}
			<div className="sidebar-section">
				<h3>Triangulation</h3>
				<SlButton
					variant="primary"
					onClick={handleTriangulate}
					disabled={vertices.length < 3}
				>
					Triangulate
				</SlButton>
			</div>
			{dimension === "TWO" && (
				<div className="sidebar-section">
					<h3>Lift Triangles</h3>
					<SlButton
						variant="primary"
						onClick={handleLiftTriangles}
						disabled={triangles.length === 0}
					>
						Lift Triangles
					</SlButton>
				</div>
			)}
		</div>
	);
}
