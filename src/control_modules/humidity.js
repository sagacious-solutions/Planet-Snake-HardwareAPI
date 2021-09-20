let Gpio = require("onoff").Gpio;
const seconds = 1000;
const minutes = 60 * seconds;

// Relays Switch turn on when current sinks
const ON = 1;
const OFF = 0;

module.exports = (
  socketInput = null,
  sensor,
  targetHumidity = 65,
  lcd_display,
  lcd_line,
  CHECK_HUMIDITY_INTERVAL = 30 * seconds,
  zone = "humidity"
) => {
  // The array index represents a physical power bar socket [ 0, 1, 2, 3, 4, 5, 6]
  // Below should have the corresponding GPIO pin for the relay controlling that socket
  const physicalSockets = [null, 23, 24, null, 22, 27, 17];
  let pwrBarSocket = [];
  let misting = null;
  let timeOn = null;
  let timeOff = null;
  let humidity = { current: 0, target: targetHumidity };

  const initialize = () => {
    if (socketInput) {
      for (let socket of socketInput) {
        if (!physicalSockets[socket]) {
          console.log(
            "ERROR! - You attempted to use an invalid socket. Only use 1, 2, 4, 5, 6"
          );
        }
        console.log(`Sucsesfully initialized socket ${socket} for ${zone}`);
        pwrBarSocket.push(new Gpio(physicalSockets[socket], "out"));
      }

      return;
    }
    console.log(`Zone ${zone} is monitored only.`);
    pwrBarSocket = null;
  };

  const displayToLcd = (data) => {
    lcd_display.writeLine(
      lcd_line,
      `Rel / Hum : ${parseFloat(data.humidity).toPrecision(4)}%`
    );
  };

  // Toggles relays on and off to control humidity in this range
  const setHumidity = () => {
    for (let thisSocket of pwrBarSocket) {
      if (humidity.current < humidity.target) {
        thisSocket.writeSync(ON);
        timeOn = Date.now();
        misting = true;
      }
    }

    for (let thisSocket of pwrBarSocket) {
      if (humidity.current > humidity.target) {
        thisSocket.writeSync(OFF);
        timeOff = Date.now();
        misting = false;
      }
    }
  };

  const moduleLoop = () => {
    sensor.readSensorData().then((data) => {
      displayToLcd(data);
      humidity = {
        ...humidity,
        current: parseFloat(data.humidity).toPrecision(4),
      };
    });

    if (pwrBarSocket) {
      setHumidity();
    }
  };

  initialize();
  moduleLoop();
  setInterval(moduleLoop, CHECK_HUMIDITY_INTERVAL);

  // Primarily Used for trouble shooting
  const toggleHumidity = (onOff = null) => {
    for (let thisSocket of pwrBarSocket) {
      if (onOff === null) {
        misting = !misting;
      } else {
        misting = onOff;
      }

      if (misting) {
        thisSocket.writeSync(ON);
      } else {
        thisSocket.writeSync(OFF);
      }
    }
  };

  process.on("SIGINT", (_) => {
    if (pwrBarSocket) {
      for (let thisSocket of pwrBarSocket) {
        thisSocket.writeSync(OFF);
        thisSocket.unexport();
      }
    }
    setTimeout(() => process.exit(0), 1000);
  });

  return { toggleHumidity, humidity };
};
