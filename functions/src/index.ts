import {onRequest} from "firebase-functions/v2/https";
import {logger} from "firebase-functions/v2";
import * as admin from "firebase-admin";
import {initializeApp} from "firebase/app";
import {
  getFirestore,
  query,
  where,
  getDocs,
  collection,
} from "firebase/firestore";
import {response} from "express";

/**
 * INTERFACES
 */

interface PubThursdayLocation {
  id: string;
  lat: number;
  lon: number;
  name: string;
}


/**
 * TEST DATA
 */

const EXAMPLE_MONZO = {
  type: "transaction.created",
  data: {
    id: "tx_00009siHaNW8bi1v59HdY1",
    created: "2020-03-06T00:10:19.11Z",
    amount: -1500,
    fees: {},
    currency: "GBP",
    merchant: {
      id: "merch_00009JRODf5MtoDPEqBed7",
      group_id: "grp_00009rTcQlE0kGfLRkwHHn",
      name: "Lab 22",
      logo: "",
      emoji: "",
      category: "entertainment",
      online: false,
      atm: false,
      address: {
        short_formatted: "22 Caroline Street, Cardiff, Cf10 1fg",
        city: "Cardiff",
        latitude: 51.4782679,
        longitude: -3.1759621,
        zoom_level: 17,
        approximate: false,
        formatted: "22 Caroline Street, Cardiff, Cf10 1fg",
        address: "22 Caroline Street",
        region: "",
        country: "GB",
        postcode: "CF10 1FG",
      },
      disable_feedback: false,
      metadata: {},
    },
    notes: "",
    metadata: {
      p2p_initiator: "payment-request",
      p2p_transfer_id: "p2p_00009siHaM2K74rwDSwi49",
      payee_id: "payee_00009mB1qsHRi7kgATcYdd",
      payment_request_id: "payreq_00009siHXPm3lBj2oaOqKP",
    },
    labels: null,
    attachments: null,
    international: null,
    category: "entertainment",
    categories: {
      entertainment: -1500,
    },
    is_load: false,
    settled: "2020-03-06T00:10:19.11Z",
    local_amount: -1500,
    local_currency: "GBP",
    scheme: "p2p_payment",
    originator: true,
    include_in_spending: true,
    can_be_excluded_from_breakdown: true,
    can_be_made_subscription: false,
    can_split_the_bill: true,
    can_add_to_tab: false,
    can_match_transactions_in_categorization: true,
    amount_is_pending: false,
    atm_fees_detailed: null,
    parent_account_id: "",
  },
};


/**
 *  FUNCTIONS
 */

const bad = (error: string, problem: unknown, res: typeof response) => {
  console.error(error, problem);
  res.status(200).send({error, problem: JSON.stringify(problem)});
};

const bonus = (name: string):string => {
  return `⭐ ${name} ⭐`;
};


/**
 * CONFIGURATION
 */

admin.initializeApp();
const ptAppConfig = {
  apiKey: "AIzaSyDPj82SQ8m-NGgPXE-FVlROt-5toR4bzS8",
  authDomain: "pub-tracker-test.firebaseapp.com",
  projectId: "pub-tracker-test",
};
const ptApp = initializeApp(ptAppConfig, "ptApp");
const opts = {cors: true, maxInstances: 2};


/**
 * ENDPOINTS
 */

/**
 * Recieve a webhook from Monzo
 */
export const webhook = onRequest(opts, async (req, res) => {
  logger.info("Hello logs!", req.body);
  res.status(200).send(req.body.text);
  return;
});

/**
 * Recieve a user's configuration blob and pop it in the store
 */
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
            bad("Failed to set configuration", error, res);
          }
      );
});

/**
 * An example monzo webhook to test/demo functionality
 */
export const test = onRequest(opts, (req, res) => {
  // This is an example transaction at a pub
  req.body = EXAMPLE_MONZO;

  // Only process new transactions
  if (req.body.type != "transaction.created") {
    bad("Webhook type is not supported", req.body.type, res);
    return;
  }

  // Pull out useful information from webhook
  const monzoName = req.body.data.merchant.name;
  const monzoLat = req.body.data.merchant.address.latitude;
  const monzoLng = req.body.data.merchant.address.longitude;
  if (monzoName === undefined) {
    bad("Missing data.merchant.name", req.body, res);
    return;
  }
  if (monzoLat === undefined) {
    bad("Missing data.merchant.address.latitude", req.body, res);
    return;
  }
  if (monzoLng === undefined) {
    bad("Missing data.merchant.address.longitude", req.body, res);
    return;
  }

  // Find a PT location based on the name
  const locations: PubThursdayLocation[] = [];
  const db = getFirestore(ptApp);
  const search = query(
      collection(db, "locations"),
      where("name", "in", [bonus(monzoName), monzoName])
  );
  let locationId = "";
  getDocs(search).then((snapshot) => {
    snapshot.forEach((doc) => {
      const pub = doc.data() as PubThursdayLocation;
      locations.push(pub);
      // Choose bonus pub
      if (pub.name.startsWith("⭐")) {
        locationId = pub.id;
      }
    });
    // Choose first matching pub if nothing yet
    if (locationId == "" && locations.length > 0) {
      locationId = locations[0].id;
    }
    console.log(`Pub Thursday Pubs called ${monzoName}`, locations);
    console.log(`Chosen ${locationId} as best match`);

    // Get Pub Thursday config
    const db = admin.firestore();
    db.collection("configuration")
        .doc("pub-thursday")
        .get()
        .then(
            (doc) => {
              const ptConfig = doc.data();
              console.log("Pub Thursday Configuration", ptConfig);
              if (ptConfig?.stsTokenManager?.refreshToken === undefined) {
                bad("Missing stsTokenManager.refreshToken", ptConfig, res);
                return;
              }
              const refreshToken = ptConfig.stsTokenManager.refreshToken;

              // Refresh access token
              const refreshUrl = `https://securetoken.googleapis.com/v1/token?key=${ptAppConfig.apiKey}`;
              const rrefreshOptions = {
                method: "POST",
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
                },
                body: `grant_type=refresh_token&refresh_token=${refreshToken}`,
              };
              fetch(refreshUrl, rrefreshOptions)
                  .then((refreshResult) => {
                    console.info("Refresh", refreshResult);
                    refreshResult.json().then((refreshData) => {
                      const accessToken = refreshData.access_token;

                      // Check-in
                      const checkInUrl = `https://us-central1-${ptAppConfig.projectId}.cloudfunctions.net/checkIn`;
                      const checkIn = {
                        data: {
                          selectedLocation: locationId,
                          userLocation: {
                            latitude: monzoLat,
                            longitude: monzoLng,
                          },
                        },
                      };
                      const checkInOptions = {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                          "Authorization": `Bearer ${accessToken}`,
                        },
                        body: JSON.stringify(checkIn),
                      };
                      console.info("Check-in", checkInOptions);
                      fetch(checkInUrl, checkInOptions)
                          .then((checkInResult) => {
                            console.info("Check-in", checkInResult);
                            checkInResult.json().then((checkInData) => {
                              res.status(200).send({checkIn, checkInData});
                              return;
                            });
                          })
                          .catch((error) => {
                            bad("Unable to check-in", error, res);
                            return;
                          });
                    });
                  })
                  .catch((error) => {
                    bad("Unable to refresh access token", error, res);
                    return;
                  });
            },
            (error) => {
              bad("Failed to get Pub Thursday configuration", error, res);
              return;
            }
        );
  });
});
