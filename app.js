'use strict';
const net = require('net');
const readline = require('readline');
const pipeFunctions = require("./openness.js");
const firebase = require("./firebase/firebase-connection");




let updateDBTime = 5000;

/////   OPEN PIPE READING FROM SIEMENS  ////

// const PIPE_PATH = "\\\\.\\pipe\\HmiRuntime";

// let client = net.connect(PIPE_PATH, () => {
//     console.log('Client: on connection');

//     var Subscribecommand = `{"Message":"SubscribeTag","Params":{"Tags":["status_moviP.corriente","status_moviZ.corriente"]},"ClientCookie":"mySubscription1"}\n`;
//     client.write(Subscribecommand);

//     const rl = readline.createInterface({
//         input: client,
//         crlfDelay: Infinity
//     });

//     rl.on('line', (line) => {
//         let obj = JSON.parse(line);

//         if (obj.Message == 'NotifySubscribeTag') {
//             pipeFunctions.printOnSuccess(obj.Params.Tags);
//         }
//         if (obj.Message == 'ErrorSubscribeTag') {
//             pipeFunctions.printError(obj)
//         }
//         if (obj.Message == 'NotifyUnsubscribeTag') {
//             pipeFunctions.printSuccess(obj);
//         }
//         if (obj.Message == 'ErrorUnsubscribeTag') {
//             pipeFunctions.printOnError(obj);
//         }
//     });
// });

// client.on('end', function () {
//     console.log('on end');
// });







// const admin = require("firebase-admin");
// let serviceAccount = require("./log-pruebas-firebase-adminsdk-ngzfx-de7f696705.json");
// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     databaseURL: "https://log-pruebas.firebaseio.com/"
// })