const Album = require('../../models/dropbox/album');
const Band = require('../../models/dropbox/band');
const Song = require('../../models/dropbox/song');
const dropbox = require('../../services/dropbox');
const _ = require('lodash');

// list albums by band
exports.updateAllSongs = function(req, res, next) {};

exports.update = function(req, res, next) {
  const album = req.query.album;
  Album.findOne({ name: new RegExp(album, 'i') }, function(
    err,
    folder
  ) {
    if (err) {
      return next(err);
    }
    dropbox.list_folder_all_files(req, res, saveSongs, path, recursive);

    function saveSongs(data) {
      Song.collection.remove();
      _.forEach(data.entries, song => {
        let songItem = new Song({
          name: song.name,
          band: req.query.band,
          createdTime: song.client_modified,
          size: song.size,
          album: album
        });
        songItem.save(function(err) {
          if (err) {
            return next(err);
          }
        });
      });
      res.send(data);
    }
  });
};

exports.get = function(req, res, next) {
  Song.collection
    .find({
      band: new RegExp(req.query.band, 'i'),
      album: new RegExp(req.query.album, 'i')
    })
    .toArray((err, result) => {
      if (err) throw err;
      res.send(result);
    });
};
