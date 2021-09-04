// Sensor address 44

/*
  SHT31.js
  A Node.js I2C module for the Sensirion SHT31 Humidity and Temperature Sensor.
*/

'use strict';

class SHT31 {

  constructor(options) {
    const i2c = require('i2c-bus');

    this.i2cBusNo = (options && options.hasOwnProperty('i2cBusNo')) ? options.i2cBusNo : 1;
    this.i2cBus = i2c.openSync(this.i2cBusNo);
    this.i2cAddress = (options && options.hasOwnProperty('i2cAddress')) ? options.i2cAddress : SHT31.SHT31_DEFAULT_I2C_ADDRESS();

    this.I2C_ADDRESS_B   = 0x45;
    this.I2C_ADDRESS_A   = 0x44;

    this.REGISTER_RESET  = 0x30;

    this.REQUEST_MEASUREMENT = 0x2C;
    this.REGISTER_ALL_DATA = 0x00;
  }

  init() {

    return new Promise((resolve, reject) => {
      // TODO: CHECK IF SENSOR IS ACTUALLY THERE! FOR NOW RETURN FAKE ID
      return resolve(SHT31.CHIP_ID_SHT31());
    });
  }

  // reset()
  //
  // Perform a soft-reset procedure.
  //
  reset() {
    return new Promise((resolve, reject) => {
      const SOFT_RESET_CMD = 0xA2;
      this.i2cBus.writeByte(this.i2cAddress, this.REGISTER_RESET, SOFT_RESET_CMD, (err) => {
        return err ? reject(err) : resolve();
      });
    });
  }

  readSensorData() {
    return new Promise((resolve, reject) => {

      this.i2cBus.writeByte(this.i2cAddress, this.REQUEST_MEASUREMENT, 0x06, (err) => {
        if(err) {
          return reject(err);
        }
        this.i2cBus.readI2cBlock(this.i2cAddress, this.REGISTER_ALL_DATA, 6, new Buffer(6), (err, bytesRead, buffer) => {
          if(err) {
            return reject(err);
          }

          let adc_T = SHT31.uint16(buffer[0], buffer[1]);
          let temperature_C = -45 + (175 * adc_T / 65535.0)

          let adc_H = SHT31.uint16(buffer[3], buffer[4]);
          let h = 100 * adc_H / 65535.0
          let humidity = (h > 100) ? 100 : (h < 0 ? 0 : h);

          resolve({
            temperature_C : temperature_C,
            humidity      : humidity
          });
        });
      });
    });
  }

  static SHT31_DEFAULT_I2C_ADDRESS() {
    return 0x44;
  }

  // THIS IS A FAKE ID!
  static CHIP_ID_SHT31() {
    return 0xFF;
  }

  static int16(msb, lsb) {
    let val = SHT31.uint16(msb, lsb);
    return val > 32767 ? (val - 65536) : val;
  }

  static uint16(msb, lsb) {
    return msb << 8 | lsb;
  }

  static convertCelciusToFahrenheit(c) {
    return c * 9 / 5 + 32;
  }
}

module.exports = SHT31;