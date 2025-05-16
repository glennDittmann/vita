import { useState } from 'react';
import { invoke } from "@tauri-apps/api/core";
import SlButton from '@shoelace-style/shoelace/dist/react/button/index.js';
import SlInput from '@shoelace-style/shoelace/dist/react/input/index.js';
import SlRange from '@shoelace-style/shoelace/dist/react/range/index.js';
import SlSelect from '@shoelace-style/shoelace/dist/react/select/index.js';
import SlOption from '@shoelace-style/shoelace/dist/react/option/index.js';
import type SlInputElement from '@shoelace-style/shoelace/dist/components/input/input.js';
import type SlRangeElement from '@shoelace-style/shoelace/dist/components/range/range.js';
import type SlSelectElement from '@shoelace-style/shoelace/dist/components/select/select.js';
// BINDINGS
import { TriangulationRequest } from '../../src-tauri/bindings/TriangulationRequest';
import { TriangulationResult } from '../../src-tauri/bindings/TriangulationResult';
import './Sidebar.css';
import { Dimension } from '../types';

interface SidebarProps {
  onTriangulationComplete: (numTriangles: number) => void;
  onCreateVertices?: (numVertices: number) => void;
  onDimensionChange?: (dim: Dimension) => void;
  dim: Dimension;
}

export default function Sidebar({ onTriangulationComplete, onCreateVertices, onDimensionChange, dim }: SidebarProps) {
  const [numVertices, setNumVertices] = useState("3");
  const [sliderValue, setSliderValue] = useState(100);

  async function triangulate() {
    const num_vertices = parseInt(numVertices, 10);
    const triangulationResult = await invoke<TriangulationResult>("triangulate", {
      request: { num_vertices } as TriangulationRequest
    });

    onTriangulationComplete(triangulationResult.num_triangles);
  }

  function handleCreateVertices() {
    if (onCreateVertices) {
      onCreateVertices(sliderValue);
    }
  }

  function handleDimensionChange(e: Event) {
    const newMode = (e.currentTarget as SlSelectElement).value as Dimension;
    if (onDimensionChange) {
      onDimensionChange(newMode);
    }
  }

  const minNumVertices = dim === Dimension.TwoD ? 3 : 4;
  const maxNumVertices = dim === Dimension.TwoD ? 1000 : 100;
  return (
    <div className="sidebar">
      <div className="sidebar-section">
        <h3>Dimension</h3>
        <SlSelect value={dim} onSlChange={handleDimensionChange}>
          <SlOption value={Dimension.TwoD}>2D</SlOption>
          <SlOption value={Dimension.ThreeD}>3D</SlOption>
        </SlSelect>
      </div>
      <div className="sidebar-section">
        <h3>Triangulation</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            triangulate();
          }}
        >
          <SlInput
            id="greet-input"
            placeholder="Enter the number of vertices"
            type="number"
            value={numVertices}
            onSlInput={(e) => setNumVertices((e.currentTarget as SlInputElement).value)}
          />
          <SlButton type="submit" variant="primary">Triangulate</SlButton>
        </form>
      </div>

      <div className="sidebar-section">
        <h3>Create Vertices</h3>
        <div className="slider-container">
          <SlRange
            min={minNumVertices}
            max={maxNumVertices}
            value={sliderValue}
            onSlChange={(e) => setSliderValue((e.currentTarget as SlRangeElement).value)}
          />
          <div className="slider-value">{sliderValue} vertices</div>
        </div>
        <SlButton
          variant="primary"
          onClick={handleCreateVertices}
          disabled={!onCreateVertices}
        >
          Create Vertices
        </SlButton>
      </div>
    </div>
  )
}