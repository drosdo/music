const Band = require('./bands_controller');
const Album = require('./albums_controller');
const Song = require('./songs_controller');
const Cron = require('./cron_controller');
const Dropbox = require('../../services/dropbox');
const _ = require('lodash');
const async = require('async');

exports.updateAll = (next) => {
  console.log(next);
  let myDate = new Date();
  Band.erase();
  Album.erase();
  Song.erase();

  Band.update((err, bands) => {
    async.each(bands, updateAlbums, err => {
      if (err) return next(err);
      myDate.setHours(myDate.getHours() + 4);
      Cron.add(myDate);
      next();
    });
  });
  function updateAlbums(band, callback) {
    Album.update(band, (err, albums) => {
      if (err) return callback(err);
      async.each(albums, updateSongs, err => {
        callback(err);
      });

      function updateSongs(album, callback) {
        Song.update(album, band, err => {
          callback(err);
        });
      }
    });
  }


};
