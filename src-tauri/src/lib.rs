use rand::Rng;
use rita::Triangulation;

mod types;
use types::{TriangulationRequest, TriangulationResult};

#[tauri::command]
fn triangulate(request: TriangulationRequest) -> TriangulationResult {
    let mut t = Triangulation::new(None);
    let mut rng = rand::rng();

    let mut vertices = Vec::with_capacity(request.num_vertices);

    for _ in 0..request.num_vertices {
        let x = rng.random_range(0.0..1.0);
        let y = rng.random_range(0.0..1.0);
        vertices.push([x, y]);
    }

    let _res = t.insert_vertices(&vertices, None, true);

    TriangulationResult {
        num_triangles: t.num_tris(),
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![triangulate])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
