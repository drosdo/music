const Album = require('../../models/dropbox/album');
const Band = require('../../models/dropbox/band');
const Song = require('../../models/dropbox/song');
const dropbox = require('../../services/dropbox');
const _ = require('lodash');
const async = require('async');

// list albums by band
exports.updateAllSongs = function(req, res, next) {};

exports.update = function(req, res, next) {
  const album = req.query.album;
  Album.findOne({ name: new RegExp(album, 'i') }, function(err, folder) {
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
  const band = new RegExp(req.query.band, 'i');
  const album = new RegExp(req.query.album, 'i');

  Song.collection
    .find({
      band,
      album
    })
    .toArray((err, songs) => {
      if (err) throw err;
      var songsWithLinks = [];
      async.each(
        songs,
        (song, callback) => {
          let index = songs.indexOf(song);
          songsWithLinks[index] = song;
          async.series(
            [
              callback => {
                let path = `/Music/${req.query.band}/${req.query
                  .album}/${song.name}`;
                dropbox.getTemporaryLink2(path, songLink);
                function songLink(err, data) {
                  if(err) return callback(err);
                  songsWithLinks[index].tempSongLink = data.link;
                  callback();
                }
              },
              callback => {
                let waveName = `${song.name.replace(/\.[^/.]+$/, '')}.dat`;
                let path = `/waves/${req.query.band}/${req.query
                  .album}/${waveName}`;
                dropbox.getTemporaryLink2(path, waveLink);
                function waveLink(err, data) {
                  if(err) return callback(err);
                  songsWithLinks[index].tempWaveLink = data.link;
                  callback();
                }
              }
            ],
            (err, data) => {
              callback();
            }
          );
        },
        err => {
          // console.log('songs', songsWithLinks);
          res.send(songsWithLinks);
        }
      );
    });
};
function getFileLinks(band, album, song, songsLength, i) {
  let songPath = `/Music/${band}/${album}/${song.name}`;
  dropbox.getTemporaryLink2;
}
