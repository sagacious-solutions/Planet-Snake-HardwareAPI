const ds18b20 = require("./sensors/ds18b20");
const heatingControl = require("./control_modules/heating");
const humidityControl = require("./control_modules/humidity");

// These are the addresses for the current sensors on the 1 wire Bus
const hideSensor = "28-0000058f5428";
const baskingSensor = "28-041464652fff";
const coolSide = "28-0214630eb5ff";

const temperatureSensors = ds18b20(60 * 1000, 5);

const lcd = require("./display/lcd");
const LCD_ADDRESS = 0x27;
const lcdDisplay = lcd(LCD_ADDRESS);

const SECOND_IN_MS = 1000;
const SENSOR_POLLING_INTERVAL = 60 * SECOND_IN_MS;

const humidityModule = require("./sensors/sht31_sensor_control");
const humiditySensor = humidityModule(60 * SECOND_IN_MS, lcdDisplay, 3);

const TARGET_RELATIVE_HUMIDITY = 65;
const TARGET_HIDE_TEMPERATURE = 32;
const TARGET_BASKING_TEMP = 35;

const mister = humidityControl(
  [1], // Powerbar Socket to register
  humiditySensor,
  TARGET_RELATIVE_HUMIDITY,
  lcdDisplay,
  3, // LCD Line starting from 0
  SENSOR_POLLING_INTERVAL
);

const basking = heatingControl(
  [6], // Powerbar Socket to register
  baskingSensor,
  TARGET_BASKING_TEMP,
  "Basking",
  temperatureSensors,
  lcdDisplay,
  0, // LCD Line starting from 0
  SENSOR_POLLING_INTERVAL
);

const hide = heatingControl(
  [4, 5], // Powerbar Socket to register
  hideSensor,
  TARGET_HIDE_TEMPERATURE,
  "Warm Hide",
  temperatureSensors,
  lcdDisplay,
  1, // LCD Line starting from 0
  SENSOR_POLLING_INTERVAL
);

const cool = heatingControl(
  null,
  coolSide,
  null,
  "Cool Side",
  temperatureSensors,
  lcdDisplay,
  2, // LCD Line starting from 0
  SENSOR_POLLING_INTERVAL
);

module.exports = { basking, hide, cool, mister };
