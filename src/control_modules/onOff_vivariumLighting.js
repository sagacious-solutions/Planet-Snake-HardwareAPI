const time = require("../helpers/rtc");
let Gpio = require("onoff").Gpio; //include onoff to interact with the GPIO

let snekNightLight = new Gpio(13, "out");
let plantDayLEDS = new Gpio(6, "out");
// let plantRedLED = new Gpio(6, "out");
let snekUVB = new Gpio(5, "out");

// Relays Switch turn on when current sinks
const ON = 0;
const OFF = 1;

let sNL = OFF;
let pDL = OFF;
let pRL = ON;
let sUV = OFF;

// isDay boolean for if it is day
module.exports = () => {
  const rtc = time();
  const dayTime = time(true, 8, 0, 0);
  const nightTime = time(true, 20, 0, 0);
  let lightStateIsDay = true;

  // Test use only
  function init() {
    snekNightLight.writeSync(OFF);
    plantDayLEDS.writeSync(OFF);
    snekUVB.writeSync(OFF);
  }

  function initDay() {
    snekNightLight.writeSync(OFF);
    plantDayLEDS.writeSync(ON);
    snekUVB.writeSync(ON);
    lightStateIsDay = true;
  }

  function initNight() {
    snekNightLight.writeSync(ON);
    plantDayLEDS.writeSync(OFF);
    snekUVB.writeSync(OFF);
    lightStateIsDay = false;
  }

  // Returns true if its between dayTime and NightTime
  const checkDay = () => {
    if (rtc.isBetween(dayTime.time(), nightTime.time())) {
      return true;
    }
    return false;
  };

  // Switches from day to night based on if its the tanks set day time or not
  const checkDayNight = () => {
    // if its day and the lights are not set to day
    if (checkDay() && !lightStateIsDay) {
      initDay();
      return true;
    }
    // if its not day but the lights are set to day
    if (!checkDay() && lightStateIsDay) {
      initNight();
      return false;
    }
  };

  // Switches from day to night reguardless of current state
  const toggleDayNight = () => {
    // if its day and the lights are not set to day
    if (!lightStateIsDay) {
      initDay();
      return true;
    }
    // if its not day but the lights are set to day
    if (lightStateIsDay) {
      initNight();
      return false;
    }
  };

  process.on("SIGINT", (_) => {
    snekNightLight.writeSync(1);
    plantDayLEDS.writeSync(1);
    snekUVB.writeSync(1);
    snekNightLight.unexport();
    plantDayLEDS.unexport();
    snekUVB.unexport();
    setTimeout(() => process.exit(0), 1000);
  });

  initDay();
  checkDayNight();
  setInterval(checkDayNight, 60000);
  return { initDay, initNight, toggleDayNight };
};
