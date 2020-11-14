########   TO-DO LIST   ########

[ ] - Con bit "hasChanged" == 0; descarto valores iguales para descomprimir el upload de firebase
[ ]    Resolver para desconexión de internet. Ver espacio en memoria del buffer almacenamiento. Hacer alguna maniobra para que no haya memory overflow . Puede tener algo que ver con ítem de            arriba.
[ ]    Documento descriptivo del logger para open, para pedir autorización
[ ]    Tiempo crítico de pérdida de datos (Intentar reconexión cada cuanto)
[ ]    Reiniciar el servicio con un ejecutable para que en caso de caída sea facil de levantar por el usuario remoto. 
[ ]    Posibilidad de variar desde el scada la forma de tomar los datos ( forma simple, por tiempo de operación, etcétera )
[ ]    Revisar comportamientos de if derivados segun comportamiento en firebase-connection.js
[ ]    Cambiar formato timestamp: Ver como usar hora del servidor en archive. Ponerle fecha como subraíz. 

[✔]    App as a service
[✔]    Cuando runtime no está en ejecución Throw er unhandled error event
[✔]    Leo de openness 
[✔]    Buffer local
[✔]    Resolver para desconexión de runtime
[✔]    Escribir en firebase un log de errores
.                                                 [✔]  true: Subo valores a Firebase - borro contenido de buffer.
[✔] - 10 seg: Chequeo si está viva la conexión <
.                                                 [✔] false: Sigo almacenando valores en buffer iterando cada 10 segundos checkIfAlive() 
[ ]    A FUTURO Si Node cae no hay backup de los logs - ( Se puede resolver con escritura de files - lleva tiempo)



ERRORES POSIBLES : 

                No se conectò a pipe                pipe-ConnectionErr   pipe-End
                No se conectó a database            
                No se conectó a internet
                Programa not running

DISCREPANCIAS : 
                Buffer: ....?
                Tiempo de reconexión                




DEL OHTER SIDE - - - - 

[ ]     Montamos una web para ver los datos

[ ]     El script en Crosetto tiene que bajar los datos e ir guardandolos en una base de datos local. Una vez por día borrar los mayores a 30 días según timelapse del server guardado en......
 
 
 

