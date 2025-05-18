use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Debug, Serialize, Deserialize, TS)]
#[serde(rename_all = "UPPERCASE")]
#[ts(export)]
pub enum Dimension {
    Two,
    Three,
}

#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export)]
pub struct TriangulationRequest {
    pub vertices: Vec<Vertex3>,
}

#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export)]
pub struct TriangulationResult {
    pub triangles: Vec<Triangle3>,
    pub vertices: Vec<Vertex3>,
}

impl TriangulationResult {
    pub fn empty() -> Self {
        Self {
            triangles: Vec::new(),
            vertices: Vec::new(),
        }
    }
}

#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export)]
pub struct Vertex3 {
    pub x: f64,
    pub y: f64,
    pub z: f64,
}

impl Into<[f64; 2]> for Vertex3 {
    fn into(self) -> [f64; 2] {
        [self.x, self.z]
    }
}

impl From<[f64; 2]> for Vertex3 {
    fn from(value: [f64; 2]) -> Self {
        Self {
            x: value[0],
            y: 0.0,
            z: value[1],
        }
    }
}

#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export)]
pub struct Triangle3 {
    pub a: Vertex3,
    pub b: Vertex3,
    pub c: Vertex3,
}

impl From<[[f64; 2]; 3]> for Triangle3 {
    fn from(value: [[f64; 2]; 3]) -> Self {
        Self {
            a: Vertex3 {
                x: value[0][0],
                y: 0.0,
                z: value[0][1],
            },
            b: Vertex3 {
                x: value[1][0],
                y: 0.0,
                z: value[1][1],
            },
            c: Vertex3 {
                x: value[2][0],
                y: 0.0,
                z: value[2][1],
            },
        }
    }
}
