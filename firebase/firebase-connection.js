const firebase = require("firebase");

const app = firebase.initializeApp({
    apiKey: "AIzaSyDOq2YPsaH9XecisThyZ8a-TPD_Zgv6jRY",
    authDomain: "log-pruebas.firebaseapp.com",
    databaseURL: "https://log-pruebas.firebaseio.com/"
});

module.exports = app;