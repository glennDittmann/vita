import { createSlice } from "@reduxjs/toolkit";

interface ExperienceSettingsState {
	axisActive: boolean;
	gridActive: boolean;
	showVertices: boolean;
}

const initialState: ExperienceSettingsState = {
	axisActive: true,
	gridActive: true,
	showVertices: true,
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
		toggleVertices: (state) => {
			state.showVertices = !state.showVertices;
		},
	},
});

// Actions
export const { toggleAxis, toggleGrid, toggleVertices } =
	experienceSettingsSlice.actions;
export default experienceSettingsSlice.reducer;

// Selectors
export const selectShowVertices = (state: {
	experienceSettings: ExperienceSettingsState;
}) => state.experienceSettings.showVertices;
