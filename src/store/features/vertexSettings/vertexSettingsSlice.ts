import type { Dimension } from "../../../../src-tauri/bindings/Dimension";
import type { Tetrahedron3 } from "../../../../src-tauri/bindings/Tetrahedron3";
import type { Triangle3 } from "../../../../src-tauri/bindings/Triangle3";
import type { Vertex3 } from "../../../../src-tauri/bindings/Vertex3";

const initialState = {
	dimension: "THREE" as Dimension,
	tetrahedra: [] as Tetrahedron3[],
	triangles: [] as Triangle3[],
	vertices: [] as Vertex3[],
};

export default function experienceReducer(
	state: any = initialState,
	action: any,
) {
	switch (action.type) {
		case "dimension/set":
			return {
				...state,
				dimension: action.payload,
			};
		case "tetrahedra/set":
			return {
				...state,
				tetrahedra: action.payload,
			};
		case "triangles/set":
			return {
				...state,
				triangles: action.payload,
			};
		case "vertices/set":
			return {
				...state,
				vertices: action.payload,
			};
		default:
			return state;
	}
}
