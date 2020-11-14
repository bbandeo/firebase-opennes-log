
// GET TIME FROM FIREBASE

firebase.database().ref("/.info/serverTimeOffset").on('value', (offset) => {
    var offsetVal = offset.val() || 0;
    var serverTime = Date.now() + offsetVal;
    console.log(serverTime);
});

// THIS WAY GETS A REFERENCE TO TIMESTAMP DB; NOT THE ACTUAL TIMESTAMP
const fbtime = require("firebase/app");
let firebaseTimeStamp = fbtime.database.ServerValue.TIMESTAMP.timestamp
console.log(firebaseTimeStamp);