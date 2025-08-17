import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Cluster2 } from "../../../../src-tauri/bindings/Cluster2";
import type { ClusterRectangle } from "../../../../src-tauri/bindings/ClusterRectangle";
import type { Vertex3 } from "../../../../src-tauri/bindings/Vertex3";

export enum TriangulationMethod {
    ECIRCLES = "e-circles",
    VERTEX_CLUSTERING = "vertex-clustering",
}

interface ClusteringState {
    method: TriangulationMethod;
    clusters: Cluster2[];
    clusterRectangles: ClusterRectangle[];
    simplifiedVertices: Vertex3[];
    isClusteringComplete: boolean;
    isSimplificationComplete: boolean;
}

const initialState: ClusteringState = {
    method: TriangulationMethod.ECIRCLES,
    clusters: [],
    clusterRectangles: [],
    simplifiedVertices: [],
    isClusteringComplete: false,
    isSimplificationComplete: false,
};

const clusteringSlice = createSlice({
    name: "clustering",
    initialState,
    reducers: {
        setTriangulationMethod: (state, action: PayloadAction<TriangulationMethod>) => {
            state.method = action.payload;
            // Clear clustering state when switching methods
            state.clusters = [];
            state.clusterRectangles = [];
            state.simplifiedVertices = [];
            state.isClusteringComplete = false;
            state.isSimplificationComplete = false;
        },
        setClusteringResults: (state, action: PayloadAction<{ clusters: Cluster2[]; clusterRectangles: ClusterRectangle[] }>) => {
            state.clusters = action.payload.clusters;
            state.clusterRectangles = action.payload.clusterRectangles;
            state.isClusteringComplete = true;
            state.isSimplificationComplete = false;
        },
        setSimplificationResults: (state, action: PayloadAction<{ simplifiedVertices: Vertex3[] }>) => {
            state.simplifiedVertices = action.payload.simplifiedVertices;
            state.isSimplificationComplete = true;
        },
        clearClusteringState: (state) => {
            state.clusters = [];
            state.clusterRectangles = [];
            state.simplifiedVertices = [];
            state.isClusteringComplete = false;
            state.isSimplificationComplete = false;
        },
        resetClusteringWorkflow: (state) => {
            state.clusters = [];
            state.clusterRectangles = [];
            state.simplifiedVertices = [];
            state.isClusteringComplete = false;
            state.isSimplificationComplete = false;
        },
    },
});

export const {
    setTriangulationMethod,
    setClusteringResults,
    setSimplificationResults,
    clearClusteringState,
    resetClusteringWorkflow,
} = clusteringSlice.actions;

// Selectors
export const selectTriangulationMethod = (state: { clustering: ClusteringState }) => state.clustering.method;
export const selectClusters = (state: { clustering: ClusteringState }) => state.clustering.clusters;
export const selectClusterRectangles = (state: { clustering: ClusteringState }) => state.clustering.clusterRectangles;
export const selectSimplifiedVertices = (state: { clustering: ClusteringState }) => state.clustering.simplifiedVertices;
export const selectIsClusteringComplete = (state: { clustering: ClusteringState }) => state.clustering.isClusteringComplete;
export const selectIsSimplificationComplete = (state: { clustering: ClusteringState }) => state.clustering.isSimplificationComplete;
export const selectIsVertexClusteringMethod = (state: { clustering: ClusteringState }) =>
    state.clustering.method === TriangulationMethod.VERTEX_CLUSTERING;

export default clusteringSlice.reducer;