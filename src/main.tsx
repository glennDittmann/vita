import { Leva } from "leva";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import store from "./store/store.ts";
import { attachConsole } from "@tauri-apps/plugin-log"; // TAURI log to FE console

await attachConsole(); // call detach() if you do not want to print logs to the console anymore

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<Leva collapsed />
		<Provider store={store}>
			<App />
		</Provider>
	</React.StrictMode>,
);
