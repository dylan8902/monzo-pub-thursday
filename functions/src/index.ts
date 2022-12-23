import * as functions from "firebase-functions";

export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});

export const webhook = functions.https.onRequest(async (req, res) => {
  functions.logger.info("Hello logs!", req.body);
  res.status(200).send(req.body.text);
  return;
});
