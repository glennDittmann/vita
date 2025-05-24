import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "./store/store.ts";
import App from "./App";
import { Leva } from "leva";
// SHOELACE setup
import '@shoelace-style/shoelace/dist/themes/light.css';
import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path.js';
setBasePath('https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.20.1/cdn/');
// TAURI log to FE console
import { attachConsole } from '@tauri-apps/plugin-log';
await attachConsole(); // call detach() if you do not want to print logs to the console anymore

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Leva collapsed />
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);