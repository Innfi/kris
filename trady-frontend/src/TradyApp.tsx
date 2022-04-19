import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Intro from './intro';
import StockEntry from './chart/entry';

const TradyApp = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="/stock" element={<StockEntry />} />
      </Routes>
    </BrowserRouter>
  );
};

export default TradyApp;
