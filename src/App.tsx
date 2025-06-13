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

	const handleTriangulationComplete = (numTriangles: number) => {
		setToasts((prev) => [...prev, { id: nextToastId, numTriangles }]);
		setNextToastId((prev) => prev + 1);
	};

	return (
		<main>
			<TitleBar />
			<div className="main-container">
				<div className="content">
					<Sidebar onTriangulationComplete={handleTriangulationComplete} />
					<div className="viewport">
						<Experience />
					</div>
				</div>
				<Footer />
			</div>

			{/* FIXME: there is a console error, when sl alerts disappear from view (NotFoundError: The object can not be found here, fn removeChild) */}
			{toasts.map((toast) => (
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
