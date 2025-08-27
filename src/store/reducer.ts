import { combineReducers } from "redux";
import clusteringReducer from "./features/clustering/clusteringSlice";
import experienceSettingsReducer from "./features/experienceSettings/experienceSettingsSlice";
import liftedTrianglesReducer from "./features/liftedTriangles/liftedTrianglesSlice";
import liftedVerticesReducer from "./features/liftedVertices/liftedVerticesSlice";
import vertexSettingsReducer from "./features/vertexSettings/vertexSettingsSlice";

const reducer = combineReducers({
	experienceSettings: experienceSettingsReducer,
	liftedTriangles: liftedTrianglesReducer,
	liftedVertices: liftedVerticesReducer,
	vertexSettings: vertexSettingsReducer,
	clustering: clusteringReducer,
});

export default reducer;
