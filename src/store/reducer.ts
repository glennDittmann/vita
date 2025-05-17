import experienceReducer from "./features/experienceSettings/experienceSettingsSlice";
import vertexSettingsReducer from "./features/vertexSettings/vertexSettingsSlice";


const reducer = (state: any = {}, action: any) => {
  return {
    experienceSettings: experienceReducer(state.experienceSettings, action),
    vertexSettings: vertexSettingsReducer(state.vertexSettings, action),
  }

};

export default reducer;