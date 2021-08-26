// config should be imported before importing any other file
// const app = require("./config/express");

//////////////////////////////////////////////
////////////////// Moving To Inside Heater
// Initializes lcd display when software starts
const lcd = require("./src/display/lcd");
const lcd_add = 0x27;
const lcd_display = lcd(lcd_add);

///////////////////// Setup of ds18b20 sensors
const refreshRate = 10000; // In milliseconds
const dbSaveInterval = 3; // In minutes
const ds18b20 = require("./src/sensors/ds18b20");
const lightingControl = require("./src/control_modules/onOff_vivariumLighting");
const heatingControl = require("./src/control_modules/onOff_vivariumHeating");
const temperatureSensors = ds18b20(60 * 1000, 5);
const lightCycle = lightingControl();

const hideSensor = "28-0000058f5428";
const baskingSensor = "28-041464652fff";
const coolSide = "28-0214630eb5ff";

const sensors = [hideSensor, baskingSensor, coolSide, "28-0000058fc62a"];

const targetHideTemp = 32;
const targetBaskingTemp = 35;
// const targetHideTemp = 32;
// const targetBaskingTemp = 37;

const seconds = 1000;

// CHANGE LOGIC TO REDUCE HEATING TO 25c AT NIGHT

const basking = heatingControl(
  [6],
  baskingSensor,
  targetBaskingTemp,
  "Basking",
  temperatureSensors,
  lcd_display,
  0
);

const hide = heatingControl(
  [4, 5],
  hideSensor,
  targetHideTemp,
  "Warm Hide",
  temperatureSensors,
  lcd_display,
  1
);

const cool = heatingControl(
  null,
  coolSide,
  null,
  "Cool Side",
  temperatureSensors,
  lcd_display,
  2
);

// Sets lcd display to refresh once a minute and passes heating controller to lcd_display
//setInterval(lcd_display.displayTemperatures, 60 * seconds, basking, hide, cool);

// process.on("SIGINT" || "exit", function () {
//   console.log("Sunny house is gracefully shutting down");
//   console.log("This code from index.js");
//   process.exit();
// });
