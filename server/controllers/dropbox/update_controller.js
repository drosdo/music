const Band = require('./bands_controller');
const Album = require('./albums_controller');
const Song = require('./songs_controller');
const Dropbox = require('../../services/dropbox');
const _ = require('lodash');
const async = require('async');

exports.updateAll = (req, res, next) => {
  Band.erase();
  Album.erase();
  Song.erase();

  Band.update((err, bands) => {
    async.each(bands, updateAlbums, err => {
      if(err) return res.status(500).send(err);
      res.status(200).send('Updated');
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
