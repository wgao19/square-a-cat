// App.js
import React from "react";
import { RecoilRoot } from "recoil";
import ColorPicker from "./components/ColorPicker";
import Carousel from "./components/Carousel";
import Gallery from "./components/Gallery";
import { About } from "./components/About";

import "./App.css";

const App = () => (
  <RecoilRoot>
    <div className="header-row">
      <About />
    </div>
    <Carousel />
    <Gallery />
    <ColorPicker />
  </RecoilRoot>
);

export default App;
