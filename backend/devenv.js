const express = require("express");
const axios = require("axios");
const { response } = require("express");
var cors = require('cors');
const app = express();
app.use(cors());

const PORT = 3030;

const API_KEY = "0DC2B1BE355E13AF9DC0B2112A9D22EE";
const TEST_USER_NAME = "thedarkknightrises";

async function getSteamProfileDetails(USER_NAME) {
  let result = {};

  await axios
    .get(
      "http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=" +
        API_KEY +
        "&vanityurl=" +
        USER_NAME
    )
    .then((response) => {
      console.log("Response text: " + response.statusText);
      console.log("Response status: " + response.status);
      result = response.data;
    })
    .catch((error) => {
      result.error = error.response.statusText;
      result.status = error.response.status;
    });

  return result;
}

async function getDetailedSteamProfile(STEAM_ID) {
  let result = {};

  await axios
    .get(
      "http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=0DC2B1BE355E13AF9DC0B2112A9D22EE&steamids=" +
        STEAM_ID
    )
    .then((response) => {
      //console.log(response);
      result = response.data.response.players[0];
    })
    .catch((error) => {
      console.log(error);
      result.error = "404";
    });

  //console.log(result);
  return result;
}

app.get("/", (req, res) => {
  res.send("Global getter. Express application is running.");
});

app.get("/getSteamProfile", (req, res) => {
  var USERNAME = req.query.uniqueIdentifier;
  getSteamProfileDetails(USERNAME).then((result) => {
    getDetailedSteamProfile(result.response.steamid).then((result) => {
      res.send(result);
    });
  });
});

app.listen(PORT, () => {
  console.log(
    "SVRP Steam look up is running on port 3030. Access point: 127.0.0.1:" +
      PORT
  );
});
