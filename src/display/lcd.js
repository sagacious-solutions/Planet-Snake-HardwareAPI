// Import the module
const LCD = require("raspberrypi-liquid-crystal");
const seconds = 1000;
const minutes = 60 * seconds;

module.exports = (address = 0x27, width = 20, height = 4) => {
  // Instantiate the LCD object on bus 1 address 3f with 16 chars width and 2 lines
  const lcd = new LCD(1, address, width, height);
    
  // Init the lcd (must be done before calling any other methods)
  try{
    lcd.beginSync();
  }catch(err){
    console.log("Unable to initlialize LCD.")
  }
  const clearLCD = () => {
    lcd.clear();
  };

  // Currently Written syncrounsouly, writes the message to the vertical colum index lineNu,
  const writeLine = (lineNum, message) => {
    lcd.printLineSync(lineNum, message);
  };

  return { clearLCD, writeLine };
};
