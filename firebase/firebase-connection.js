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
const CUT_OFF_TIME = 0.02 * 60 * 60 * 1000; // 1 horas en ms
let now = Date.now();
let cutoff = now - CUT_OFF_TIME;
console.log(cutoff);

const ref = app.database().ref('/status_moviZ-corriente');

// ref.once('value', (snapshot) => {
//     snapshot.forEach((child) => {
//       if ( (Number(child.val()['timeStamp'])) <= cutoff ) {
//         child.ref.remove();
//       }
//     })
// });

let old = ref.orderByChild('timeStamp').endAt(cutoff).limitToLast(1);
let listener = old.on('child_added', function(snapshot) {
  console.log(snapshot.ref(timeStamp));
  snapshot.ref.remove();
});
//--------------------------------------------------------------------------------------------------//


//--------------------------------------------------------------------------------------------------//
// exports.removeOldMessages = functions.https.onRequest((req, res) => {
//   const timeNow = Date.now();
//   const messagesRef = admin.database().ref('/messages');
//   messagesRef.once('value', (snapshot) => {
//       snapshot.forEach((child) => {
//           if ((Number(child.val()['timestamp']) + Number(child.val()['duration'])) <= timeNow) {
//               child.ref.set(null);
//           }
//       });
//   });
//   return res.status(200).end();
// });
//--------------------------------------------------------------------------------------------------//

//--------------------------------------------------------------------------------------------------//
// adaRef.remove()
//   .then(function() {
//     console.log("Remove succeeded.")
//   })
//   .catch(function(error) {
//     console.log("Remove failed: " + error.message)
//   });
//--------------------------------------------------------------------------------------------------//
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
//--------------------------------------------------------------------------------------------------//

module.exports = app;