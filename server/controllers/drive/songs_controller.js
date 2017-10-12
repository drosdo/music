const Album = require('../../models/drive/album');
const Band = require('../../models/drive/band');
const Song = require('../../models/drive/song');
const Drive = require('../../services/drive');
const _ = require('lodash');

// list albums by band
exports.updateAllSongs = function(req, res, next) {};

exports.update = function(req, res, next) {
  Album.findOne({ name: new RegExp(req.query.album, 'i') }, function(
    err,
    folder
  ) {
    if (err) {
      return res.send(err);
    }
    Drive.listFolderByFiles(req, res, saveSongs, folder.driveFolderId);

    function saveSongs(data) {
      Song.collection.remove();
      _.forEach(data.files, song => {
        let songItem = new Song({
          name: song.name,
          band: req.query.band,
          driveFileId: song.id,
          webContentLink: song.webContentLink,
          createdTime: song.createdTime,
          size: song.size
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
