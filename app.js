'use strict';
const net = require('net');
const { log } = require('console');
const express = require("express");
const readline = require('readline');
const firebase = require("firebase");
const bodyParser = require("body-parser")

let updateDBTime = 5000;
const PIPE_PATH = "\\\\.\\pipe\\HmiRuntime";

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyDOq2YPsaH9XecisThyZ8a-TPD_Zgv6jRY",
    authDomain: "log-pruebas.firebaseapp.com",
    databaseURL: "https://log-pruebas.firebaseio.com/"
})

//		OPEN PIPE READING FROM SIEMENS		//

function StopSubscription() {
    var Unsubscribecommand = `{"Message":"UnsubscribeTag","ClientCookie":"mySubscription1"}\n`;
    client.write(Unsubscribecommand);
    console.log('Subscription Stopped');
}

let client = net.connect(PIPE_PATH, function () {
    console.log('Client: on connection');

    var Subscribecommand = `{"Message":"SubscribeTag","Params":{"Tags":["status_moviP.corriente","status_moviZ.corriente"]},"ClientCookie":"mySubscription1"}\n`;
    client.write(Subscribecommand);
    //setTimeout(StopSubscription, 905000);

    const rl = readline.createInterface({
        input: client,
        crlfDelay: Infinity
    });

    rl.on('line', (line) => {
        let obj = JSON.parse(line);

        if (obj.Message == 'NotifySubscribeTag') {
            printOnSuccess(obj.Params.Tags);
        }
        if (obj.Message == 'ErrorSubscribeTag') {
            printError(obj)
        }
        if (obj.Message == 'NotifyUnsubscribeTag') {
            printSuccess(obj);
        }
        if (obj.Message == 'ErrorUnsubscribeTag') {
            printOnError(obj);
        }
    });
});

client.on('end', function () {
    console.log('on end');
});

function printSuccess(data) {
    let clientCookie = data.ClientCookie;
    let message = data.Message;
    console.log("\nMessage:" + message + "\nclientCookie: " + clientCookie);
}

function printOnError(data) {
    let message = data.Message;
    let errorCode = data.ErrorCode;
    let errorDescription = data.ErrorDescription;
    let clientCookie = data.ClientCookie;

    console.log("\nMessage" + message + "\n Error: " + errorCode + "\n Description: " + errorDescription + "\nclientCookie: " + clientCookie);
}

function printOnSuccess(data) {

    console.log(data)

    for (var i = 0; i < data.length; i++) {

        let tagName = data[i].Name;
        let value = data[i].Value;
        let qualityCode = data[i].QualityCode;
        let quality = data[i].Quality;
        let timeStamp = data[i].TimeStamp;
        let errorCode = data[i].ErrorCode;
        let changed = data[i].hasChanged;
        let errorDescription = data[i].ErrorDescription;
        let time = parseInt((new Date(timeStamp).getTime() / 1000).toFixed(0));
        let longTime = parseInt((new Date(timeStamp).getTime()).toFixed(0));
        let title = tagName.replace(".", "-");

        firebase.database().ref(`${longTime}_${title}`).set({
            "ntagName": tagName,
            "tagValue": value,
            "QualityCode": qualityCode,
            "Quality": quality,
            "timeStamp": timeStamp,
            "tagValue": value,
            "hasChanged": changed
        });
    }
}

function printError(data) {

    firebase.database().ref(`${longTime}_error`).set({
        "message": data.Message,
        "errorCode": data.ErrorCode,
        "errorDescription": data.ErrorDescription,
        "clientCookie": data.ClientCookie
    });

    console.log("\nMessage" + message + "\nclientCookie: " + clientCookie + "\n Error: " + errorCode + "\n Description: " + errorDescription);
}