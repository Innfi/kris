import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import DummyDashboard from './DummyDashboard';
import StockChart from './chart/StockChart';

const TradyApp = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DummyDashboard />} />
        <Route path="/stock" element={<StockChart />} />
      </Routes>
    </BrowserRouter>
  );
};

export default TradyApp;
