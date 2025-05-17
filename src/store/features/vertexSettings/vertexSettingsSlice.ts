import { Dimension } from "../../../../src-tauri/bindings/Dimension";

const initialState = {
  dimension: "THREE" as Dimension,
}

export default function experienceReducer(state: any = initialState, action: any) {
  switch (action.type) {
    case 'dimension/set':
      return {
        ...state,
        dimension: action.payload,
      }
    default:
      return state;
  }
}