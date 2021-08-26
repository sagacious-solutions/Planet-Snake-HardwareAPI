////////////////////////////////////////////////////////////////////////////////////////////////////
// This is a module to read an AHT20 sensor on i2c bus of raspberry pi
////////////////////////////////////////////////////////////////////////////////////////////////////

// https://github.com/fivdi/i2c-bus#readme
// https://www.npmjs.com/package/i2c-bus
const i2c = require("i2c-bus");

// https://caolan.github.io/async/v3/
const async = require("async");

// https://github.com/FlorianWendelborn/bitwise#readme
const bitwise = require("bitwise");

const getBit = bitwise.integer.getBit;
const newBuffer = bitwise.buffer.create;

// AHT20 Sensor Data sheet located at
// https://files.seeedstudio.com/wiki/Grove-AHT20_I2C_Industrial_Grade_Temperature_and_Humidity_Sensor/AHT20-datasheet-2020-4-16.pdf
const AHT20_ADDR = 0x38;
const READ = 0x01;
const WRITE = 0x00;

// helps me visualize the binary
const ONE = 1;
const ZERO = 0;

const GET_STATUS_WORD = 0x71;
const INIT_SENSOR = 0xbe;
const GET_DATA = 0xac;
const SOFT_RESET = 0xba;

const getBinary = (data) => {
  return bitwise.bits.toString(bitwise.byte.read(data), 4);
};

const getMeasurement = () => {
  let i2c1;

  async.series([
    (cb) => (i2c1 = i2c.open(1, cb)),

    // SOFT RESET
    // (cb) =>
    //   i2c1.writeByte(AHT20_ADDR, SOFT_RESET, READ, () => {
    //     console.log("We did a soft reset, Goodbye");
    //   }),

    // request a status byte
    (cb) => i2c1.writeByte(AHT20_ADDR, GET_STATUS_WORD, READ, cb),

    (cb) => {
      const init_sensor = () => {
        i2c1.readByte(AHT20_ADDR, GET_DATA, (err, config) => {
          // BIT ASSIGNMENT IS RIGHT (0) TO LEFT (0+n) // ALL MATH MUST HAVE OFFSET
          console.log("binary at read", getBinary(config));

          //           1. After power-on, wait for ≥100ms Before reading the temperature and humidity value, get a byte of status word
          // by sending 0x71. If the status word and 0x18 are not equal to 0x18, initialize the 0x1B, 0x1C, 0x1E registers, details Please refer to our official website routine for the initialization process; if they are equal, proceed to the next
          // step
          if ((config && 0x18) !== 0x18) {
            console.log("not initialized");
          }
          if (getBit(config, 3) !== ONE) {
            // This sends 0x08,0x00
            i2c1.writeWordSync(AHT20_ADDR, INIT_SENSOR, 2048);
            console.log("need to set calibration flag");
            setTimeout(init_sensor, 3000);
          }
          // READ HEX AND RESPOND
          if (err) {
            console.log("Error : ", err);
            return cb(err);
          }
          console.log("binary at exit", getBinary(config));
        });
      };

      init_sensor();
      return cb();
    },

    // This sends 0x33, 0x00
    (cb) => i2c1.writeWord(AHT20_ADDR, GET_DATA, 8448, cb),

    (cb) => {
      console.log("Start wait for reading");
      const wait = () => {
        i2c1.readByte(AHT20_ADDR, GET_DATA, (err, data) => {
          // console.log("binary sensor reading : ", getBinary(data));
          // If 7th bit is ZERO - Reading is complete
          if (getBit(data, 7) === ZERO) {
            // console.log("binary sensor reading : ", getBinary(data));
            // console.log("Sensor reading ready");

            cb();
            return;
          }
          // If its not zero, wait 80 ms and try again
          setTimeout(wait, 80);
        });
      };

      wait();

      // console.log("gonna read 6 bytes");

      /////////////////// THIS IS READY FOR READ, NEEDS A VALID 6 BYTE BUFFER
    },

    (cb) => {
      const dataBuffer = Buffer.alloc(6);

      i2c1.i2cRead(AHT20_ADDR, 6, dataBuffer, (err, bytesRead, dataBuffer) => {
        // console.log(dataBuffer);
        // console.log(bitwise.buffer.read(dataBuffer, 0, 48));

        let tempBuff = bitwise.buffer.read(dataBuffer, 8, 20);
        console.log("tempbuff binary before", tempBuff);

        const binaryOffset = [];
        for (let i = 0; i < 12; i++) {
          binaryOffset.push(0);
        }

        tempBuff = binaryOffset.concat(tempBuff);

        // console.log("tempbuff binary ", bitwise.buffer.read(tempBuff));
        console.log("tempbuff binary ", tempBuff);
        console.log(tempBuff.join(""));

        tempBuff = bitwise.buffer.create(tempBuff);
        console.log("read of bitwise buffer", bitwise.buffer.read(tempBuff));

        // let humiBuff = bitwise.buffer.read(dataBuffer, 28, 20);

        // console.log("humiBuff", humiBuff);
        console.log("tempBuff", tempBuff);
        // console.log("empty32", empty32);

        const temperature = tempBuff.readInt32BE(0);
        console.log("this is temperature ", temperature);

        // // const relHumid = (humidity / 1048576) * 100;
        const tempC = (temperature / 2 ** 20) * 200 - 50;
        // // const tempC1 = (Math.pow(temperature, 1 / state) / 2 ** 20) * 200 - 50;

        console.log(`It's currently ${tempC} celius`);
        // // console.log(`The relitive humiditiy is ${relHumid}%`);
      });
    },
  ]);
};
