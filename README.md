# Monzo - Pub Thursday

Private Firebase project to auto check-in to Pub Thursday using your Monzo

## Why a separate project
To keep your Monzo transactions private to you

## Dependencies
* Monzo account
* Google account
* Pub Thursday account
* Google Cloud Billing Account
* Node 18
* Firebase CLI

## Setup
* Setup a new project from the firebase console (https://console.firebase.google.com/):
  * Update to Blaze plan to enable Cloud Functions
  * Enable Authentication and add Google as Sign-in provider
  * Enable Firestore and switch to Native Mode
  * Add a web app as a platform
* Fork this repository/create from template and clone locally:
  * Update `firebase.rc` with project ID
  * Update `src/Firebase.ts` with your web app configuration
  * Run `firebase login` to login to Google account
  * Run `firebase deploy` to deploy project
* Login to your new web app with your Pub Thursday Google account
* Back in the firebase console:
  * Migrate Authentication to Identity Platform
  * Update Authentication User Action settings to disable sign-up and deletes to secure your project to only you
* Setup the Monzo webhook
  * Login to Monzo API Playground https://developers.monzo.com/api/playground
  * Use the URL generated from your web app to create a webhook
* Authorise access to Pub Thursday:
  * Follow the link on your web app to request access to your Pub Thursday account
  * Approve the request

## Usage
* Pay for a pint in a pub on a Thursday and you should be checked in to the pub if it has been linked


## Development setup

* Run your web project locally on http://localhost:3000:
```sh
npm run start
```

* Build and run your functions locally on http://localhost:5001:
```sh
cd functions
npm run build
cd ..
firebase emulators:start
```

* Run test pub-tracker-web on http://localhost:3001:
```sh
cd /path/to/pub-tracker-web
PORT=3001 npm run start
```
