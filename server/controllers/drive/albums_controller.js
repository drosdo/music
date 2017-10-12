const Album = require('../../models/album');
const Band = require('../../models/band');
const Drive = require('../../services/drive');
const _ = require('lodash');

// list albums by band

exports.update = function(req, res, next) {
  Band.findOne({ name: new RegExp(req.query.band, 'i') }, function(
    err,
    folder
  ) {
    if (err) {
      return res.send(err);
    }
    Drive.listFolderByFolders(req, res, saveAlbums, folder.driveFolderId);

    function saveAlbums(data) {
      Album.collection.remove();
      _.forEach(data.files, album => {
        let albumItem = new Album({
          name: album.name,
          band: req.query.band,
          driveFolderId: album.id
        });
        albumItem.save(function(err) {
          if (err) {
            return next(err);
          }
        });
      });
      res.send(data);
    }
  });

  // const path = '/MUSIC/songs/' + req.query.band;
  // const recursive = false;
  // const albums = Dropbox.list_folder_all_files(
  //   req,
  //   res,
  //   saveAlbums,
  //   path,
  //   recursive
  // );
  // function saveAlbums(albums) {
  //   Album.collection.remove();
  //   _.forEach(albums, album => {
  //     let albumItem = new Album({
  //       name: album.name,
  //       band: req.query.band
  //     });
  //     albumItem.save(function(err) {
  //       if (err) {
  //         return next(err);
  //       }
  //     });
  //   });
  //   res.send(albums);
  // }
};

exports.get = function(req, res, next) {
  Album.collection
    .find({ band: req.query.band })
    .toArray(function(err, result) {
      if (err) throw err;
      res.send(result);
    });
};

exports.saveAlbum = (res, name, band, driveFolderId, waveFolderId) => {
  Album.collection.remove();
  let albumItem = new Album({
    res,
    name,
    band,
    driveFolderId,
    waveFolderId
  });
  albumItem.save(function(err) {
    if (err) {
      return res.status(500).send(err);
    }
  });
};
