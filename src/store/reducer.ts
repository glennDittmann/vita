import { Dimension } from '../../src-tauri/bindings/Dimension'

const initialState = {
  axisActive: true,
  gridActive: true,
  dimension: "THREE" as Dimension,
}

const reducer = (state: any = initialState, action: any) => {
  switch (action.type) {
    case 'dimension/set':
      return {
        ...state,
        dimension: action.payload,
      }
    case 'axis/activate':
      return {
        ...state,
        axisActive: true,
      }
    case 'axis/deactivate':
      return {
        ...state,
        axisActive: false,
      }
    case 'grid/activate':
      return {
        ...state,
        gridActive: true,
      }
    case 'grid/deactivate':
      return {
        ...state,
        gridActive: false,
      }
    default:
      return state;
  }
};

export default reducer;