use vertex_clustering::VertexClusterer2;

pub struct ClustererState {
    pub clusterer: Option<VertexClusterer2>,
    pub grid_size: f64,
}

impl Default for ClustererState {
    fn default() -> Self {
        Self {
            clusterer: None,
            grid_size: 1.0,
        }
    }
}
