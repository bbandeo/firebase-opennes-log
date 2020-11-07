TO.DO


TO-DO LIST

[ ]    Buffer local

[ ]    Resolver para desconexión de runtime

[ ]    Resolver para desconexión de internet

[ ]    App as a service





Se debe generar un buffer local para actualizar DB cada 10 segundos aproximadamente

- Leo de openness 
- Guardo variables en buffer local          - Con bit "hasChanged" == 0; descarto valores iguales


                                                true: Subo valores a Firebase - borro contenido de buffer.
- 10 seg: Chequeo si está viva la conexión <
                                                false: Sigo almacenando valores en buffer iterando cada 10 segundos checkIfAlive() 