require("dotenv").config();

const express = require("express");
const app = express();
const port = process.env.PORT;
const cors = require("cors");
const seconds = 1000;

const lightingControl = require("./src/control_modules/lighting");
const { toggleDayNight } = lightingControl();
const { basking, hide, cool, mister } = require("./src/heating_configuration");
let isSpooky = false;

app.get("/current", cors(), (_req, res) => {
  const currentReadings = {
    baskingCurrent: basking.temperature.current,
    hideCurrent: hide.temperature.current,
    coolCurrent: cool.temperature.current,
    humidityCurrent: mister.getHumidity().current,
    isSpooky: isSpooky,
  };

  console.log(mister);

  console.log("request made for current readings");
  console.log(currentReadings);
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
