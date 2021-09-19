/////////////////////////////////////////////////////// ///////////////////////////
// THIS RELAY IS WIRED DEFAULT ON INCASE OF COMPUTER FAILURE. THAT MEANS DRIVING IT LOW TURNS
// IT OFF UNLIKE THE LIGHTS WHERE ITS THE OPPOSITE
/////////////////////////// /////////////////////////// ///////////////////////////

let Gpio = require("onoff").Gpio; //include onoff to interact with the GPIO
const seconds = 1000;
const minutes = 60 * seconds;

// 17 22 23 24 27

// Relays Switch turn on when current sinks
const ON = 1;
const OFF = 0;

//******************************************* */
/// CURRENTLY CODED TO DETERMINE HEATING BY IF A SOCKET WAS PUT IN, NOT OBVIOUSE ON LATER RETURN
// IF NO SOCKET, IT IS NULL

// FIX
module.exports = (
  // STARTING INPUT
  socketInput = null,
  sensor,
  targetTemp = 30,
  zone,
  temperatureSensors,
  lcd_display,
  lcd_line,
  heatChangeInterval = 30 * seconds
) => {
  //////////////// START OF MODULE CODE
  // Socket pin associations [ 0, 1, 2, 3, 4, 5, 6]
  const physicalSockets = [null, 23, 24, null, 22, 27, 17];
  const pwrBarSocket = [];
  let heating = null;
  let timeOn = null;
  let timeOff = null;
  let swing = 0;
  let objectValue = { currentTemp: 0 }; /// THIS IS NOT A GOOD NAME !!!!!!1111oneone

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

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////// WORTKING HERE ON LCD DISPLAY
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const displayToLcd = () => {
    if (socketInput) {
      lcd_display.writeLine(
        lcd_line,
        `${zone} ${objectValue.currentTemp}c/${targetTemp}c`
      );
      return;
    }

    lcd_display.writeLine(lcd_line, `${zone} is ${objectValue.currentTemp}c`);
  };

  // turns the sockets on or off
  const setHeating = () => {
    for (let thisSocket of pwrBarSocket) {
      if (objectValue.currentTemp < targetTemp) {
        thisSocket.writeSync(ON);
        console.log(`${zone} Turned on`);
        timeOn = Date.now();
        heating = true;
      }
    }

    for (let thisSocket of pwrBarSocket) {
      if (objectValue.currentTemp > targetTemp) {
        thisSocket.writeSync(OFF);
        console.log(`${zone} Turned off`);
        timeOff = Date.now();
        heating = false;
      }
    }
  };

  const moduleLoop = () => {
    if (!temperatureSensors.getLastRead()) {
      console.log("temp reads are not ready yet");
      return;
    }

    // objectValue.currentTemp = temp.t; // RATHER than modify the value, create a new object and return it
    for (let temp of temperatureSensors.getLastRead().temps) {
      if (temp.id === sensor) {
        objectValue.currentTemp = temp.t;

        displayToLcd();
      }
    }

    // if the module has been assigned a socket, run temp control
    if (pwrBarSocket.length > 0) {
      setHeating();
    }

    console.log(`It's currently ${objectValue.currentTemp} in ${zone}`);
  };

  ////////////////////////////////////////////////////////////
  // Start of heating control loop loop
  ////////////////////////////////////////////////////////////
  initialize();
  moduleLoop();
  setInterval(moduleLoop, heatChangeInterval);

  const getTemp = () => {
    if (objectValue.currentTemp) {
      return objectValue.currentTemp;
    }

    return "NO DATA";
  };

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
        console.log("THIS RAN!!!");
        thisSocket.writeSync(1);
        thisSocket.unexport();
      }
    }
    setTimeout(() => process.exit(0), 1000);
  });

  return {
    getTemp,
    zone,
    targetTemp,
    heating,
    timeOn,
    timeOff,
    setSockets,
    objectValue,
  };
};
