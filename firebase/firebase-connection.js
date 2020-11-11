const firebase = require("firebase");
const admin = require("firebase-admin")
// const functions = require('firebase-functions');

const app = firebase.initializeApp({
  // credential: admin.credential.applicationDefault(),
    apiKey: "AIzaSyDOq2YPsaH9XecisThyZ8a-TPD_Zgv6jRY",
    authDomain: "log-pruebas.firebaseapp.com",
    databaseURL: "https://log-pruebas.firebaseio.com/"
});


//--------------------------------------------------------------------------------------------------//
// const CUT_OFF_TIME = 1 * 60 * 60 * 1000; // 1 horas en ms
// let now = Date.now();
// let cutoff = now - CUT_OFF_TIME;
// const ref = app.database().ref('/status_moviZ-corriente');
// let old = ref.orderByChild('timeStamp').endAt(cutoff).limitToLast(1);
// let listener = old.on('child_added', function(snapshot) {
//   console.log(snapshot.ref(timeStamp));
//   snapshot.ref.remove();
// });
//------------------------------look references v4------------------------------------------------//


module.exports = app;