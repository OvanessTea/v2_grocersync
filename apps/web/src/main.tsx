import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./app/App";
import { DemoProvider } from "./app/demo-context";
import "./app/styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  // TODO: Remove all dev text
  <React.StrictMode>
    <BrowserRouter>
      <DemoProvider>
        <App />
      </DemoProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
