let pipeBuffer = [];

const pushValue = (object) => {
  pipeBuffer.push(object);
  console.log("PUSHEADO");
};

const readValues = () => {
  let values = pipeBuffer;
  return values;
};

const deleteValues = () => {
  pipeBuffer = [];
  return 0;
};

const showValues = () => {
  console.log({ pipeBuffer });
};

const formatDateNow = () => {
  const dateObject = new Date(Date.now());
  const year = dateObject.getFullYear();
  const day = dateObject.getDate();
  const month = dateObject.getMonth() + 1;
  const hours = dateObject.getHours();
  const minutes = dateObject.getMinutes();
  const seconds = dateObject.getSeconds();
  const timeString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  return timeString;
};

const userNum = 299;

module.exports = {
  pushValue,
  readValues,
  deleteValues,
  showValues,
  formatDateNow,
  userNum,
};
