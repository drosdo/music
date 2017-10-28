var CronJob = require('cron').CronJob;
const Songs = require('./songs_controller');

exports.add = time => {
  new CronJob(
    time,
    Songs.updateLinks,
    function() {
      console.log('cron finished');
    },
    true
  );
};
