const sensor = require("ds18b20-raspi");
const time = require("../helpers/rtc");

const seconds = 1000;

module.exports = (intLength = 10 * seconds, dbSaveInterval = 5) => {
  const FAKEDATA = [
    { id: "28-0000058f5428", t: 33.63 },
    { id: "28-0000058fc62a", t: 22.06 },
    { id: "28-0214630eb5ff", t: 21.19 },
    { id: "28-041464652fff", t: 38.56 },
  ];

  const lastHr = [];

  const getLast15 = () => {
    // console.log("getLast15 Ran ", lastHr.length - 15, " - ", lastHr.length);
    return lastHr.slice(lastHr.length - 15, lastHr.length);
  };

  let count, lastReadData;
  let lastReadTime = time();
  // Takes the time of last year, adds on the amount of minutes before a Db read
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
