const SHT31 = require('./sht31');

// The SHT31 constructor options are optional.
//
const options = {
  i2cBusNo   : 1, // defaults to 1
  i2cAddress : SHT31.SHT31_DEFAULT_I2C_ADDRESS() // defaults to 0x44
};

const sht31 = new SHT31(options);

// Read SHT31 sensor data, repeat
//
const readSensorData = () => {
  sht31.readSensorData()
    .then((data) => {
      // temperature_C and humidity are returned by default.
      // I'll also calculate some unit conversions for display purposes.
      //
      data.temperature_F = SHT31.convertCelciusToFahrenheit(data.temperature_C);

      console.log(`data = ${JSON.stringify(data, null, 2)}`);
      setTimeout(readSensorData, 2000);
    })
    .catch((err) => {
      console.log(`SHT31 read error: ${err}`);
      setTimeout(readSensorData, 2000);
    });
};

// Initialize the SHT31 sensor
//
sht31.init()
  .then(() => {
    console.log('SHT31 initialization succeeded');
    readSensorData();
  })
  .catch((err) => console.error(`SHT31 initialization failed: ${err} `));