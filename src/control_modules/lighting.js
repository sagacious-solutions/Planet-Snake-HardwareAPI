const time = require("../helpers/rtc");
let Gpio = require("onoff").Gpio;

let snekNightLight = new Gpio(13, "out");
let plantDayLEDS = new Gpio(6, "out");
let snekUVB = new Gpio(5, "out");

const SECOND_IN_MS = 1000;
const MINUTE_IN_MS = SECOND_IN_MS * 60;
const HOUR_IN_MS = MINUTE_IN_MS * 60;

// Relays Switch turn on when current sinks
const ON = 0;
const OFF = 1;

module.exports = () => {
  const REAL_TIME_CLOCK = time();
  const TIME_TO_SWITCH_TO_DAY_LIGHTS = time(true, 8, 0, 0);
  const TIME_TO_SWITCH_TO_EVENING_LIGHTS = time(true, 20, 0, 0);
  let lightStateIsDay = true;

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

  // Returns true if its between TIME_TO_SWITCH_TO_DAY_LIGHTS and TIME_TO_SWITCH_TO_EVENING_LIGHTS
  const checkDay = () => {
    if (
      REAL_TIME_CLOCK.isBetween(
        TIME_TO_SWITCH_TO_DAY_LIGHTS.time(),
        TIME_TO_SWITCH_TO_EVENING_LIGHTS.time()
      )
    ) {
      return true;
    }
    return false;
  };

  // Switches lights from day to night based on if its the tanks set day time or not
  const checkDayNight = () => {
    if (checkDay() && !lightStateIsDay) {
      initDay();
      return true;
    }
    if (!checkDay() && lightStateIsDay) {
      initNight();
      return false;
    }
  };

  // Switches from day to night reguardless of current state
  const toggleDayNight = () => {
    if (!lightStateIsDay) {
      initDay();
      return true;
    }
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

  // This fetches how long it is to the next even hour EX : 2:00pm or 7:00am
  const TIME_TO_AN_HOUR_MS =
    (59 - REAL_TIME_CLOCK.time().minutes) * MINUTE_IN_MS;

  // Waits until the next even hour, then sets an interval for
  // once an hour to check if its time to cycle the lights between night and day
  setTimeout(() => {
    setInterval(checkDayNight, 1 * HOUR_IN_MS);
  }, TIME_TO_AN_HOUR_MS);

  initDay();
  checkDayNight();
  return { initDay, initNight, toggleDayNight };
};
