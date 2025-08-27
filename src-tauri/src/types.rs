use serde::{Deserialize, Serialize};
use ts_rs::TS;
use uuid;

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
pub struct TetrahedralizationResult {
    pub tetrahedra: Vec<Tetrahedron3>,
    pub vertices: Vec<Vertex3>,
}

impl TetrahedralizationResult {
    pub fn empty() -> Self {
        Self {
            tetrahedra: Vec::new(),
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

impl Into<[f64; 3]> for Vertex3 {
    fn into(self) -> [f64; 3] {
        [self.x, self.y, self.z]
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

impl From<[f64; 3]> for Vertex3 {
    fn from(value: [f64; 3]) -> Self {
        Self {
            x: value[0],
            y: value[1],
            z: value[2],
        }
    }
}

#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export)]
pub struct Triangle3 {
    pub id: String,
    pub a: Vertex3,
    pub b: Vertex3,
    pub c: Vertex3,
}

impl From<[[f64; 2]; 3]> for Triangle3 {
    fn from(value: [[f64; 2]; 3]) -> Self {
        Self {
            id: uuid::Uuid::new_v4().to_string(),
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

#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export)]
pub struct Tetrahedron3 {
    pub id: String,
    pub a: Vertex3,
    pub b: Vertex3,
    pub c: Vertex3,
    pub d: Vertex3,
}

impl From<[[f64; 3]; 4]> for Tetrahedron3 {
    fn from(value: [[f64; 3]; 4]) -> Self {
        Self {
            id: uuid::Uuid::new_v4().to_string(),
            a: Vertex3 {
                x: value[0][0],
                y: value[0][1],
                z: value[0][2],
            },
            b: Vertex3 {
                x: value[1][0],
                y: value[1][1],
                z: value[1][2],
            },
            c: Vertex3 {
                x: value[2][0],
                y: value[2][1],
                z: value[2][2],
            },
            d: Vertex3 {
                x: value[3][0],
                y: value[3][1],
                z: value[3][2],
            },
        }
    }
}
// Clustering-related types
#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export)]
pub struct ClusteringRequest {
    pub vertices: Vec<Vertex3>,
    pub grid_size: f64,
}

#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export)]
pub struct ClusteringResult2 {
    pub clusters: Vec<Cluster2>,
}

#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export)]
pub struct Cluster2 {
    pub id: String,
    pub bounds: ClusterBounds2,
    pub vertices: Vec<Vertex3>,
}

#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export)]
pub struct ClusterBounds2 {
    pub bottom_left: Vertex3,
    pub bottom_right: Vertex3,
    pub top_right: Vertex3,
    pub top_left: Vertex3,
}

#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export)]
pub struct SimplificationRequest2 {
    pub clusters: Vec<Cluster2>,
}

#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export)]
pub struct SimplificationResult {
    pub simplified_vertices: Vec<Vertex3>,
}
