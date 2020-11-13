'use strict';
const net = require('net');
const readline = require('readline');
const buffer = require('./js/buffer.js');
const pipeFunctions = require("./js/pipeFunctions");
const firebase = require("./js/firebase-connection");
const PIPE_PATH = "\\\\.\\pipe\\HmiRuntime";
const userNum = 299;
console.log("Starting..");
let uploadFeatures = [];
let reconnMinutes = 3;
let reconnTime = 100 * 60 * reconnMinutes;
let uploadTime = 5000;

const formatDateNow = () => {
    const dateObject = new Date(Date.now());
    const hours = dateObject.getHours();
    const minutes = dateObject.getMinutes();
    const seconds = dateObject.getSeconds();
    const timeString = `${hours}_${minutes}_${seconds}`;
    return timeString;
}


// DELETE DATABASE
//if (true) { firebase.database().ref().remove(); }

///   CONEXIÓN OPEN PIPE SIEMENS  ////
const connect = () => {
    let client = net.connect(PIPE_PATH, () => {
        var Subscribecommand = `{"Message":"SubscribeTag","Params":{"Tags":["status_moviP.corriente","status_moviZ.corriente"]},"ClientCookie":"mySubscription1"}\n`;
        client.write(Subscribecommand);
        const timeString = formatDateNow();
        firebase.database().ref(userNum).child(`/Eventos/pipe-ConnectionSuccess/${timeString}`).set({
            "Descripcion": "Conexión establecida con RT",
            "server_timestamp": {
                ".sv": "timestamp"
            }
        });
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
        client.destroy();
        console.log(`Error de conexión con runtime, reintentando en ${reconnMinutes} minutos.`);
        const timeString = formatDateNow();
        firebase.database().ref(userNum).child(`/Eventos/pipe-ConnectionError/${timeString}`).set({
            "Descripcion": "Error de conexión con RT",
            "server_timestamp": {
                ".sv": "timestamp"
            }
        });
        setTimeout(() => {
            console.log("Reconnecting..");
            connect();
        }, reconnTime);
    });

    client.on('close', (e) => {
        console.log("CLOSED");
        client.setTimeout(() => {
            client.destroy();
        }, reconnTime);
    });

    client.on('end', () => {
        const timeString = formatDateNow();
        firebase.database().ref(userNum).child(`Eventos/pipe-End/${timeString}`).set({
            "Descripción": "Se cerró la conexión con RT",
            "server_timestamp": {
                ".sv": "timestamp"
            }
        });
        console.log('FINALIZÓ RUNTIME');
        connect();
    });
}
connect();

// INTERVALO DE ESCRITURA EN DB
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
                    firebase.database().ref(`${userNum}/${title}`).child(timeString).set({
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



// IF conectado genero un documento users/nro/conectado
var myConnectionsRef = firebase.database().ref('users/299/connections');
var connectedRef = firebase.database().ref('.info/connected');
connectedRef.on('value', function (snap) {
    if (snap.val() === true) {
        var con = myConnectionsRef.push();
        con.onDisconnect().remove();
        con.set(true);
    }
});