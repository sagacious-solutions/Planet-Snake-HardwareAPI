const SHT31 = require("./sht31_sensorLibrary");

const seconds = 1000;

const getHumidity = () => {
  return currentHumidity;
};

module.exports = (
  readingInterval = seconds * 15,
  lcd_display,
  lcd_line = 3
) => {
  console.log("Humidity Module Exported");
  let currentHumidity = "DEFAULT";

  // The SHT31 constructor options are optional.
  //
  const options = {
    i2cBusNo: 1, // defaults to 1
    i2cAddress: SHT31.SHT31_DEFAULT_I2C_ADDRESS(), // defaults to 0x44
  };

  const sht31 = new SHT31(options);

  // Read SHT31 sensor data, repeat
  //
  const readSensorData = () => {
    return sht31
      .readSensorData()

      .catch((err) => {
        console.log(`SHT31 read error: ${err}`);

        return null;
      });
  };

  // Initialize the SHT31 sensor
  //
  sht31
    .init()
    .then(() => {
      console.log("SHT31 initialization succeeded");
    })
    .catch((err) => console.error(`SHT31 initialization failed: ${err} `));

  return { readSensorData, currentHumidity };
};

// module.exports = { getHumidity };
