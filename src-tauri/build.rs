fn main() {
    tauri_build::build();

    // // Generate TypeScript types
    // let types = vec!["TriangulationRequest", "TriangulationResult"];

    // ts_rs::export(&types, "src/types.ts").unwrap();
}
