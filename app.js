'use strict';
const net = require('net');
const readline = require('readline');
const buffer = require('./firebase/buffer.js');
const pipeFunctions = require("./pipeFunctions");
const firebase = require("./firebase/firebase-connection");


let uploadFeatures = [];
const reconnTime = 5000;
const uploadTime = 5000;
console.log("Starting..");

const formatDateNow = () => {
    const dateObject = new Date(Date.now());
    const hours = dateObject.getHours();
    const minutes = dateObject.getMinutes();
    const seconds = dateObject.getSeconds();
    const timeString = `${hours}_${minutes}_${seconds}`;
    return timeString;
}

if (true) { firebase.database().ref().remove(); }

///   OPEN PIPE READING FROM SIEMENS  ////

const PIPE_PATH = "\\\\.\\pipe\\HmiRuntime";

const connect = () => {
    let client = net.connect(PIPE_PATH, () => {
        console.log('Runtime: Connected');
        var Subscribecommand = `{"Message":"SubscribeTag","Params":{"Tags":["status_moviP.corriente","status_moviZ.corriente"]},"ClientCookie":"mySubscription1"}\n`;
        client.write(Subscribecommand);
        // ACA ESCRIBIR LOG DE PIPE CONECTADO
        const rl = readline.createInterface({
            input: client,
            crlfDelay: Infinity
        });
        rl.on('line', (line) => {
            let obj = JSON.parse(line);

            if (obj.Message == 'NotifySubscribeTag') {
                pipeFunctions.printOnSuccess(obj.Params.Tags);
            }
            if (obj.Message == 'ErrorSubscribeTag') {
                pipeFunctions.printError(obj)
            }
            if (obj.Message == 'NotifyUnsubscribeTag') {
                pipeFunctions.printSuccess(obj);
            }
            if (obj.Message == 'ErrorUnsubscribeTag') {
                pipeFunctions.printOnError(obj);
            }
        });
    });

    client.on('error', (err) => {
        console.log(`Error de conexión con runtime, intentando en ${reconnTime / 1000} segundos.`);
        const timeString = formatDateNow();
        firebase.database().ref(`Eventos`).child("pipe-connErr").child(timeString).set({
            "error": "Error de conexión con runtime",
        });
        setTimeout(() => {
            console.log("Reconnecting..");
            connect();
        }, reconnTime);
    });

    client.on('close', (e) => {
        console.log("CLOSED");
        // ACA ESCRIBIR LOG DE RUNTIME CERRADO
        client.setTimeout(() => {
            client.destroy();
        }, reconnTime);
    });

    client.on('end', () => {
        //      ACA ESCRIBIR LOG DE RUNTIME FINALIZADO
        console.log('FINALIZÓ RUNTIME');
        connect();
    });
}

connect();

setInterval(() => {

    let connectedRef = firebase.database().ref('.info/connected');
    connectedRef.on('value', function (snap) {
        if (snap.val() === true) {
            uploadFeatures = buffer.readValues();
            console.log(uploadFeatures.length);
            if (uploadFeatures.length > 0) {
                buffer.deleteValues();
                uploadFeatures.forEach(e => {
                     const timeString = formatDateNow();
                    let title = e.tagName.replace(".", "-");
                    firebase.database().ref(`${title}`).child(timeString).set({
                        "tagName": e.tagName,
                        "tagValue": e.tagValue,
                        "Quality": e.Quality,
                        "server_timestamp": {
                            ".sv": "timestamp"
                        },
                        "system_timestamp": e.timeStamp,
                        "system_date": e.date,
                        "hasChanged": e.hasChanged
                    });
                });
                console.log("Uploaded..");
            } else console.log("No data from Pipe");
        } else console.log("Conexión con DB fracasó");
    });
}, uploadTime);


// Si está conectado genero un campo users - nro - conectado
var myConnectionsRef = firebase.database().ref('users/299/connections');
var connectedRef = firebase.database().ref('.info/connected');
connectedRef.on('value', function (snap) {
    if (snap.val() === true) {
        var con = myConnectionsRef.push();
        con.onDisconnect().remove();
        con.set(true);
    }
});