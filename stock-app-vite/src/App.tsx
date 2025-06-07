import { useState } from "react";
import * as React from "react";
import "./App.css";

const App: React.FC = () => {
  const [title] = useState("Stock App");
  const [subtitle] = useState("A simple stock market app");

  return (
    <>
      <h1>{title}</h1>

      <h2>{subtitle}</h2>
    </>
  );
};

export default App;
