<h1> Planet Snake Research Vivarium</h1>

<h3>At Project Completion</h3>
<img alt="" src="./documentation/photos/planet_snake.jpg" />
<h3>After one year</h3>
<img alt="" src="./documentation/photos/planet_snake_one_year.jpg" />

<h2  > Description </h2>

<p>This is project is a Raspberry Pi controlled eco system. It monitors the temperatures inside the Vivarium creating a temperature gradient throughout. This helps to provide Sunny a warm place to hide, a cool place to hide as well as a basking spot that will roast like the sun.
</p>
<img alt="" src="./documentation/photos/sunny.jpg" />

Sunny is our intrepid but stealthy snake. She goes up, she goes down, she goes all around. Sunny loves the sun! Thats why Planet Snake also features lighting control. Thats right, during the day she gets healthy dose of UVB as well as extra LED lights targeted towards plant growth and health. During the evening it has a nice healthy blue glow for moon light.

<h2>Hardware</h2>

This project runs on a Raspberry Pi Zero W. Its effective for the project, but hasn't had to run any databasing, data serving or UI elements yet. Board choice will be reevaluated as project needs change.

<img src="./documentation/photos/Pi Zero W Cropped.jpg" width="50%" />

<img src="./documentation/photos/pinout.png" width="50%" />

This enclosure utilizes 2 sets of 4 mechnical opto-isolated relays. One for the lights and one for heating.

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

Humidity is tracked via a single SHT-31 i2c sensor. It can be raised by running a sonic mister which also creates a lovely spooky effect.

<h3> Software </h3>

Currently the enclosure features a web dashboard for control and adjustment. Alexa has also been integrated via get requests from a local <a href="https://www.hubitat.com">hubitat</a>. Ideally this will be refactored into an alexa skill. Currently Alexa is able to make the enclosure spooky by turning on the sonic mister and turning it to night mode. Once refactored into an alexa skill, it will include the ability to switch between day and night, get the currrent enviromental conditions, provide voice reminders for when its time to feed sunny and much more.
