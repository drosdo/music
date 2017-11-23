const bandsController = require('./bands_controller');
const albumsController = require('./albums_controller');
const songsController = require('./songs_controller');

const _ = require('lodash');
const async = require('async');

exports.get = (req, res, next) => {
  let music = {
    bands: [],
    albums: []
  };
  async.series(
    {
      bands: callback => {
        bandsController.get(data => callback(null, data));
      },
      albums: callback => {
        albumsController.getAll(data => callback(null, data));
      }
    },
    function(err, results) {
      res.send(results);
    }
  );
};

exports.getAll = (req, res, next) => {
  let music = {
    bands: [],
    albums: [],
    songs: []
  };
  async.series(
    {
      bands: callback => {
        bandsController.get(data => callback(null, data));
      },
      albums: callback => {
        albumsController.getAll(data => callback(null, data));
      },

      songs: callback => {
        songsController.getAll(data => callback(null, data));
      }
    },
    function(err, results) {
      res.send(results);
    }
  );
};

exports.getByAlbum = (req, res, next) => {
  let music = {
    bands: [],
    albums: [],
    songs: []
  };
  async.series(
    {
      bands: callback => {
        bandsController.get(data => callback(null, data));
      },
      albums: callback => {
        albumsController.getAll(data => callback(null, data));
      },

      songs: callback => {
        songsController.get(req.query.band, req.query.album, data => callback(null, data));
      }
    },
    function(err, results) {
      res.send(results);
    }
  );
};
