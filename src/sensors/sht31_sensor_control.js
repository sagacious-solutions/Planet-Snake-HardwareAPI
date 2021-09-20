const SHT31 = require("./sht31_sensor_library");

const seconds = 1000;

module.exports = () => {
  const options = {
    i2cBusNo: 1,
    i2cAddress: SHT31.SHT31_DEFAULT_I2C_ADDRESS(),
  };

  const sht31 = new SHT31(options);

  const readSensorData = () => {
    return sht31
      .readSensorData()

      .catch((err) => {
        console.log(`SHT31 read error: ${err}`);
        return null;
      });
  };

  sht31
    .init()
    .then(() => {
      console.log("SHT31 initialization succeeded");
    })
    .catch((err) => console.error(`SHT31 initialization failed: ${err} `));

  return { readSensorData };
};
