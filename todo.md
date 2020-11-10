TO-DO LIST

[ ]    Buffer local

[✔]    Resolver para desconexión de runtime

[ ]    Escribir en firebase un log de errores

[ ]    Resolver para desconexión de internet

[ ]    

[ ]    App as a service

[ ]    Tiempo crítico de pérdida de datos (Intentar reconexión cada cuanto)

[✔]    Cuando runtime no está en ejecución Throw er unhandled error event




// en el if the rl.on line tengo que llamar al almacén de buffer que está en otro archivo JS
// después en este mismo archivo tengo que setear un set interval (fijarse el tema de bloqueo por el mismo RL)
// y ese set interval recién llama a actualizar a la firebase database 




Se debe generar un buffer local para actualizar DB cada 10 segundos aproximadamente

- Leo de openness 
- Guardo variables en buffer local          - Con bit "hasChanged" == 0; descarto valores iguales


                                                true: Subo valores a Firebase - borro contenido de buffer.
- 10 seg: Chequeo si está viva la conexión <
                                                false: Sigo almacenando valores en buffer iterando cada 10 segundos checkIfAlive() 