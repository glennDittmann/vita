use rita::{Tetrahedralization, Triangulation};
use vertex_clustering::VertexClusterer2;

mod logging;
mod types;
use types::{
    Cluster2, ClusterBounds2, ClusterRectangle, ClusteringRequest, ClusteringResult2,
    SimplificationRequest2, SimplificationResult, TetrahedralizationResult, Tetrahedron3,
    Triangle3, TriangulationRequest, TriangulationResult, Vertex3,
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

#[tauri::command]
fn simplify_clusters(request: SimplificationRequest2) -> Result<SimplificationResult, String> {
    log::info!(
        "Starting cluster simplification with {} clusters",
        request.clusters.len()
    );

    if request.clusters.is_empty() {
        return Err("No clusters provided for simplification".to_string());
    }

    let mut simplified_vertices = Vec::new();

    // For each cluster, select a representative vertex
    for cluster in &request.clusters {
        if cluster.vertices.is_empty() {
            log::warn!("Empty cluster found: {}", cluster.id);
            continue;
        }

        // Use the vertex_clustering crate's simplification approach
        // Convert cluster vertices to 2D format for processing
        let vertices_2d: Vec<[f64; 2]> = cluster.vertices.iter().map(|v| [v.x, v.z]).collect();

        // Create a clusterer for this specific cluster to get the representative
        let clusterer = VertexClusterer2::new(vertices_2d.clone(), None, 1.0);

        // Get the representative vertex using the clusterer's simplification method
        let (simplified_vertices_2d, _weights) = clusterer.simplify();

        let representative = if !simplified_vertices_2d.is_empty() {
            // Use the first simplified vertex as the representative
            Vertex3 {
                x: simplified_vertices_2d[0][0],
                y: 0.0,
                z: simplified_vertices_2d[0][1],
            }
        } else {
            // Fallback: use the centroid of the cluster
            calculate_cluster_centroid(&cluster.vertices)
        };

        log::debug!(
            "Cluster {} simplified: {} vertices -> 1 representative at ({}, {}, {})",
            cluster.id,
            cluster.vertices.len(),
            representative.x,
            representative.y,
            representative.z
        );
        simplified_vertices.push(representative);
    }

    log::info!(
        "Simplification complete: {} clusters -> {} representative vertices",
        request.clusters.len(),
        simplified_vertices.len()
    );

    Ok(SimplificationResult {
        simplified_vertices,
    })
}

// Helper function to calculate the centroid of a cluster's vertices
fn calculate_cluster_centroid(vertices: &[Vertex3]) -> Vertex3 {
    if vertices.is_empty() {
        return Vertex3 {
            x: 0.0,
            y: 0.0,
            z: 0.0,
        };
    }

    let sum_x: f64 = vertices.iter().map(|v| v.x).sum();
    let sum_z: f64 = vertices.iter().map(|v| v.z).sum();
    let count = vertices.len() as f64;

    Vertex3 {
        x: sum_x / count,
        y: 0.0, // Keep Y at 0 for 2D clustering
        z: sum_z / count,
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_simplify_clusters() {
        // Create test clusters
        let cluster1 = Cluster2 {
            id: "test1".to_string(),
            vertices: vec![
                Vertex3 {
                    x: 1.0,
                    y: 0.0,
                    z: 1.0,
                },
                Vertex3 {
                    x: 1.1,
                    y: 0.0,
                    z: 1.1,
                },
                Vertex3 {
                    x: 0.9,
                    y: 0.0,
                    z: 0.9,
                },
            ],
            bounds: ClusterBounds2 {
                min_x: 0.9,
                max_x: 1.1,
                min_z: 0.9,
                max_z: 1.1,
            },
        };

        let cluster2 = Cluster2 {
            id: "test2".to_string(),
            vertices: vec![
                Vertex3 {
                    x: 5.0,
                    y: 0.0,
                    z: 5.0,
                },
                Vertex3 {
                    x: 5.2,
                    y: 0.0,
                    z: 4.8,
                },
            ],
            bounds: ClusterBounds2 {
                min_x: 5.0,
                max_x: 5.2,
                min_z: 4.8,
                max_z: 5.0,
            },
        };

        let request = SimplificationRequest2 {
            clusters: vec![cluster1, cluster2],
        };

        // Test the simplification
        let result = simplify_clusters(request);
        assert!(result.is_ok());

        let simplified = result.unwrap();
        assert_eq!(simplified.simplified_vertices.len(), 2);

        // Verify that we got representative vertices
        assert!(simplified.simplified_vertices[0].x > 0.0);
        assert!(simplified.simplified_vertices[1].x > 0.0);
    }

    #[test]
    fn test_simplify_empty_clusters() {
        let request = SimplificationRequest2 { clusters: vec![] };

        let result = simplify_clusters(request);
        assert!(result.is_err());
        assert_eq!(
            result.unwrap_err(),
            "No clusters provided for simplification"
        );
    }

    #[test]
    fn test_calculate_cluster_centroid() {
        let vertices = vec![
            Vertex3 {
                x: 0.0,
                y: 0.0,
                z: 0.0,
            },
            Vertex3 {
                x: 2.0,
                y: 0.0,
                z: 2.0,
            },
            Vertex3 {
                x: 4.0,
                y: 0.0,
                z: 4.0,
            },
        ];

        let centroid = calculate_cluster_centroid(&vertices);
        assert_eq!(centroid.x, 2.0);
        assert_eq!(centroid.y, 0.0);
        assert_eq!(centroid.z, 2.0);
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(logging::build_logger())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            triangulate,
            tetrahedralize,
            cluster_vertices,
            simplify_clusters
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
