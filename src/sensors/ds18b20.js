////////////////////////////////////////////////////////////////////////////
// This module is used to fetch readings from all ds18b20 sensors on
// the Raspberry Pi's one wire bus
////////////////////////////////////////////////////////////////////////////

const sensor = require("ds18b20-raspi");
const time = require("../helpers/rtc");

const seconds = 1000;

module.exports = (intLength = 10 * seconds, dbSaveInterval = 5) => {
  const lastHr = [];

  const getLast15 = () => {
    return lastHr.slice(lastHr.length - 15, lastHr.length);
  };

  let lastReadData;
  let lastReadTime = time();
  let nextDBWrite = lastReadTime.time().minutes + dbSaveInterval;

  ///////////////////////////////////////////////////////////////////////////////////////////
  // Proven Acurracy of used sensors is +/-0.15c // ds18b20
  ////////////////////////////////////////////////////////////////////////////////////////////
  const refreshTemps = () => {
    lastReadData = sensor.readAllC(2);
    lastReadTime.tick();
    const lastReading = { time: lastReadTime.time(), temps: lastReadData };

    lastHr.push(lastReading);
    if (lastHr.length > 60) {
      lastHr.shift();
    }

    if (lastReadTime.time().minutes >= nextDBWrite) {
      nextDBWrite = lastReadTime.time().minutes + dbSaveInterval;

      if (nextDBWrite > 59) {
        nextDBWrite = 0 + dbSaveInterval;
      }

      // THESE ARE PLACE HOLDERS. THE DATABASE WILL BE INTEGRATED SHORTLY
      console.log(`You should do database writes here.
      Find last hours readings below`);
      for (let reading of lastHr) {
        console.log(reading.time);
        console.log(reading.temps);
      }
    }
  };

  const startMonitor = () => {
    refreshTemps();
    setInterval(refreshTemps, intLength);
  };
  startMonitor();

  const getLastRead = () => {
    if (lastHr[0]) {
      return lastHr[lastHr.length - 1];
    }
    return null;
  };

  return { getLast15, getLastRead };
};
