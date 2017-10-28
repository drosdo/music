const Band = require('../../models/dropbox/band');
const Dropbox = require('../../services/dropbox');
const _ = require('lodash');

exports.erase = (next) => {
  Band.collection.remove();
};


exports.update = (next) => {
  const bands = Dropbox.list_folder_all_files(
    '/Music',
    saveBands,
    false
  );
  function saveBands(err, bands) {
    if (err) return next(err);
    _.forEach(bands, band => {
      let bandItem = new Band({
        name: band.name
      });
      bandItem.save(function(err) {
        if (err) {
          return next(err);
        }
      });
    });
    next(null, bands);
  }
};

exports.get = function(next) {
  Band.collection.find({}).toArray(function(err, data) {
    if (err) throw err;
    //res.send(result);
    next(data)
  });
};
