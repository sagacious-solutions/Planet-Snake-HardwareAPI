
# Starts and reinitializes software and loads logs

pm2 stop index
pm2 flush
pm2 start index.js
pm2 logs --raw















