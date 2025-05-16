import { useState } from 'react';
import SlSwitch from '@shoelace-style/shoelace/dist/react/switch/index.js';
import './Footer.css';

interface FooterProps {
  onGridChange: (show: boolean) => void;
  onAxisChange: (show: boolean) => void;
}

export default function Footer({ onGridChange, onAxisChange }: FooterProps) {
  const [showGrid, setShowGrid] = useState(true);
  const [showAxis, setShowAxis] = useState(true);

  const handleGridChange = (e: Event) => {
    const checked = (e.currentTarget as HTMLInputElement).checked;
    setShowGrid(checked);
    onGridChange(checked);
  };

  const handleAxisChange = (e: Event) => {
    const checked = (e.currentTarget as HTMLInputElement).checked;
    setShowAxis(checked);
    onAxisChange(checked);
  };

  return (
    <footer className="footer">
      <div className="footer-controls">
        <div className="control">
          <SlSwitch checked={showGrid} onSlChange={handleGridChange}>Grid</SlSwitch>
        </div>
        <div className="control">
          <SlSwitch checked={showAxis} onSlChange={handleAxisChange}>Axis</SlSwitch>
        </div>
      </div>
    </footer>
  );
}