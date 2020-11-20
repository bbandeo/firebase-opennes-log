const net = require("net");
const fn = require("./buffer");
const readline = require("readline");
const pipeFunctions = require("./pipeFunctions");
const firebase = require("./firebase-connection");
const PIPE_PATH = "\\\\.\\pipe\\HmiRuntime";
const reconnMinutes = 3;
const reconnTime = 1000 * 60 * reconnMinutes;

let tags =
  '["shuttleLog_task.ID","shuttleLog_task.command.go","shuttleLog_task.command.cancel","shuttleLog_task.command.task","shuttleLog_task.command.depth","shuttleLog_task.command.ID","shuttleLog_task.status.counter","shuttleLog_task.status.task.done","shuttleLog_task.status.task.busy","shuttleLog_task.status.task.error","shuttleLog_task.status.task.id","shuttleLog_task.status.taskIDCounter","shuttleLog_task.status.pallet.taked","shuttleLog_task.status.pallet.put","shuttleLog_task.status.IDTask","shuttleLog_task.status.IDStatus","shuttleLog_task.status.IDError","shuttleLog_task.status.IDWarning","shuttleLog_times.ID","shuttleLog_times.date","shuttleLog_times.startTime","shuttleLog_times.duration","transLog_tasks.ID","transLog_tasks.command.go","transLog_tasks.command.cancel","transLog_tasks.command.task","transLog_tasks.command.origin.side","transLog_tasks.command.origin.street","transLog_tasks.command.origin.level","transLog_tasks.command.origin.depth","transLog_tasks.command.destination.side","transLog_tasks.command.destination.street","transLog_tasks.command.destination.level","transLog_tasks.command.destination.depth","transLog_tasks.status.counter","transLog_tasks.status.task.done","transLog_tasks.status.task.busy","transLog_tasks.status.task.error","transLog_tasks.status.task.id","transLog_tasks.status.validation.origin.street","transLog_tasks.status.validation.origin.level","transLog_tasks.status.validation.origin.depth","transLog_tasks.status.validation.destination.street","transLog_tasks.status.validation.destination.level","transLog_tasks.status.validation.destination.depth","transLog_tasks.status.pallet.taked","transLog_tasks.status.pallet.put","transLog_tasks.status.IDTask","transLog_tasks.status.IDStatus","transLog_tasks.status.IDError","transLog_tasks.status.IDWarning","transLog_times.ID","transLog_times.date","transLog_times.startTime","transLog_times.duration"]';

  ///   CONEXIÓN OPEN PIPE SIEMENS  ////
const connect = () => {
  let client = net.connect(PIPE_PATH, () => {
    const timeString = fn.formatDateNow();
    var Subscribecommand = `{"Message":"SubscribeTag","Params":{"Tags":${tags}},"ClientCookie":"mySubscription1"}\n`;
    client.write(Subscribecommand);
    firebase.database().ref(`/Eventos/pipe-ConnectionSuccess/${timeString}`).set({
        User: fn.userNum,
        Descripcion: "Conexión establecida con RT",
        server_timestamp: {
          ".sv": "timestamp",
        },
      });
    const rl = readline.createInterface({
      input: client,
      crlfDelay: Infinity,
    });
    rl.on("line", (line) => {
      let obj = JSON.parse(line);

      if (obj.Message == "NotifySubscribeTag") {
        pipeFunctions.printOnSuccess(obj.Params.Tags);
      }
      if (obj.Message == "ErrorSubscribeTag") {
        pipeFunctions.printError(obj);
      }
      if (obj.Message == "NotifyUnsubscribeTag") {
        pipeFunctions.printSuccess(obj);
      }
      if (obj.Message == "ErrorUnsubscribeTag") {
        pipeFunctions.printOnError(obj);
      }
    });
  });

  client.on("error", (err) => {
    client.destroy();
    const timeString = fn.formatDateNow();
    console.log(timeString + ` Error de conexión con runtime, reintentando en ${reconnMinutes} minutos.`);
    firebase.database().ref(`/Eventos/pipe-ConnectionError/${timeString}`).set({
        User: fn.userNum,
        Descripcion: "Error de conexión con RT",
        server_timestamp: {
          ".sv": "timestamp",
        },
      });
    setTimeout(() => {
      console.log("Reconnecting..");
      connect();
    }, reconnTime);
  });

  client.on("close", (e) => {
    console.log("Runtime cerrado");
    client.setTimeout(() => {
      client.destroy();
    }, reconnTime);
  });

  client.on("end", () => {
    const timeString = fn.formatDateNow();
    firebase.database().ref(`Eventos/pipe-End/${timeString}`).set({
        User: fn.userNum,
        Descripción: "Se cerró la conexión con RT",
        server_timestamp: {
          ".sv": "timestamp",
        },
      });
    console.log("FINALIZÓ RUNTIME");
    connect();
  });
};

module.exports = { connect };
