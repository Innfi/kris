import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import DummyDashboard from './DummyDashboard';

const TradyApp = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DummyDashboard />} />
      </Routes>
    </BrowserRouter>
  );
};

export default TradyApp;
