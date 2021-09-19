
# Starts and reinitializes software and loads logs

pm2 stop "planet-snake-hardware-api"
pm2 flush
pm2 start index.js --name "planet-snake-hardware-api"
pm2 logs --raw















