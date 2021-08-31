
# Starts and reinitializes software and loads logs

pm2 stop index
git reset --hard
git pull
pm2 flush
pm2 start index.js
pm2 logs --raw



