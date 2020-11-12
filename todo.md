########   TO-DO LIST   ########

[✔]    Buffer local

[✔]    Resolver para desconexión de runtime

[✔]    Escribir en firebase un log de errores

[ ]    Resolver para desconexión de internet

[ ]    Si Node cae no hay backup de los logs - ( Se puede resolver con escritura de files - lleva tiempo)

[ ]    App as a service - Documento descriptivo del logger para open, para pedir autorización

[ ]    Tiempo crítico de pérdida de datos (Intentar reconexión cada cuanto)

[✔]    Cuando runtime no está en ejecución Throw er unhandled error event

[ ]    Reiniciar el servicio con un ejecutable para que en caso de caída sea facil de levantar por el usuario remoto. 

[ ]    Posibilidad de variar desde el scada la forma de tomar los datos ( forma simple, por tiempo de operación, etcétera )

[ ]    Revisar comportamientos de if derivados segun comportamiento en firebase-connection.js

[✔] Leo de openness 

[✔] Guardo variables en buffer local          [ ] - Con bit "hasChanged" == 0; descarto valores iguales

.                                                 [✔]  true: Subo valores a Firebase - borro contenido de buffer.
[✔] - 10 seg: Chequeo si está viva la conexión <
.                                                 [✔] false: Sigo almacenando valores en buffer iterando cada 10 segundos checkIfAlive() 



ERRORES POSIBLES : 

                No se conectò a pipe                pipe-ConnectionErr   pipe-End
                No se conectó a database            
                No se conectó a internet
                Programa not running

DISCREPANCIAS : 
                Buffer: ....?
                Tiempo de reconexión                