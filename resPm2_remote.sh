
# Starts and reinitializes software and loads logs

pm2 stop --name "planet-snake-hardware-api"
git pull
pm2 flush
pm2 start index.js --name "planet-snake-hardware-api"
pm2 save
pm2 logs --raw



