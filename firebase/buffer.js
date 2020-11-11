let pipeBuffer = [];

const pushValue = (object) => {
    pipeBuffer.push(object);
    console.log("PUSHEADO");
}

const readAndDeleteValues = () => {
    let values = pipeBuffer;
    pipeBuffer = [];
    return values;
}

const showValues = () => {
    console.log({ pipeBuffer });
}


module.exports = {
    pushValue,
    readAndDeleteValues,
    showValues
}