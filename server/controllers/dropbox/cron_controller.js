var CronJob = require('cron').CronJob;
const Update = require('./update_controller');

exports.add = time => {
  new CronJob(
    time,
    Update.updateAll,
    function() {
      console.log('cron finished');
    },
    true
  );
};
