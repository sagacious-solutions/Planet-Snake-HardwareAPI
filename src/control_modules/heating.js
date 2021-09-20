/////////////////////////////////////////////////////// ///////////////////////////
// THIS RELAY IS WIRED DEFAULT ON INCASE OF COMPUTER FAILURE. THAT MEANS DRIVING IT LOW TURNS
// IT OFF UNLIKE THE LIGHTS WHERE ITS THE OPPOSITE
/////////////////////////// /////////////////////////// ///////////////////////////

let Gpio = require("onoff").Gpio;

const THIRTY_SECONDS_MS = 30000;

// Relays Switch turn on when current sinks
const ON = 1;
const OFF = 0;

module.exports = (
  socketInput = null,
  sensor,
  targetTemp = 30,
  zone,
  temperatureSensors,
  lcd_display,
  lcd_line,
  heatChangeInterval = THIRTY_SECONDS_MS
) => {
  // The array index represents a physical power bar socket [ 0, 1, 2, 3, 4, 5, 6]
  // Below should have the corresponding GPIO pin for the relay controlling that socket
  const physicalSockets = [null, 23, 24, null, 22, 27, 17];
  const pwrBarSocket = [];
  let heating = null;
  let timeOn = null;
  let timeOff = null;
  let temperature = { current: 0, target: targetTemp };

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
  };

  const displayToLcd = () => {
    if (socketInput) {
      lcd_display.writeLine(
        lcd_line,
        `${zone} ${temperature.current}c/${temperature.target}c`
      );
      return;
    }

    lcd_display.writeLine(lcd_line, `${zone} is ${temperature.current}c`);
  };

  // turns the sockets on or off
  const setHeating = () => {
    for (let thisSocket of pwrBarSocket) {
      if (temperature.current < temperature.target) {
        thisSocket.writeSync(ON);
        timeOn = Date.now();
        heating = true;
      }
    }

    for (let thisSocket of pwrBarSocket) {
      if (temperature.current > temperature.target) {
        thisSocket.writeSync(OFF);
        timeOff = Date.now();
        heating = false;
      }
    }
  };

  const moduleLoop = () => {
    if (!temperatureSensors.getLastRead()) {
      console.log("Temperature readings are not ready yet");
      return;
    }

    // temperature.current = temp.t; // RATHER than modify the value, create a new object and return it
    for (let temp of temperatureSensors.getLastRead().temps) {
      if (temp.id === sensor) {
        temperature = { ...temperature, current: temp.t };

        displayToLcd();
      }
    }

    // if the module has been assigned a socket, run temp control
    if (pwrBarSocket.length > 0) {
      setHeating();
    }
  };

  initialize();
  moduleLoop();
  setInterval(moduleLoop, heatChangeInterval);

  // Primarily Used for trouble shooting
  const setSockets = (onOff) => {
    for (let thisSocket of pwrBarSocket) {
      thisSocket.writeSync(onOff);
    }
  };

  ///// FOR MAPPING PORTS
  process.on("SIGINT", (_) => {
    if (pwrBarSocket) {
      for (let thisSocket of pwrBarSocket) {
        thisSocket.writeSync(1);
        thisSocket.unexport();
      }
    }
    setTimeout(() => process.exit(0), 1000);
  });

  return {
    zone,
    temperature,
    heating,
    timeOn,
    timeOff,
    setSockets,
  };
};
