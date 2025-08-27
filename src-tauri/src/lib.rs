mod commands;
mod logging;
mod state;
mod types;
use crate::state::ClustererState;
use commands::{cluster2d, simplify2d, tetrahedralize, triangulate};
use std::sync::Mutex;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(logging::build_logger())
        .plugin(tauri_plugin_opener::init())
        .manage(Mutex::new(ClustererState::default()))
        .invoke_handler(tauri::generate_handler![
            triangulate,
            tetrahedralize,
            cluster2d,
            simplify2d
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
