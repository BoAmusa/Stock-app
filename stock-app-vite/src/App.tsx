import * as React from "react";
import "./App.css";
import Landing from "./components/landing/Landing";
import { Routes, Route, Navigate } from "react-router-dom";
import StockBase from "./components/stock-base/StockBase";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/landing" replace />} />
      <Route path="/landing" element={<Landing />} />
      <Route path="/stockbase" element={<StockBase />} />
    </Routes>
  );
};

export default App;
