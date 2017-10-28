const Band = require('./bands_controller');
const Album = require('./albums_controller');
const Song = require('./songs_controller');
const Dropbox = require('../../services/dropbox');
const _ = require('lodash');
const async = require('async');

exports.updateAll = next => {
  
  Band.erase();
  Album.erase();
  Song.erase();

  Band.update((err, bands) => {

    async.eachSeries(
      bands, updateAlbums,
      err => {
        if (err) {
          return next(err);
        }

        next();
      }
    );

  });
  function updateAlbums(band, onAlbumsUpdated) {
    Album.update(band, (err, albums) => {
      if (err) return callback(err);
      async.eachSeries(
        albums,
        (album, callback) => {
          console.log('updateAlbums album', album);
          Song.update(album, band, err => {
            console.log(album.name, 'finish');
            callback();
          });
        },
        function(err) {
          if (err) {
            throw err;
          }
          console.log('all albums of', band.name);
          onAlbumsUpdated();
        }
      );
    });
  }
};
