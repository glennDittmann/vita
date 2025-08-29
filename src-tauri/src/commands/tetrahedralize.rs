use rita::Tetrahedralization;

use crate::types::{TetrahedralizationResult, Tetrahedron3, TriangulationRequest, Vertex3};

#[tauri::command]
pub fn tetrahedralize(request: TriangulationRequest) -> TetrahedralizationResult {
    let mut t = Tetrahedralization::new(Some(request.epsilon));

    let vertices = request
        .vertices
        .into_iter()
        .map(|v| v.into())
        .collect::<Vec<[f64; 3]>>();

    let res = t.insert_vertices(&vertices, None, true);

    if res.is_err() {
        log::error!("Failed to insert vertices: {:?}", res.err());
        return TetrahedralizationResult::empty();
    }

    log::info!("Tetrahedralization complete");

    let tetrahedra = t
        .tets()
        .iter()
        .map(|&t| Tetrahedron3::from(t))
        .collect::<Vec<Tetrahedron3>>();

    let vertices = t
        .vertices()
        .iter()
        .map(|&v| Vertex3::from(v))
        .collect::<Vec<Vertex3>>();

    TetrahedralizationResult {
        tetrahedra,
        vertices,
    }
}
