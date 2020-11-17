const net = require('net');
const fn = require('./buffer');
const readline = require('readline');
const pipeFunctions = require("./pipeFunctions");
const firebase = require("./firebase-connection");
const PIPE_PATH = "\\\\.\\pipe\\HmiRuntime";

const reconnMinutes = 3;
const reconnTime = 1000 * 60 * reconnMinutes;

///   CONEXIÓN OPEN PIPE SIEMENS  ////
const connect = () => {
    let client = net.connect(PIPE_PATH, () => {
        var Subscribecommand = `{"Message":"SubscribeTag","Params":{"Tags":["transLog_times.ID","transLog_tasks.ID"]},"ClientCookie":"mySubscription1"}\n`;
        client.write(Subscribecommand);
        const timeString = fn.formatDateNow();
        firebase.database().ref(fn.userNum).child(`/Eventos/pipe-ConnectionSuccess/${timeString}`).set({
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
        const timeString = fn.formatDateNow();
        console.log(timeString + ` Error de conexión con runtime, reintentando en ${reconnMinutes} minutos.`);
        firebase.database().ref(fn.userNum).child(`/Eventos/pipe-ConnectionError/${timeString}`).set({
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
        const timeString = fn.formatDateNow();
        firebase.database().ref(fn.userNum).child(`Eventos/pipe-End/${timeString}`).set({
            "Descripción": "Se cerró la conexión con RT",
            "server_timestamp": {
                ".sv": "timestamp"
            }
        });
        console.log('FINALIZÓ RUNTIME');
        connect();
    });
};

module.exports = { connect };

