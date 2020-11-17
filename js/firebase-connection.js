const firebase = require("firebase");
const fn = require("./buffer")

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

// IF conectado genero un documento users/nro/conectado
var myConnectionsRef = firebase.database().ref(`users/${fn.userNum}/connections`);
var connectedRef = firebase.database().ref('.info/connected');
connectedRef.on('value', function (snap) {
    if (snap.val() === true) {
        var con = myConnectionsRef.push();
        con.onDisconnect().remove();
        con.set(true);
    }
});


module.exports = app;
