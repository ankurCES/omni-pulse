import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import * as THREE from "three";
import { extend } from "@react-three/fiber";

import "core-js";

import App from "./App";
import store from "./store";

extend(THREE);
window.addEventListener("resize", () =>
  render(<App />, document.querySelector("canvas"), {
    events,
    linear: true,
    dpr: 2,
    camera: { fov: 25, position: [0, 0, 6] },
    // https://barradeau.com/blog/?p=621
    // This examples needs WebGL1 (?)
    gl: new THREE.WebGL1Renderer({
      canvas: document.querySelector("canvas"),
      antialias: true,
      alpha: true,
    }),
  })
);

window.dispatchEvent(new Event("resize"));
createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>
);
