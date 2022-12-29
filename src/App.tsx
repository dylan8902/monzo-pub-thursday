import React, { useContext } from "react";
import monzo from "./monzo.png";
import pint from "./pint.svg";
import "./App.css";
import { app } from "./Firebase";
import { AuthContext } from "./AuthContext";

const CLIENT_ID = "Monzo%20Integration";

function App() {
  const props = useContext(AuthContext);
  const user = props?.user;
  const config = props?.config;
  const successfulCheckIns = props?.successfulCheckIns || 0;

  const ptWebsite =
    window.location.hostname === "localhost"
      ? "http://localhost:3001"
      : "https://pubthursday.com";
  const redirectUri =
    window.location.hostname === "localhost"
      ? "http://localhost:3000"
      : `https://${app.options.projectId}.web.app/`;
  const requestUri =
    window.location.hostname === "localhost"
      ? `http://127.0.0.1:5001/${app.options.projectId}/us-central1/authorise`
      : `https://${app.options.projectId}.web.app/authorise`;
  const authoriseUrl = `${ptWebsite}/integrations/authorise?client_id=${CLIENT_ID}&request_uri=${requestUri}&redirect_uri=${redirectUri}`;

  return (
    <div className="app">
      <img src={monzo} className="monzo logo" alt="logo" />
      <img src={pint} className="pint logo" alt="logo" />
      <h1>
        Hi{user && ` ${user.displayName}`}, welcome to {user ? "your " : "the "}
        Monzo Pub Thursday Integration
      </h1>
      {user && (
        <>
          {config ? (
            <div className="todo done">
              <p>
                You have authorised your Pub Thursday account ({config.email})
              </p>
              <a href={authoriseUrl}>Re-authorise your account if required</a>
              <code className="debug">{JSON.stringify(config)}</code>
            </div>
          ) : (
            <div className="todo">
              <a href={authoriseUrl}>
                You need to link your Pub Thursday account to this integration
              </a>
            </div>
          )}

          {successfulCheckIns > 0 ? (
            <div className="todo done">
              You have checked-in using your Monzo {successfulCheckIns} time{successfulCheckIns > 1 ? "s" : ""}
            </div>
          ) : (
            <div className="todo">
              Using the{" "}
              <a
                href="https://developers.monzo.com/api/playground"
                rel="noreferrer"
                target="_blank"
              >
                Monzo API Playground
              </a>
              , add the following URL as a new{" "}
              <a href="https://docs.monzo.com/#registering-a-webhook">webhook</a>:
              <code>https://{app.options.projectId}.web.app/webhook</code>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
