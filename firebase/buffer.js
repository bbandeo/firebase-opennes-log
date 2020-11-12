let pipeBuffer = [];

const pushValue = (object) => {
    pipeBuffer.push(object);
    console.log("PUSHEADO");
}

const readValues = () => {
    let values = pipeBuffer;
    return values;
}

const deleteValues = () => {
    pipeBuffer = [];
    return 0;
}

const showValues = () => {
    console.log({ pipeBuffer });
}


module.exports = {
    pushValue,
    readValues,
    deleteValues,
    showValues
}