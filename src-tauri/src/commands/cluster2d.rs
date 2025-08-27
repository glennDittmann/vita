use std::sync::Mutex;

use tauri::State;
use vertex_clustering::VertexClusterer2;

use crate::{
    state::ClustererState,
    types::{Cluster2, ClusterBounds2, ClusteringRequest, ClusteringResult2, Vertex3},
};

#[tauri::command]
pub fn cluster2d(
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

    let clusterer = VertexClusterer2::new(vertices_2d, None, request.grid_size);
    let clusters = compute_clusters(&clusterer);
    log::info!(
        "Using clusterer with {} bins ({} x {})",
        clusterer.num_bins(),
        clusterer.num_bins_x(),
        clusterer.num_bins_y()
    );

    state_guard.clusterer = Some(clusterer);
    state_guard.grid_size = request.grid_size;

    Ok(ClusteringResult2 { clusters })
}

fn compute_clusters(clusterer: &VertexClusterer2) -> Vec<Cluster2> {
    // Build clusters and cluster rectangles
    let mut clusters = Vec::new();

    // Get the bottom left corner of the grid
    let mut min = [f64::INFINITY, f64::INFINITY];
    let vertices = &clusterer.vertices();

    for (v, _) in vertices {
        min[0] = min[0].min(v[0]);
        min[1] = min[1].min(v[1]);
    }
    let min_x = min[0];
    let min_y = min[1];

    // Draw grid bins step by step
    // todo: we can improve this -> just get the bottom left vertex and draw grid cells by grid size
    for x_idx in 0..clusterer.num_bins_x() {
        for y_idx in 0..clusterer.num_bins_y() {
            let bottom_left = [
                min_x + x_idx as f64 * clusterer.bin_size(),
                min_y + y_idx as f64 * clusterer.bin_size(),
            ];

            let bottom_right = [
                min_x + x_idx as f64 * clusterer.bin_size() + clusterer.bin_size(),
                min_y + y_idx as f64 * clusterer.bin_size(),
            ];

            let top_right = [
                min_x + x_idx as f64 * clusterer.bin_size() + clusterer.bin_size(),
                min_y + y_idx as f64 * clusterer.bin_size() + clusterer.bin_size(),
            ];

            let top_left = [
                min_x + x_idx as f64 * clusterer.bin_size(),
                min_y + y_idx as f64 * clusterer.bin_size() + clusterer.bin_size(),
            ];

            let id = format!("cluster_{}_{}", x_idx, y_idx);
            let bounds = ClusterBounds2 {
                bottom_left: Vertex3::from(bottom_left),
                bottom_right: Vertex3::from(bottom_right),
                top_right: Vertex3::from(top_right),
                top_left: Vertex3::from(top_left),
            };

            let vertices = clusterer
                .get_bin(x_idx, y_idx)
                .unwrap_or(&Vec::new())
                .iter()
                .map(|bin| Vertex3::from(bin.0))
                .collect();

            clusters.push(Cluster2 {
                id,
                bounds,
                vertices,
            });
        }
    }

    clusters
}
