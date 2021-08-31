require("dotenv").config();

const express = require("express");
const app = express();
const port = process.env.PORT;
const cors = require('cors')


//console.log(process.env.PORT)

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////// LCD DISPLAY DISABLED HERE ////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////// Setup of ds18b20 sensors
const refreshRate = 10000; // In milliseconds
const dbSaveInterval = 3; // In minutes
const lightingControl = require("./src/control_modules/onOff_vivariumLighting");
const lightCycle = lightingControl();
const { basking, hide, cool } = require("./src/heating_configuration");

const seconds = 1000;

// CHANGE LOGIC TO REDUCE HEATING TO 25c AT NIGHT

app.get("/current", cors(), (req, res) => {
  const currentReadings = {
    "basking": basking.currentTemp,
    "hide": hide.currentTemp,
    "cool": cool.currentTemp
  }

  console.log("request made for current readings")
  res.json(currentReadings);
  // res.send(basking.currentTemp);
});
app.get("/baskingTarget", cors(),(req, res) => {
  res.status(200).send(basking.targetTemp);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

// Sets lcd display to refresh once a minute and passes heating controller to lcd_display
//setInterval(lcd_display.displayTemperatures, 60 * seconds, basking, hide, cool);

// process.on("SIGINT" || "exit", function () {
//   console.log("Sunny house is gracefully shutting down");
//   console.log("This code from index.js");
//   process.exit();
// });
