const ds18b20 = require("./sensors/ds18b20");
const heatingControl = require("./control_modules/onOff_vivariumHeating");
const humidityControl = require("./control_modules/onOff_vivariumHumidity");

const hideSensor = "28-0000058f5428";
const baskingSensor = "28-041464652fff";
const coolSide = "28-0214630eb5ff";

const temperatureSensors = ds18b20(60 * 1000, 5);

const sensors = [hideSensor, baskingSensor, coolSide, "28-0000058fc62a"];

const TARGET_HIDE_TEMPERATURE = 32;
const TARGET_BASKING_TEMP = 35;

const lcd = require("./display/lcd");
const lcd_add = 0x27;
const lcd_display = lcd(lcd_add);
const seconds = 1000;

const humidityModule = require("./sensors/sht31_sensorControl");
const humiditySensor = humidityModule(60 * seconds, lcd_display, 3);

const mister = humidityControl(
  [1],
  humiditySensor,
  65,
  lcd_display,
  3,
  5 * seconds
);

const basking = heatingControl(
  [6],
  baskingSensor,
  TARGET_BASKING_TEMP,
  "Basking",
  temperatureSensors,
  lcd_display,
  0,
  5 * seconds
);

const hide = heatingControl(
  [4, 5],
  hideSensor,
  TARGET_HIDE_TEMPERATURE,
  "Warm Hide",
  temperatureSensors,
  lcd_display,
  1,
  5 * seconds
);

const cool = heatingControl(
  null,
  coolSide,
  null,
  "Cool Side",
  temperatureSensors,
  lcd_display,
  2,
  5 * seconds
);

module.exports = { basking, hide, cool, mister };
