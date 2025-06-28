import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Vertex3 } from "../../../../src-tauri/bindings/Vertex3";

interface LiftedVerticesState {
	liftedVertices: Vertex3[];
}

const initialState: LiftedVerticesState = {
	liftedVertices: [],
};

const liftedVerticesSlice = createSlice({
	name: "liftedVertices",
	initialState,
	reducers: {
		setLiftedVertices: (state, action: PayloadAction<Vertex3[]>) => {
			state.liftedVertices = action.payload;
		},
		clearLiftedVertices: (state) => {
			state.liftedVertices = [];
		},
	},
});

export const { setLiftedVertices, clearLiftedVertices } =
	liftedVerticesSlice.actions;
export default liftedVerticesSlice.reducer;
