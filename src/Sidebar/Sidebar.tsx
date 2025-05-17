import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { invoke } from "@tauri-apps/api/core";
import { info } from '@tauri-apps/plugin-log';
import SlButton from '@shoelace-style/shoelace/dist/react/button/index.js';
import SlRange from '@shoelace-style/shoelace/dist/react/range/index.js';
import SlRadioButton from '@shoelace-style/shoelace/dist/react/radio-button/index.js';
import SlRadioGroup from '@shoelace-style/shoelace/dist/react/radio-group/index.js';
import type SlRangeElement from '@shoelace-style/shoelace/dist/components/range/range.js';
import type SlRadioGroupElement from '@shoelace-style/shoelace/dist/components/radio-group/radio-group.js';
// BINDINGS
import { TriangulationRequest } from '../../src-tauri/bindings/TriangulationRequest';
import { TriangulationResult } from '../../src-tauri/bindings/TriangulationResult';
import './Sidebar.css';
import { Dimension } from '../../src-tauri/bindings/Dimension';

interface SidebarProps {
  onTriangulationComplete: (numTriangles: number) => void;
  onCreateVertices?: (numVertices: number) => void;
}

export default function Sidebar({ onTriangulationComplete, onCreateVertices }: SidebarProps) {
  const dispatch = useDispatch();
  const dimension = useSelector((state: any) => state.vertexSettings.dimension) as Dimension;
  const [numVertices, setNumVertices] = useState(3);

  async function triangulate() {
    info(`Triangulating ${numVertices} vertices....`);
    const triangulationResult = await invoke<TriangulationResult>("triangulate", {
      request: { num_vertices: numVertices } as TriangulationRequest
    });

    onTriangulationComplete(triangulationResult.num_triangles);
  }

  function handleCreateVertices() {
    if (onCreateVertices) {
      onCreateVertices(numVertices);
    }
  }

  function handleDimensionChange(e: Event) {
    const newMode = (e.currentTarget as SlRadioGroupElement).value as Dimension;
    if (newMode === "TWO") {
      dispatch({ type: 'dimension/set', payload: "TWO" });
    } else if (newMode === "THREE") {
      dispatch({ type: 'dimension/set', payload: "THREE" })
    }
  }

  const minNumVertices = dimension === "TWO" ? 3 : 4;
  const maxNumVertices = dimension === "THREE" ? 1000 : 100;
  return (
    <div className="sidebar">
      <div className="sidebar-section">
        <SlRadioGroup size="small" label="Dimension" name="dimension" value={dimension} onSlChange={handleDimensionChange}>
          <SlRadioButton value="TWO">2D</SlRadioButton>
          <SlRadioButton value="THREE">3D</SlRadioButton>
        </SlRadioGroup>
      </div>
      <div className="sidebar-section">
        <h3>Create Vertices</h3>
        <div className="slider-container">
          <SlRange
            min={minNumVertices}
            max={maxNumVertices}
            value={numVertices}
            onSlChange={(e) => setNumVertices((e.currentTarget as SlRangeElement).value)}
          />
          <div className="slider-value">{numVertices} vertices</div>
        </div>
        <SlButton
          variant="primary"
          onClick={handleCreateVertices}
          disabled={!onCreateVertices}
        >
          Create Vertices
        </SlButton>
      </div>
      <div className="sidebar-section">
        <h3>Triangulation</h3>
        <SlButton variant="primary" onClick={triangulate}>Triangulate</SlButton>
      </div>
    </div>
  )
}