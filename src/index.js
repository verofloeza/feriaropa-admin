import App from "App";
import { BrowserRouter } from "react-router-dom";
import { MaterialUIControllerProvider } from "context";
import React from "react";
import { createRoot } from "react-dom/client";

const container = document.getElementById("app");
const root = createRoot(container);

root.render(
  <BrowserRouter>
    <MaterialUIControllerProvider>
      <App />
    </MaterialUIControllerProvider>
  </BrowserRouter>
);
