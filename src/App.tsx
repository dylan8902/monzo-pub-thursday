import React, { useContext } from "react";
import monzo from "./monzo.png";
import pint from "./pint.svg";
import "./App.css";
import { app } from "./Firebase";
import { AuthContext } from "./AuthContext";

function App() {
  const props = useContext(AuthContext);
  const user = props?.user;
  const config = props?.config;

  return (
    <div className="app">
      <img src={monzo} className="monzo logo" alt="logo" />
      <img src={pint} className="pint logo" alt="logo" />
      <h1>
        Hi{user && ` ${user.displayName}`}, welcome to {user ? `your` : "the"}{" "}
        Monzo Pub Thursday Integration
      </h1>
      {user && (
        <>
          <p>
            Using the{" "}
            <a
              href="https://developers.monzo.com/api/playground"
              rel="noreferrer"
              target="_blank"
            >
              Monzo API Playground
            </a>
            , add the following URL as a new webhook:
          </p>
          <code>
            https://us-central1-{app.options.projectId}
            .cloudfunctions.net/webhook
          </code>

          {config ? (
            <>
              <p>
                Any Monzo transactions created on a Pub Thursday in a valid pub
                will auto check-in your account ({user.email}) on the app.
              </p>
              <code>{JSON.stringify(config)}</code>
            </>
          ) : (
            <p>You need to link your Pub Thursday account to this integration</p>
          )}
        </>
      )}
    </div>
  );
}

export default App;
