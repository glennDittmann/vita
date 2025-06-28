import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	axisActive: true,
	gridActive: true,
};

const experienceSettingsSlice = createSlice({
	name: "experienceSettings",
	initialState,
	reducers: {
		toggleAxis: (state) => {
			state.axisActive = !state.axisActive;
		},
		toggleGrid: (state) => {
			state.gridActive = !state.gridActive;
		},
	},
});

export const { toggleAxis, toggleGrid } = experienceSettingsSlice.actions;
export default experienceSettingsSlice.reducer;
