const express = require('express');
const path = require("path");
const connectDb = require('./database')
const router = require('./routes/router')
require("dotenv").config();
const cors = require('cors');


const app = express();
const PORT =  process.env.PORT || 3004;

connectDb();

app.use(cors());
app.use(express.json());
app.use("/api/v1", router);


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
