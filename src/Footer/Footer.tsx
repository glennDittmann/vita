import { useDispatch, useSelector } from 'react-redux';
import SlSwitch from '@shoelace-style/shoelace/dist/react/switch/index.js';
import './Footer.css';

export default function Footer() {
  const dispatch = useDispatch();
  const axisActive = useSelector((state: any) => state.experienceSettings.axisActive)
  const gridActive = useSelector((state: any) => state.experienceSettings.gridActive)

  const handleGridChange = () => {
    if (gridActive) {
      dispatch({ type: 'grid/deactivate' });
    } else {
      dispatch({ type: 'grid/activate' });
    }
  };

  const handleAxisChange = () => {
    if (axisActive) {
      dispatch({ type: 'axis/deactivate' });
    } else {
      dispatch({ type: 'axis/activate' });
    }
  };

  return (
    <footer className="footer">
      <div className="footer-controls">
        <div className="control">
          <SlSwitch checked={gridActive} onSlChange={handleGridChange}>Grid</SlSwitch>
        </div>
        <div className="control">
          <SlSwitch checked={axisActive} onSlChange={handleAxisChange}>Axis</SlSwitch>
        </div>
      </div>
    </footer>
  );
}