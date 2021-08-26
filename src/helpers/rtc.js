//  This module is your time class converted to closure by jensen
module.exports = (storing = false, h = 0, m = 0, s = 0) => {
  let date, hours, minutes, seconds, pm;

  if (storing) {
    // console.log("storing time for alarm");
    hours = h;
    minutes = m;
    seconds = s;
    pm = hours >= 12;
  } else {
    // console.log("This is a new RTC");
    date = new Date();
    hours = date.getHours();
    minutes = date.getMinutes();
    seconds = date.getSeconds();
    pm = hours >= 12;
  }

  const tick = () => {
    date = new Date();
    hours = date.getHours();
    minutes = date.getMinutes();
    seconds = date.getSeconds();
    pm = hours > 12;
  };

  if (!storing) {
    setInterval(tick, 60000);
  }

  const amPM = () => (pm ? "PM" : "AM");

  const time = () => {
    return { hours, minutes, seconds };
  };

  const updateStoredTime = (h, m = 0, s = 0) => {
    hours = h;
    minutes = m;
    seconds = s;
  };

  const isBetween = (startTime, endTime) => {
    return (
      (hours === startTime.hours && minutes >= startTime.minutes) ||
      (hours > startTime.hours && hours < endTime.hours) ||
      (hours === endTime.hours && minutes < endTime.minutes)
    );
  };

  const toConsole = () => {
    // removed tick to prevent alarm clock errors
    //adjusts output from 24 hour clock to 12 hour clocks
    const adjustedHours = hours >= 13 ? hours - 12 : hours;

    console.log(
      `${adjustedHours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}${amPM()}`
    );
  };
  return {
    toConsole,
    tick,
    time,
    isBetween,
  };
};
///////////////////////////////

// const closureTime = require("./time");
// const rtc = closureTime();
// const morning = closureTime(true, 7);
// rtc.toConsole(true);
// morning.toConsole();
