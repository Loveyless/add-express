export default () => {
  return `const mongoose = require("mongoose");

module.exports = new Promise((resolve, reject) => {
  mongoose.connect("mongodb://localhost:27017/xxxx", (err, res) => {
    !err && resolve();
    err && reject(err);
  });
});
  `;
};
