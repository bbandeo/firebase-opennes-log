const firebase = require("firebase");

const app = firebase.initializeApp({
    apiKey: "AIzaSyDOq2YPsaH9XecisThyZ8a-TPD_Zgv6jRY",
    authDomain: "log-pruebas.firebaseapp.com",
    databaseURL: "https://log-pruebas.firebaseio.com",
    projectId: "log-pruebas",
    storageBucket: "log-pruebas.appspot.com",
    messagingSenderId: "949445185151",
    appId: "1:949445185151:web:bd05b4bbd12d53583ef94a",
    measurementId: "G-187FCVNT16"
});

module.exports = app;
