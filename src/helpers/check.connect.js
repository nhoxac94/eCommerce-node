const mongoose = require("mongoose")

const countConnect = () => {
  const numConnection = mongoose.connections.length
  console.log(`Number Connection ::`, numConnection)
}

module.exports = {
  countConnect
}
