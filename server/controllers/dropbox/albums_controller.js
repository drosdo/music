const Album = require('../../models/dropbox/album');
const Dropbox = require('../../services/dropbox');
const _ = require('lodash');
const async = require('async');

exports.erase = next => {
  Album.collection.remove();
};

exports.update = function(band, next) {
  const path = '/Music/' + band.name;
  const recursive = false;
  Dropbox.list_folder_all_files(path, saveAlbums, recursive);
  function saveAlbums(err, albums) {
    if (err) return next(err);
    async.each(albums, saveAlbum, err => {
      next(null, albums);
    });
    function saveAlbum(album, callback) {
      let albumItem = new Album({
        name: album.name,
        band: band.name
      });
      albumItem.save(function(err) {
        callback(err);
      });
    }
  }
};

exports.get = function(req, res, next) {
  const band = new RegExp(req.query.band, 'i');
  Album.collection.find({ band: band }).toArray(function(err, result) {
    if (err) throw err;
    res.send(result);
  });
};

exports.getAll = function(next) {
  Album.collection.find({}).toArray((err, data) => {
    if (err) throw err;
    next(data);
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
