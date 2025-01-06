const mongoose = require("mongoose");
require("dotenv").config();

const connectDb = async () => {
  try {
    const connect = await mongoose.connect(process.env.ATLAS_CONNECTION_STRING);
    console.log("Database connected", connect.connection.host, connect.connection.name)
  } catch (error) {
    console.log("error is connection with database: ", error)
  }
}

module.exports = connectDb