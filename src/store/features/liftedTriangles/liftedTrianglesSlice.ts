import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Triangle3 } from "../../../../src-tauri/bindings/Triangle3";

interface LiftedTrianglesState {
	liftedTriangles: Triangle3[];
}

const initialState: LiftedTrianglesState = {
	liftedTriangles: [],
};

const liftedTrianglesSlice = createSlice({
	name: "liftedTriangles",
	initialState,
	reducers: {
		setLiftedTriangles: (state, action: PayloadAction<Triangle3[]>) => {
			state.liftedTriangles = action.payload;
		},
		clearLiftedTriangles: (state) => {
			state.liftedTriangles = [];
		},
	},
});

export const { setLiftedTriangles, clearLiftedTriangles } =
	liftedTrianglesSlice.actions;
export default liftedTrianglesSlice.reducer;
