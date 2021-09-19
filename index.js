require("dotenv").config();

const express = require("express");
const app = express();
const port = process.env.PORT;
const cors = require("cors");
const seconds = 1000;

const lightingControl = require("./src/control_modules/onOff_vivariumLighting");
const { toggleDayNight } = lightingControl();
const { basking, hide, cool, mister } = require("./src/heating_configuration");
let isSpooky = false;

app.get("/current", cors(), (_req, res) => {
  const currentReadings = {
    baskingCurrent: basking.objectValue.currentTemp,
    hideCurrent: hide.objectValue.currentTemp,
    coolCurrent: cool.objectValue.currentTemp,
    humidityCurrent: mister.objectValue.currentHumidity,
    isSpooky: isSpooky,
  };

  console.log("request made for current readings");
  res.json(currentReadings);
});

app.get("/targetconfig", cors(), (req, res) => {
  const targetConfig = {
    baskingCurrent: basking.targetTemp,
    hideCurrent: hide.targetTemp,
  };

  res.json(targetConfig);
});

app.put("/targetconfig", cors(), (req, res) => {
  console.log("Someone is trying to update the target config");
  console.log(req);
});

const unspookify = () => {
  mister.toggleHumidity();
  toggleDayNight();
  isSpooky = false;
};

app.get("/toggledaynight", cors(), (req, res) => {
  console.log("Toggle Day Night triggered by webSite");
  res.status(200).send(toggleDayNight());
});
app.get("/spookymode", cors(), (req, res) => {
  console.log("Spooky Mode triggered by Hubitat");
  isSpooky = true;
  toggleDayNight();
  mister.toggleHumidity();
  setTimeout(unspookify, 120 * seconds);

  res.status(200).send();
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
