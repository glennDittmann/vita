use std::sync::Mutex;

use tauri::State;

use crate::{
    state::ClustererState,
    types::{SimplificationRequest2, SimplificationResult, Vertex3},
};

#[tauri::command]
pub fn simplify2d(
    request: SimplificationRequest2,
    state: State<'_, Mutex<ClustererState>>,
) -> Result<SimplificationResult, String> {
    log::info!(
        "Starting cluster simplification with {} clusters",
        request.clusters.len()
    );

    if request.clusters.is_empty() {
        return Err("No clusters provided for simplification".to_string());
    }

    let state_guard = state.lock().unwrap();

    if state_guard.clusterer.is_none() {
        return Err("No clusterer available. Please run cluster2d first.".to_string());
    }

    let clusterer = state_guard.clusterer.as_ref().unwrap();
    let (simplified_vertices_2d, _weights) = clusterer.simplify();

    // Convert back to Vertex3 format
    let simplified_vertices: Vec<Vertex3> = simplified_vertices_2d
        .into_iter()
        .map(|v| Vertex3::from(v))
        .collect();

    log::info!(
        "Simplification complete: {} clusters -> {} representative vertices",
        request.clusters.len(),
        simplified_vertices.len()
    );

    Ok(SimplificationResult {
        simplified_vertices,
    })
}
