import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Dimension } from "../../../../src-tauri/bindings/Dimension";
import type { Tetrahedron3 } from "../../../../src-tauri/bindings/Tetrahedron3";
import type { Triangle3 } from "../../../../src-tauri/bindings/Triangle3";
import type { Vertex3 } from "../../../../src-tauri/bindings/Vertex3";

interface VertexSettingsState {
	dimension: Dimension;
	tetrahedra: Tetrahedron3[];
	triangles: Triangle3[];
	vertices: Vertex3[];
	simplifiedVertices: Vertex3[];
	epsilon: number;
}

const initialState: VertexSettingsState = {
	dimension: "THREE",
	tetrahedra: [],
	triangles: [],
	vertices: [],
	simplifiedVertices: [],
	epsilon: 0.0,
};

const vertexSettingsSlice = createSlice({
	name: "vertexSettings",
	initialState,
	reducers: {
		setDimension: (state, action: PayloadAction<Dimension>) => {
			state.dimension = action.payload;
		},
		setTetrahedra: (state, action: PayloadAction<Tetrahedron3[]>) => {
			state.tetrahedra = action.payload;
		},
		setTriangles: (state, action: PayloadAction<Triangle3[]>) => {
			state.triangles = action.payload;
		},
		setVertices: (state, action: PayloadAction<Vertex3[]>) => {
			state.vertices = action.payload;
		},
		setSimplifiedVertices: (state, action: PayloadAction<Vertex3[]>) => {
			state.simplifiedVertices = action.payload;
		},
		resetSimplifiedVertices: (state) => {
			state.simplifiedVertices = [];
		},
		setEpsilon: (state, action: PayloadAction<number>) => {
			state.epsilon = action.payload;
		},
	},
});

// Actions
export const {
	setDimension,
	setTetrahedra,
	setTriangles,
	setVertices,
	setSimplifiedVertices,
	resetSimplifiedVertices,
	setEpsilon,
} = vertexSettingsSlice.actions;
export default vertexSettingsSlice.reducer;

// Selectors
export const selectEpsilon = (state: { vertexSettings: VertexSettingsState }) =>
	state.vertexSettings.epsilon;
export const selectSimplifiedVertices = (state: {
	vertexSettings: VertexSettingsState;
}) => state.vertexSettings.simplifiedVertices;
