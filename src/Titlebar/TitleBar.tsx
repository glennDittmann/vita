import { Window } from "@tauri-apps/api/window";
import { useEffect, useState } from "react";
import "./TitleBar.css";

const appWindow = Window.getCurrent();

export default function TitleBar() {
	const [isMaximized, setIsMaximized] = useState(false);

	useEffect(() => {
		const unlisten = appWindow.onResized(() => {
			appWindow.isMaximized().then(setIsMaximized);
		});
		return () => {
			unlisten.then((fn: () => void) => fn());
		};
	}, []);

	const minimize = () => appWindow.minimize();
	const maximize = () => {
		appWindow.toggleMaximize();
	};
	const close = () => appWindow.close();

	return (
		<div className="titlebar" data-tauri-drag-region>
			<div className="titlebar-left">
				<div className="window-title">Vita</div>
			</div>
			<div className="titlebar-right">
				<button className="titlebar-button" onClick={minimize} type="button">
					<title>Minimize</title>
					<svg width="10" height="1" viewBox="0 0 10 1">
						<title>Minimize</title>
						<path d="M0 0h10v1H0z" />
					</svg>
				</button>
				<button className="titlebar-button" onClick={maximize} type="button">
					{isMaximized ? (
						<svg width="10" height="10" viewBox="0 0 10 10">
							<title>Toggle Maximize</title>
							<path d="M2 1v2H0v7h7V8h2V1H2zm5 6H1V2h6v5z" />
						</svg>
					) : (
						<svg width="10" height="10" viewBox="0 0 10 10">
							<title>Maximize</title>
							<path d="M0 0v10h10V0H0zm9 9H1V1h8v8z" />
						</svg>
					)}
				</button>
				<button className="titlebar-button close" onClick={close} type="button">
					<svg width="10" height="10" viewBox="0 0 10 10">
						<title>Close</title>
						<path d="M6.4 5l2.8-2.8c.4-.4.4-1 0-1.4-.4-.4-1-.4-1.4 0L5 3.6 2.2.8C1.8.4 1.2.4.8.8c-.4.4-.4 1 0 1.4L3.6 5 .8 7.8c-.4.4-.4 1 0 1.4.2.2.4.3.7.3.3 0 .5-.1.7-.3L5 6.4l2.8 2.8c.2.2.4.3.7.3.3 0 .5-.1.7-.3.4-.4.4-1 0-1.4L6.4 5z" />
					</svg>
				</button>
			</div>
		</div>
	);
}
