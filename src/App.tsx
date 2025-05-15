// REACT
import { useState } from "react";
// COMPONENTS
import Alert from "./Alert";
import Experience from "./Experience/Experience";
import Footer from "./Footer/Footer";
import Sidebar from "./Sidebar/Sidebar";
import TitleBar from "./Titlebar/TitleBar";
// CSS
import "./reset.css";
import "./styles.css";

interface ToastItem {
  id: number;
  numTriangles: number;
}

export default function App() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [nextToastId, setNextToastId] = useState(0);
  const [vertexCount, setVertexCount] = useState(0);

  const handleTriangulationComplete = (numTriangles: number) => {
    setToasts(prev => [...prev, { id: nextToastId, numTriangles }]);
    setNextToastId(prev => prev + 1);
  };

  const handleCreateVertices = (count: number) => {
    setVertexCount(count);
  };

  return (
    <main>
      <TitleBar />
      <div className="main-container">
        <div className="content">
          <Sidebar
            onTriangulationComplete={handleTriangulationComplete}
            onCreateVertices={handleCreateVertices}
          />
          <div className="viewport">
            <Experience vertexCount={vertexCount} />
          </div>
        </div>
        <Footer />
      </div>

      {toasts.map(toast => (
        <Alert
          key={toast.id}
          variant="success"
          title="Success"
          message={`Triangulation with ${toast.numTriangles} triangles computed.`}
        />
      ))}
    </main>
  );
}
