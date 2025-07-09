import Experience from "./Experience/Experience";
import Footer from "./Footer/Footer";
import Sidebar from "./Sidebar/Sidebar";
import TitleBar from "./Titlebar/TitleBar";
import "./reset.css";
import "./styles.css";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

export default function App() {
	return (
		<MantineProvider defaultColorScheme="dark">
			<Notifications limit={5} />
			<main>
				<TitleBar />
				<div className="main-container">
					<div className="content">
						<Sidebar />
						<div className="viewport">
							<Experience />
						</div>
					</div>
					<Footer />
				</div>
			</main>
		</MantineProvider>
	);
}
