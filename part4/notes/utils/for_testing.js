const reverse = (string) => string.split("").reverse().join("");

const average = (array) =>
  array.reduce((sum, item) => sum + item, 0) / array.length;

module.exports = {
  reverse,
  average,
};
