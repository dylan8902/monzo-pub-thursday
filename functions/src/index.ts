import {onRequest} from "firebase-functions/v2/https";
import {logger} from "firebase-functions/v2";
import * as admin from "firebase-admin";

admin.initializeApp();
const opts = {cors: true};

export const webhook = onRequest(opts, async (req, res) => {
  logger.info("Hello logs!", req.body);
  res.status(200).send(req.body.text);
  return;
});

export const authorise = onRequest(opts, async (req, res) => {
  logger.info("Hello logs!", req.body);
  const db = admin.firestore();
  db.collection("configuration")
      .doc("pub-thursday")
      .set(req.body)
      .then(
          () => {
            console.log("Set configuration", req.body);
            res.status(200).send({message: "Added config", config: req.body});
          },
          (error) => {
            console.error("Failed to set configuration", error);
            res.status(500).send({message: `Failed: ${error}`});
          }
      );
});
