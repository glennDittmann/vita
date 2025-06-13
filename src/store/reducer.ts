import { combineReducers } from "redux";
import experienceReducer from "./features/experienceSettings/experienceSettingsSlice";
import vertexSettingsReducer from "./features/vertexSettings/vertexSettingsSlice";

const reducer = combineReducers({
	experienceSettings: experienceReducer,
	vertexSettings: vertexSettingsReducer,
});

export default reducer;
