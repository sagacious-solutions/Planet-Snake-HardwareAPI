const time = require("../helpers/rtc");
let Gpio = require("onoff").Gpio; //include onoff to interact with the GPIO

let snekNightLight = new Gpio(5, "out");
let plantDayLED = new Gpio(6, "out");
let plantRedLED = new Gpio(13, "out");
let snekUVB = new Gpio(26, "out");

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
    plantDayLED.writeSync(OFF);
    plantRedLED.writeSync(OFF);
    snekUVB.writeSync(OFF);
  }

  function initDay() {
    snekNightLight.writeSync(OFF);
    plantDayLED.writeSync(ON);
    plantRedLED.writeSync(ON);
    snekUVB.writeSync(ON);
    lightStateIsDay = true;
  }

  function initNight() {
    snekNightLight.writeSync(ON);
    plantDayLED.writeSync(OFF);
    plantRedLED.writeSync(OFF);
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

  const checkDayNight = () => {
    // if its day and the lights are not set to day
    if (checkDay() && !lightStateIsDay) {
      initDay();
      return;
    }
    // if its not day but the lights are set to day
    if (!checkDay() && lightStateIsDay) {
      initNight();
    }
  };

  initDay();
  checkDayNight();
  setInterval(checkDayNight, 60000);
};
