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
        setTimeout(() => {
            console.log("Reconnecting..");
            connect();
        }, reconnTime);
    });

    client.on('close', (e) => {
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

    uploadFeatures = buffer.readAndDeleteValues();
    uploadFeatures.forEach(e => {
        const dateObject = new Date(e.timeStamp);
        const hours = dateObject.getHours();
        const minutes = dateObject.getMinutes();
        const seconds = dateObject.getSeconds();
        const timeString = `${hours}_${minutes}_${seconds}`;
        let title = e.tagName.replace(".", "-");
            firebase.database().ref(`${title}`).child(timeString).set({
                "tagName": e.tagName,
                "tagValue": e.tagValue,
                "Quality": e.Quality,
                "server_timestamp":{  
                    ".sv":"timestamp"   },
                "system_timestamp": e.timeStamp,
                "system_date": e.date,
                "hasChanged": e.hasChanged
            });
    });    
    console.log("Uploaded..");
}, uploadTime);

