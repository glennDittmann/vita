import { Button, SegmentedControl, Slider } from "@mantine/core";
import { invoke } from "@tauri-apps/api/core";
import { info } from "@tauri-apps/plugin-log";
import { useState } from "react";
import type { ClusteringRequest } from "../../src-tauri/bindings/ClusteringRequest";
import type { ClusteringResult2 } from "../../src-tauri/bindings/ClusteringResult2";
import type { SimplificationRequest2 } from "../../src-tauri/bindings/SimplificationRequest2";
import type { SimplificationResult } from "../../src-tauri/bindings/SimplificationResult";
import type { TetrahedralizationResult } from "../../src-tauri/bindings/TetrahedralizationResult";
// BINDINGS
import type { TriangulationRequest } from "../../src-tauri/bindings/TriangulationRequest";
import type { TriangulationResult } from "../../src-tauri/bindings/TriangulationResult";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import "./Sidebar.css";
import { notifications } from "@mantine/notifications";
import type { Dimension } from "../../src-tauri/bindings/Dimension";
import type { Triangle3 } from "../../src-tauri/bindings/Triangle3";
import type { Vertex3 } from "../../src-tauri/bindings/Vertex3";
import {
	resetClusteringWorkflow,
	selectClusters,
	selectGridSize,
	selectIsClusteringComplete,
	selectIsSimplificationComplete,
	selectIsVertexClusteringMethod,
	selectSimplifiedVertices,
	selectTriangulationMethod,
	setClusteringResults,
	setGridSize,
	setSimplificationResults,
	setTriangulationMethod,
	TriangulationMethod,
} from "../store/features/clustering/clusteringSlice";
import {
	clearLiftedTriangles,
	setLiftedTriangles,
} from "../store/features/liftedTriangles/liftedTrianglesSlice";
import {
	clearLiftedVertices,
	setLiftedVertices,
} from "../store/features/liftedVertices/liftedVerticesSlice";
import {
	resetSimplifiedVertices,
	setDimension,
	setSimplifiedVertices,
	setTetrahedra,
	setTriangles,
	setVertices,
} from "../store/features/vertexSettings/vertexSettingsSlice";

export default function Sidebar() {
	const dispatch = useAppDispatch();
	const dimension = useAppSelector((state) => state.vertexSettings.dimension);
	const gridSize = useAppSelector(selectGridSize);
	const vertices = useAppSelector((state) => state.vertexSettings.vertices);
	const triangles = useAppSelector((state) => state.vertexSettings.triangles);
	const triangulationMethod = useAppSelector(selectTriangulationMethod);
	const isVertexClustering = useAppSelector(selectIsVertexClusteringMethod);
	const clusters = useAppSelector(selectClusters);
	const isClusteringComplete = useAppSelector(selectIsClusteringComplete);
	const isSimplificationComplete = useAppSelector(
		selectIsSimplificationComplete,
	);
	const simplifiedVertices = useAppSelector(selectSimplifiedVertices);
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
		dispatch(resetSimplifiedVertices());
		dispatch(setTriangles([]));
		dispatch(setTetrahedra([]));
		dispatch(clearLiftedVertices());
		dispatch(clearLiftedTriangles());
		dispatch(resetClusteringWorkflow());
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

	function handleMethodChange(value: string) {
		const newMethod = value as TriangulationMethod;
		dispatch(setTriangulationMethod(newMethod));
	}

	const handleTriangulate = () => {
		if (dimension === "TWO") {
			triangulate();
		} else if (dimension === "THREE") {
			tetrahedralize();
		}
	};

	// Vertex clustering workflow functions
	async function handleCluster() {
		try {
			info(`Clustering ${vertices.length} vertices...`);

			const clusteringResult = await invoke<ClusteringResult2>("cluster2d", {
				request: {
					vertices,
					grid_size: gridSize,
				} as ClusteringRequest,
			});

			dispatch(
				setClusteringResults({
					clusters: clusteringResult.clusters,
				}),
			);

			notifications.show({
				title: "Clustering Complete",
				message: `${clusteringResult.clusters.length} clusters created`,
				withBorder: true,
			});
		} catch (error) {
			console.error("Clustering failed:", error);
			notifications.show({
				title: "Clustering Failed",
				message: "An error occurred during clustering",
				color: "red",
				withBorder: true,
			});
		}
	}

	async function handleSimplify() {
		try {
			info(`Simplifying ${clusters.length} clusters...`);

			const simplificationResult = await invoke<SimplificationResult>(
				"simplify2d",
				{
					request: {
						clusters,
					} as SimplificationRequest2,
				},
			);

			dispatch(
				setSimplificationResults({
					simplifiedVertices: simplificationResult.simplified_vertices,
				}),
			);

			dispatch(setSimplifiedVertices(simplificationResult.simplified_vertices));

			notifications.show({
				title: "Simplification Complete",
				message: `${simplificationResult.simplified_vertices.length} representative vertices created`,
				withBorder: true,
			});
		} catch (error) {
			console.error("Simplification failed:", error);
			notifications.show({
				title: "Simplification Failed",
				message: "An error occurred during simplification",
				color: "red",
				withBorder: true,
			});
		}
	}

	async function handleClusteringTriangulate() {
		try {
			info(`Triangulating ${simplifiedVertices.length} simplified vertices...`);

			const triangulationResult = await invoke<TriangulationResult>(
				"triangulate",
				{
					request: { vertices: simplifiedVertices } as TriangulationRequest,
				},
			);

			dispatch(setTriangles(triangulationResult.triangles));
			dispatch(clearLiftedTriangles());

			notifications.show({
				title: "Triangulation Complete",
				message: `${triangulationResult.triangles.length} triangles created from clustered vertices`,
				withBorder: true,
			});
		} catch (error) {
			console.error("Clustering triangulation failed:", error);
			notifications.show({
				title: "Triangulation Failed",
				message: "An error occurred during triangulation",
				color: "red",
				withBorder: true,
			});
		}
	}

	const minNumVertices = dimension === "TWO" ? 3 : 4;
	const maxNumVertices = 100;
	const is3DDisabledForClustering = isVertexClustering && dimension === "THREE";

	return (
		<div className="sidebar">
			<div className="sidebar-section">
				<h3>Triangulation Method</h3>
				<SegmentedControl
					value={triangulationMethod}
					onChange={handleMethodChange}
					data={[
						{ label: "e-Circles", value: TriangulationMethod.ECIRCLES },
						{
							label: "Vertex Clustering",
							value: TriangulationMethod.VERTEX_CLUSTERING,
						},
					]}
				/>
			</div>
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
				{is3DDisabledForClustering && (
					<div style={{ marginTop: "8px", fontSize: "12px", color: "#868e96" }}>
						3D mode is not supported for vertex clustering
					</div>
				)}
			</div>
			{!is3DDisabledForClustering && (
				<>
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

					{triangulationMethod === TriangulationMethod.ECIRCLES && (
						<>
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
								<Button
									onClick={handleTriangulate}
									disabled={vertices.length < 3}
								>
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
						</>
					)}

					{triangulationMethod === TriangulationMethod.VERTEX_CLUSTERING && (
						<div className="sidebar-section">
							<h3>Vertex Clustering Workflow</h3>
							<div className="slider-container">
								<Slider
									color="blue"
									defaultValue={gridSize}
									onChange={(value) => dispatch(setGridSize(value))}
									min={0.1}
									max={10}
									marks={[
										{ value: 0.1, label: "0.1" },
										{ value: 1, label: "1" },
										{ value: 5, label: "5" },
										{ value: 10, label: "10" },
									]}
									step={0.1}
								/>
								<div className="slider-value">Grid Size: {gridSize}</div>
							</div>
							<Button
								onClick={handleCluster}
								disabled={vertices.length < 3 || isClusteringComplete}
							>
								Cluster
							</Button>
							<Button
								onClick={handleSimplify}
								disabled={!isClusteringComplete || isSimplificationComplete}
								style={{ marginTop: "8px" }}
							>
								Simplify
							</Button>
							<Button
								onClick={handleClusteringTriangulate}
								disabled={!isSimplificationComplete}
								style={{ marginTop: "8px" }}
							>
								Triangulate
							</Button>
						</div>
					)}
				</>
			)}
		</div>
	);
}
