const firebase = require("firebase");
const admin = require("firebase-admin")
// const functions = require('firebase-functions');

const app = admin.initializeApp({
    // apiKey: "AIzaSyDOq2YPsaH9XecisThyZ8a-TPD_Zgv6jRY",
    // authDomain: "log-pruebas.firebaseapp.com",
    credential: admin.credential.applicationDefault(),
    databaseURL: "https://log-pruebas.firebaseio.com/"
});

// const database = firebase.database();
const adaRef = app.database().ref('/');

adaRef.remove()
  .then(function() {
    console.log("Remove succeeded.")
  })
  .catch(function(error) {
    console.log("Remove failed: " + error.message)
  });

console.log("estoyenapp");




// firebase.database().ref('/').remove('*');
// app.database().ref('/log-pruebas').remove();

// const CUT_OFF_TIME = 2 * 60 * 60 * 1000; // 2 horas en ms

// let ref = app.database().ref('/');
// let now = Date.now();
// let cutoff = now - CUT_OFF_TIME;
// let old = ref.orderByChild('timestamp').endAt(cutoff).limitToLast(1);
// let listener = old.on('child_added', function(snapshot) {
//     snapshot.ref.remove();
// });


// const deleteOldItems = functions.database.ref('/').onWrite(async (change) => {
//     const ref = change.after.ref.parent; // reference to the parent
//     const now = Date.now();
//     const cutoff = now - CUT_OFF_TIME;
//     const oldItemsQuery = ref.orderByChild('timestamp').endAt(cutoff);
//     const snapshot = await oldItemsQuery.once('value');
//     // create a map with all children that need to be removed
//     const updates = {};
//     snapshot.forEach(child => {
//         updates[child.key] = null;
//     });
//     // execute all updates in one go and return the result to end the function
//     return ref.update(updates);
// });


module.exports = app;