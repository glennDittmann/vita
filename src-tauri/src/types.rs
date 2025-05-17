use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export)]
pub struct TriangulationResult {
    pub num_triangles: usize,
}

#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export)]
pub struct TriangulationRequest {
    pub num_vertices: usize,
}

#[derive(Debug, Serialize, Deserialize, TS)]
#[serde(rename_all = "UPPERCASE")]
#[ts(export)]
pub enum Dimension {
    Two,
    Three,
}
