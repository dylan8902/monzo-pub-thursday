import React, { useContext } from "react";
import monzo from "./monzo.png";
import pint from "./pint.svg";
import "./App.css";
import { app } from "./Firebase";
import { AuthContext } from "./AuthContext";

const PUB_THURSDAY_URL = 'https://pubthursday.com/integrations/authorise';
const CLIENT_ID = 'Monzo%20Integration';
const REQUEST_URI = `https://${app.options.projectId}.web.app/authorise`;
const REDIRECT_URI = `https://${app.options.projectId}.web.app/`;

function App() {
  const props = useContext(AuthContext);
  const user = props?.user;
  const config = props?.config;
  const authoriseUrl = `${PUB_THURSDAY_URL}?client_id=${CLIENT_ID}&request_uri=${REQUEST_URI}&redirect_uri=${REDIRECT_URI}`;

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
          <code>https://{app.options.projectId}.web.app/webhook</code>

          {config ? (
            <>
              <p>
                Any Monzo transactions created on a Pub Thursday in a valid pub
                will auto check-in your account ({user.email}) on the app.
              </p>
              <code>{JSON.stringify(config)}</code>
            </>
          ) : (
            <p>
              <a href={authoriseUrl}>
                You need to link your Pub Thursday account to this integration
              </a>
            </p>
          )}
        </>
      )}
    </div>
  );
}

export default App;
