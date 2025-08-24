mod commands;
mod logging;
mod state;
mod types;
use commands::{simplify2d, tetrahedralize, triangulate};
use std::sync::Mutex;
use tauri::State;
use types::{
    Cluster2, ClusterBounds2, ClusterRectangle, ClusteringRequest, ClusteringResult2, Vertex3,
};
use vertex_clustering::VertexClusterer2;

use crate::state::ClustererState;

#[tauri::command]
fn cluster_vertices(
    request: ClusteringRequest,
    state: State<'_, Mutex<ClustererState>>,
) -> Result<ClusteringResult2, String> {
    log::info!(
        "Starting vertex clustering with {} vertices and grid size {}",
        request.vertices.len(),
        request.grid_size
    );

    // Convert Vertex3 to [f64; 2] for the clustering algorithm (using x, z coordinates)
    let vertices_2d: Vec<[f64; 2]> = request.vertices.iter().map(|v| [v.x, v.z]).collect();

    // Get or create the clusterer
    let mut state_guard = state.lock().unwrap();

    // Check if we need to create a new clusterer (first time or settings changed)
    let needs_new_clusterer =
        state_guard.clusterer.is_none() || state_guard.grid_size != request.grid_size;

    if needs_new_clusterer {
        log::info!(
            "Creating new clusterer with grid size {}",
            request.grid_size
        );
        let clusterer = VertexClusterer2::new(vertices_2d, None, request.grid_size);
        state_guard.clusterer = Some(clusterer);
        state_guard.grid_size = request.grid_size;
    } else {
        log::info!("Reusing existing clusterer");
    }

    let clusterer = state_guard.clusterer.as_ref().unwrap();

    log::info!(
        "Using clusterer with {} bins ({} x {})",
        clusterer.num_bins(),
        clusterer.num_bins_x(),
        clusterer.num_bins_y()
    );

    // Build clusters and cluster rectangles
    let mut clusters = Vec::new();
    let mut cluster_rectangles = Vec::new();
    // Iterate through all bins to create clusters
    for x_idx in 0..clusterer.num_bins_x() {
        for y_idx in 0..clusterer.num_bins_y() {
            if let Some(bin_vertices) = clusterer.get_bin(x_idx, y_idx) {
                if !bin_vertices.is_empty() {
                    let cluster_id = uuid::Uuid::new_v4().to_string();

                    // Convert bin vertices back to Vertex3 format
                    let cluster_vertices: Vec<Vertex3> = bin_vertices
                        .iter()
                        .map(|(vertex, _weight)| Vertex3 {
                            x: vertex[0],
                            y: 0.0,
                            z: vertex[1],
                        })
                        .collect();

                    // Calculate cluster bounds
                    let min_x = bin_vertices
                        .iter()
                        .map(|(v, _)| v[0])
                        .fold(f64::INFINITY, f64::min);
                    let max_x = bin_vertices
                        .iter()
                        .map(|(v, _)| v[0])
                        .fold(f64::NEG_INFINITY, f64::max);
                    let min_z = bin_vertices
                        .iter()
                        .map(|(v, _)| v[1])
                        .fold(f64::INFINITY, f64::min);
                    let max_z = bin_vertices
                        .iter()
                        .map(|(v, _)| v[1])
                        .fold(f64::NEG_INFINITY, f64::max);

                    let bounds = ClusterBounds2 {
                        min_x,
                        max_x,
                        min_z,
                        max_z,
                    };

                    // Create cluster
                    let cluster = Cluster2 {
                        id: cluster_id.clone(),
                        vertices: cluster_vertices,
                        bounds: bounds.clone(),
                    };

                    clusters.push(cluster);

                    // Create cluster rectangle
                    let cluster_rectangle = ClusterRectangle {
                        id: cluster_id,
                        bounds,
                        vertex_count: bin_vertices.len(),
                    };

                    cluster_rectangles.push(cluster_rectangle);
                }
            }
        }
    }

    log::info!("Clustering complete: {} clusters created", clusters.len());

    Ok(ClusteringResult2 {
        clusters,
        cluster_rectangles,
    })
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(logging::build_logger())
        .plugin(tauri_plugin_opener::init())
        .manage(Mutex::new(ClustererState::default()))
        .invoke_handler(tauri::generate_handler![
            triangulate,
            tetrahedralize,
            cluster_vertices,
            simplify2d
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
