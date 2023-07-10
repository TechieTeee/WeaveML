const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');

require('dotenv').config()

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static('public'))
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// defining an endpoint to return all ads
app.get('/', (req, res) => {
    res.send("Lens Weave ML Backend API!");
  });

app.get('/profiles', (req, res) => {
    res.send("Profiles Endpoint");
});

app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
  });

// Exporting api
module.exports = app;