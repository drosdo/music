const Album = require('../../models/dropbox/album');
const Dropbox = require('../../services/dropbox');
const _ = require('lodash');

exports.update = function(req, res, next) {

  const path = '/Music/' + req.query.band;
  const recursive = false;
  const albums = Dropbox.list_folder_all_files(
    req,
    res,
    saveAlbums,
    path,
    recursive
  );
  function saveAlbums(albums) {
    Album.collection.remove();
    _.forEach(albums, album => {
      let albumItem = new Album({
        name: album.name,
        band: req.query.band
      });
      albumItem.save(function(err) {
        if (err) {
          return next(err);
        }
      });
    });
    res.send(albums);
  }
};

exports.get = function(req, res, next) {
  Album.collection
    .find({band: req.query.band})
    .toArray(function(err, result) {
      if (err) throw err;
      res.send(result);
    });
};

exports.saveAlbum = (res, name, band) => {
  //Album.collection.remove();
  let albumItem = new Album({
    name,
    band
  });
  albumItem.save(function(err) {
    if (err) {
      return res.status(500).send(err);
    }
  });
};
