import { Dimension } from "../../../../src-tauri/bindings/Dimension";
import { Vertex3 } from "../../../../src-tauri/bindings/Vertex3";
import { Triangle3 } from "../../../../src-tauri/bindings/Triangle3";

const initialState = {
  dimension: "TWO" as Dimension,
  triangles: [] as Triangle3[],
  vertices: [] as Vertex3[],
}

export default function experienceReducer(state: any = initialState, action: any) {
  switch (action.type) {
    case 'dimension/set':
      return {
        ...state,
        dimension: action.payload,
      }
    case 'triangles/set':
      return {
        ...state,
        triangles: action.payload,
      }
    case 'vertices/set':
      return {
        ...state,
        vertices: action.payload,
      }
    default:
      return state;
  }
}