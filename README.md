# Monzo - Pub Thursday

Private Firebase project to auto check-in to Pub Thursday using your Monzo

## Why a seperate project
To keep your Monzo transactions private to you

## Dependencies
* Monzo account
* Google account
* Pub Thursday account
* Google Cloud Billing Account
* Node 16
* Firebase CLI

## Setup
* Fork this repository/create from template
* Create a new firebase project https://console.firebase.google.com/
* Update to Blaze plan to enable Cloud Functions
* Enable Authentication and add Google as Sign-in provider
* Enable Firestore and switch to Native Mode
* Add web app and update `src/Firebase.ts` with your project configuration
* Update `firebase.rc` with project ID
* Run `firebase login` to login to Google account
* Run `firebase deploy` to deploy project
* Open the new web app and login with your Google account
* Migrate Authentication to Identity Platform
* Update Authentication User Action settings to disable sign-up and deletes to secure your project
* Login to Monzo API Playground https://developers.monzo.com/api/playground
* Use the URL generated from your projects web app to create a webhook

## Usage
* Pay for a pint in a pub on a Thursday and you should be checked in to the pub if it has been linked
