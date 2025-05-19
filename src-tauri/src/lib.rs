use rita::Triangulation;

mod logging;
mod types;
use types::{Triangle3, TriangulationRequest, TriangulationResult, Vertex3};

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

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(logging::build_logger())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![triangulate])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
