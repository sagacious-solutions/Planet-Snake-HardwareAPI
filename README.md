<h1> Planet Snake Research Vivarium</h1>
<h4> Our last hope against the interplanetary snake menace </h4>

<img alt="" src="./documentation/photos/snakeJazz.png" />

<img alt="" src="./documentation/photos/planet_snake.jpg" />

<h2  > Description </h2>

<p/>This is project is a Raspberry Pi controlled eco system. It monitors the temperatures inside the Vivarium creating a temperature gradient throughout. This helps to provide Sunny a warm place to hide, a cool place to hide as well as a basking spot that will roast like the sun.
</p>
<img alt="" src="./documentation/photos/sunny.jpg" />

Sunny is our intrepid but stealthy snake. She goes up, she goes down, she goes all around. Sunny loves the sun! Thats why Planet Snake also features lighting control. Thats right, during the day she gets healthy dose of UVB as well as extra LED lights targeted towards plant growth and health. During the evening it has a nice healthy blue glow for moon light.

<h2>Hardware</h2>

This project runs on a Raspberry Pi Zero W. Its effective for the project, but hasn't had to run any databasing, data serving or UI elements yet. Board choice will be reevaluated as project needs change.

<img src="./documentation/photos/Pi Zero W Cropped.jpg" width="50%" />

<img src="./documentation/photos/pinout.png" width="50%" />

This enclosure utilizes 4 sets of 4 mechnical opto-isolated relays. One for the lights and one for heating.

<h3>Display</h3>

Currently information about the state of the vivarium is displayed via an i2c 20x4 row LCD. Ideally this will be removed entirely, or supplemental to a React JS front end. This will also visualize data over time with grafana via data from the database.

<img src="./documentation/photos/LCD -  temps.jpg" width="50%" vertical-align:middle />

<h3>Heating</h3>

Currently utilizing 3 of an available 6 connected relays recycled from a previous project. Final build will we be updated to solid state relays to reduce noise and increase reliability. It will also be updated to a sleeker 3D Printed Enclosure.

<img src="./documentation/photos/8 relay - side cropped.jpg" width="50%" />
<img src="./documentation/photos/8 relay - top.jpg"   margin-left= "auto",
  margin-right= "auto",
  width= "50%"/>

<h3> Humidity </h3>

Humidity sensing is prototyped and available as a simple integer, but not connected or implemented. See src/sht30.js. Most likely to be implimented using a sonic humidifier running off a similar function to "src/control_modules/onOff_vivariumHeating.js"

<h2> Software </h2>

This is should be run as a PM2 instance to run at all times.

Currently building
