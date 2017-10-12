const Band = require('../../models/dropbox/band');
const Dropbox = require('../../services/dropbox');
const _ = require('lodash');

exports.update = function(req, res, next) {
  const bands = Dropbox.list_folder_all_files(
    req,
    res,
    saveBands,
    '/Music/',
    false
  );
  function saveBands(err, bands) {
    if (err) return next(err);
    console.log(bands);
    Band.collection.remove();
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
    res.send(bands);
  }
};

exports.get = function(req, res, next) {
  Band.collection.find({}).toArray(function(err, result) {
    if (err) throw err;
    res.send(result);
  });
};
