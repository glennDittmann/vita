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
import type { Vertex3 } from "../../src-tauri/bindings/Vertex3";
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

		onTriangulationComplete(tetrahedralizationResult.tetrahedra.length);
	}

	const handleCreateVertices = () => {
		const vertices: Vertex3[] = new Array(numVertices).fill(0).map(() => ({
			x: (Math.random() - 0.5) * 10,
			y: dimension === "TWO" ? 0 : (Math.random() - 0.5) * 10,
			z: (Math.random() - 0.5) * 10,
		}));
		dispatch(setVertices(vertices));
		dispatch(setTriangles([]));
		dispatch(setTetrahedra([]));
	};

	function handleDimensionChange(e: Event) {
		const newMode = (e.currentTarget as SlRadioGroupElement).value as Dimension;
		if (newMode === "TWO") {
			dispatch(setDimension("TWO"));
		} else if (newMode === "THREE") {
			dispatch(setDimension("THREE"));
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
		</div>
	);
}
