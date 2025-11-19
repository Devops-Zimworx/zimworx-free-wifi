import React, { useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  useEffect(() => {
    const isViteRuntime =
      typeof import.meta !== "undefined" && Boolean(import.meta.env);
    const diagnosticPayload = isViteRuntime
      ? {
          runtime: "vite",
          mode: import.meta.env.MODE,
          baseUrl: import.meta.env.BASE_URL,
          customEnvKeys: Object.keys(import.meta.env).filter((key) =>
            key.startsWith("VITE_")
          ),
        }
      : {
          runtime: "cra",
          nodeEnv: process.env.NODE_ENV,
          publicUrl: process.env.PUBLIC_URL,
          customEnvKeys: Object.keys(process.env || {}).filter((key) =>
            key.startsWith("REACT_APP_")
          ),
        };

    console.info("[diagnostic] environment snapshot", diagnosticPayload);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://zimworx.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Zimworx - Free WiFi
        </a>
      </header>
    </div>
  );
}

export default App;
