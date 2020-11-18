var Service = require('node-windows').Service;
 
// Create a new service object
var svc = new Service({
  name:'PLC feedback',
  description: 'Servicio utilizado para detectar problemas midiendo variables de PLC en tiempo real',
  script: 'C:\\Users\\Usuario\\Desktop\\Code\\firebase-opennes-log\\app.js',
  nodeOptions: [
    '--harmony',
    '--max_old_space_size=4096'
  ]
  //    C:\Users\Usuario\Desktop\Code\firebase-opennes-log
  , workingDirectory: 'C:\\Users\\Usuario\\Desktop\\Code\\firebase-opennes-log'
  //, allowServiceLogon: true
});
 
// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  svc.start();
});
 
svc.install();