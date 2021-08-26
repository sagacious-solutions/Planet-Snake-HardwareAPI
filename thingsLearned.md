rtc.js

at the end of the module there is a return. When you call the module for the first time, only functions returned here (destructured { fn } ) will be available to call, otherwise you will get "is not a function"

when calling for the time, you need to RUN THE FUNCTION lastReadTime.time() and then you can put the object key you want on the end lastReadTime.time().minutes

SETTING UP DOCKER

https://towardsdatascience.com/local-development-set-up-of-postgresql-with-docker-c022632f13ea

NEED TO USE OLDER NODE BINARY ON PI ZERO
WGET https://nodejs.org/dist/v10.24.1/node-v10.24.1-linux-armv6l.tar.gz

/////////////////////// GIT BULL SHIT //////////////////////////////////
IF GIT DOESN'T LIKE ANYTHING IN A PULL, IT WON'T PULL ANYTHING. ANY TESTS RAN WILL STILL BE UNDER OLD CODE!!!!!
