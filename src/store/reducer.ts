import { combineReducers } from "redux";
import experienceSettingsReducer from "./features/experienceSettings/experienceSettingsSlice";
import liftedVerticesReducer from "./features/liftedVertices/liftedVerticesSlice";
import vertexSettingsReducer from "./features/vertexSettings/vertexSettingsSlice";

const reducer = combineReducers({
	experienceSettings: experienceSettingsReducer,
	vertexSettings: vertexSettingsReducer,
	liftedVertices: liftedVerticesReducer,
});

export default reducer;
