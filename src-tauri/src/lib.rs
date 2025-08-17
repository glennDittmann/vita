use rita::{Tetrahedralization, Triangulation};
use vertex_clustering::VertexClusterer2;

mod logging;
mod types;
use types::{
    Cluster2, ClusterBounds2, ClusterRectangle, ClusteringRequest, ClusteringResult2,
    TetrahedralizationResult, Tetrahedron3, Triangle3, TriangulationRequest, TriangulationResult,
    Vertex3,
};

#[tauri::command]
fn triangulate(request: TriangulationRequest) -> TriangulationResult {
    let mut t = Triangulation::new(None);

    let vertices = request
        .vertices
        .into_iter()
        .map(|v| v.into())
        .collect::<Vec<[f64; 2]>>();

    let res = t.insert_vertices(&vertices, None, true);

    if res.is_err() {
        log::error!("Failed to insert vertices: {:?}", res.err());
        return TriangulationResult::empty();
    }

    log::info!("Triangulation complete");

    let triangles = t
        .tris()
        .iter()
        .map(|&t| Triangle3::from(t))
        .collect::<Vec<Triangle3>>();

    let vertices = t
        .vertices()
        .iter()
        .map(|&v| Vertex3::from(v))
        .collect::<Vec<Vertex3>>();

    TriangulationResult {
        triangles,
        vertices,
    }
}

#[tauri::command]
fn tetrahedralize(request: TriangulationRequest) -> TetrahedralizationResult {
    let mut t = Tetrahedralization::new(None);

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

#[tauri::command]
fn cluster_vertices(request: ClusteringRequest) -> Result<ClusteringResult2, String> {
    log::info!(
        "Starting vertex clustering with {} vertices and grid size {}",
        request.vertices.len(),
        request.grid_size
    );

    // Convert Vertex3 to [f64; 2] for the clustering algorithm (using x, z coordinates)
    let vertices_2d: Vec<[f64; 2]> = request.vertices.iter().map(|v| [v.x, v.z]).collect();

    // Create the vertex clusterer
    let clusterer = match VertexClusterer2::new(vertices_2d, None, request.grid_size) {
        clusterer => clusterer,
    };

    log::info!(
        "Created clusterer with {} bins ({} x {})",
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

                    // Generate a color for the cluster rectangle (simple hash-based color)
                    let color = generate_cluster_color(&cluster_id);

                    // Create cluster rectangle
                    let cluster_rectangle = ClusterRectangle {
                        id: cluster_id,
                        bounds,
                        color,
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

// Helper function to generate a deterministic color for a cluster
fn generate_cluster_color(cluster_id: &str) -> String {
    use std::collections::hash_map::DefaultHasher;
    use std::hash::{Hash, Hasher};

    let mut hasher = DefaultHasher::new();
    cluster_id.hash(&mut hasher);
    let hash = hasher.finish();

    // Generate RGB values from hash
    let r = ((hash & 0xFF0000) >> 16) as u8;
    let g = ((hash & 0x00FF00) >> 8) as u8;
    let b = (hash & 0x0000FF) as u8;

    // Ensure colors are bright enough for visibility
    let r = if r < 100 { r + 100 } else { r };
    let g = if g < 100 { g + 100 } else { g };
    let b = if b < 100 { b + 100 } else { b };

    format!("#{:02x}{:02x}{:02x}", r, g, b)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(logging::build_logger())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            triangulate,
            tetrahedralize,
            cluster_vertices
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
