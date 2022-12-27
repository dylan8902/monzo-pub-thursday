import {onRequest} from "firebase-functions/v2/https";
import {logger} from "firebase-functions/v2";
import {initializeApp} from "firebase/app";
import {
  doc, collection, getDocs, setDoc, getFirestore,
} from "firebase/firestore";

const app = initializeApp();
const ptTestConfig = {
  apiKey: "AIzaSyDPj82SQ8m-NGgPXE-FVlROt-5toR4bzS8",
  authDomain: "pub-tracker-test.firebaseapp.com",
  projectId: "pub-tracker-test",
};
const ptTest = initializeApp(ptTestConfig, "ptTest");
const opts = {cors: true};

export const webhook = onRequest(opts, async (req, res) => {
  logger.info("Hello logs!", req.body);
  res.status(200).send(req.body.text);
  return;
});

export const authorise = onRequest(opts, async (req, res) => {
  logger.info("Hello logs!", req.body);
  const db = getFirestore(app);
  const ref = doc(db, "configuration", "pub-thursday");
  setDoc(ref, req.body)
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

export const locations = onRequest(opts, async (req, res) => {
  const locations: unknown[] = [];
  logger.info("Hello logs!", req.body);
  const db = getFirestore(ptTest);
  const querySnapshot = await getDocs(collection(db, "locations"));
  querySnapshot.forEach((doc) => {
    locations.push(doc.data());
  });
  res.status(200).send({locations: locations});
});
