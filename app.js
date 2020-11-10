'use strict';
const net = require('net');
const readline = require('readline');
const pipeFunctions = require("./pipeFunctions.js");
const firebase = require("./firebase/firebase-connection");

console.log("ARRANQUEYROS");


const uploadTime = 5000;
const reconnTime = 5000;


///   OPEN PIPE READING FROM SIEMENS  ////

const PIPE_PATH = "\\\\.\\pipe\\HmiRuntime";
const connect = () => {
    let client = net.connect(PIPE_PATH, () => {
        console.log('Runtime: Connected');
        var Subscribecommand = `{"Message":"SubscribeTag","Params":{"Tags":["status_moviP.corriente","status_moviZ.corriente"]},"ClientCookie":"mySubscription1"}\n`;
        client.write(Subscribecommand);
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



setInterval(() => {
    console.log("Paso INTERAVLO POR AQUI");
}, 2500);

connect()