const firebase = require("firebase");
const admin = require("firebase-admin")
// const functions = require('firebase-functions');

const app = firebase.initializeApp({
  // credential: admin.credential.applicationDefault(),
    apiKey: "AIzaSyDOq2YPsaH9XecisThyZ8a-TPD_Zgv6jRY",
    authDomain: "log-pruebas.firebaseapp.com",
    databaseURL: "https://log-pruebas.firebaseio.com/"
});


module.exports = app;