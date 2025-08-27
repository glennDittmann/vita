# 3D Point Cloud Visualizer

A modern web application built with Three.js and React that visualizes 3D point clouds. The project uses Vite for fast development and Tauri for native desktop capabilities.

## Features

- Interactive 3D point cloud visualization
- Weighted Delaunay Triangulation of 2D and 3D point clouds
- Dynamic vertex generation
- Modern lighting system
- Responsive design

## Tech Stack

- Three.js for 3D rendering
- React for UI components
- TypeScript for type safety
- Vite for build tooling
- Tauri for desktop integration
- Biome for linting and formatting

## Getting Started

0. Follow the [setup to for tauri 2.0](https://tauri.app/start/prerequisites/) on your OS. 

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Project Structure

- `src/` - Main source code
- `src-tauri/` - Tauri-specific code
- `public/` - Static assets

## Types
To ensure type safety between `rust` and `typescript` `ts_rs` is used.

The types that need to be shared between frontend and backend are defined in `src-tauri/src/types.rs`.

Run `cargo test export_bindings`, to generate the `typescript` counterparts to `src-tauri/bindings/`.

## To Do
- add actual epsilon Setting for Eps Circles method
- add Vertex Clustering 3D
- clean up
