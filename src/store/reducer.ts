import { combineReducers } from "redux";
import experienceSettingsReducer from "./features/experienceSettings/experienceSettingsSlice";
import vertexSettingsReducer from "./features/vertexSettings/vertexSettingsSlice";

const reducer = combineReducers({
	experienceSettings: experienceSettingsReducer,
	vertexSettings: vertexSettingsReducer,
});

export default reducer;
