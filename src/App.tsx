import React, { useContext } from "react";
import monzo from './monzo.png';
import pint from './pint.svg';
import './App.css';
import { app } from './Firebase';
import { AuthContext } from "./AuthContext";

function App() {

  const user = useContext(AuthContext);

  return (
    <div className="app">
      <img src={monzo} className="monzo logo" alt="logo" />
      <img src={pint} className="pint logo" alt="logo" />
      <h1>
        Welcome to the Monzo Pub Thursday Integration
      </h1>
      <p>
        {JSON.stringify(app)}
      </p>
      <p>
        {JSON.stringify(user)}
      </p>
    </div>
  );
}

export default App;
