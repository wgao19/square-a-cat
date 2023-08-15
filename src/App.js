// App.js
import React from 'react';
import { RecoilRoot } from 'recoil';
import ColorPicker from './components/ColorPicker';
import Carousel from './components/Carousel';
import Gallery from './components/Gallery';

import "./App.css";

const App = () => (
  <RecoilRoot>
    <Carousel />
    <Gallery />
    <ColorPicker />
  </RecoilRoot>
);

export default App;
