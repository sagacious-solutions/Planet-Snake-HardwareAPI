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
module.exports = (
  // STARTING INPUT
  socketInput = null,
  sensor,
  targetHumidity = 65,
  lcd_display,
  lcd_line,
  checkHumidityInterval = 30 * seconds,
  zone = "humidity"
) => {
  //////////////// START OF MODULE CODE
  // Socket pin associations [ 0, 1, 2, 3, 4, 5, 6]
  const physicalSockets = [null, 23, 24, null, 22, 27, 17];
  let pwrBarSocket = [];
  let misting = null;
  let timeOn = null;
  let timeOff = null;
  let swing = 0;
  let objectValue = { currentHumidity: 0 };

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

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////// WORTKING HERE ON LCD DISPLAY
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const displayToLcd = (data) => {
    lcd_display.writeLine(
      lcd_line,
      `Rel / Hum : ${parseFloat(data.humidity).toPrecision(4)}%`
    );
  };

  // turns the sockets on or off
  const setHumidity = () => {
    for (let thisSocket of pwrBarSocket) {
      if (currentHumidity < targetHumidity) {
        thisSocket.writeSync(ON);
        console.log(`${zone} Turned on`);
        timeOn = Date.now();
        misting = true;
      }
    }

    for (let thisSocket of pwrBarSocket) {
      if (currentHumidity > targetHumidity) {
        thisSocket.writeSync(OFF);
        console.log(`${zone} Turned off`);
        timeOff = Date.now();
        misting = false;
      }
    }
  };

  //////////////////////////////////////////////////
  // Main loop for sensor, currently doesn't control its assigned socket
  // Just using for data input output until deciding how to do humidity
  ///////////////////////////////
  const moduleLoop = () => {
    // if the module has been assigned a socket, run temp control

    sensor.readSensorData().then((data) => {
      displayToLcd(data);
      objectValue.currentHumidity = parseFloat(data.humidity).toPrecision(4);
      console.log(objectValue.currentHumidity);
    });

    // currentHumidity = parseFloat(data.humidity).toPrecision(4);

    // if (pwrBarSocket) {
    //   setHumidity();
    // }

    // console.log(`Rel / Hum : ${parseFloat(data.humidity).toPrecision(4)}%`);
  };

  ////////////////////////////////////////////////////////////
  // Start of humidty control loop
  ////////////////////////////////////////////////////////////
  initialize();
  moduleLoop();
  setInterval(moduleLoop, checkHumidityInterval);

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

  return { toggleHumidity, objectValue };
};
