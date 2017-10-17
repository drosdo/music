const Album = require('../../models/dropbox/album');
const Band = require('../../models/dropbox/band');
const Song = require('../../models/dropbox/song');
const dropbox = require('../../services/dropbox');
const _ = require('lodash');
const async = require('async');
const moment = require('moment');

exports.erase = next => {
  Song.collection.remove();
};

exports.update = function(album, band, next) {
  dropbox.list_folder_all_files(
    `/Music/${band.name}/${album.name}`,
    saveSongs,
    false
  );

  function saveSongs(err, songs) {
    if (err) return next(err);
    async.each(songs, saveSong, err => {
      next(null, songs);
    });
    function saveSong(song, callback) {
      let index = songs.indexOf(song);
      tempSongLink = {};
      tempWaveLink = {};
      async.series(
        [
          callback => {
            let path = `/Music/${band.name}/${album.name}/${song.name}`;
            dropbox.getTemporaryLink2(path, songLink);
            function songLink(err, data) {
              if (err) return callback(err);
              tempSongLink = {
                link: data.link,
                expires: moment().add(4, 'hours')
              };

              callback();
            }
          },
          callback => {
            let waveName = `${song.name.replace(/\.[^/.]+$/, '')}.dat`;
            let path = `/waves/${band.name}/${album.name}/${waveName}`;
            dropbox.getTemporaryLink2(path, waveLink);
            function waveLink(err, data) {
              if (err) return callback(err);
              tempWaveLink = {
                link: data.link,
                expires: moment().add(4, 'hours')
              };
              callback();
            }
          }
        ],
        err => {
          if (err) return callback(err);
          let songItem = new Song({
            name: song.name,
            band: band.name,
            createdTime: song.client_modified,
            size: song.size,
            album: album.name,
            tempWaveLink,
            tempSongLink
          });
          songItem.save(function(err) {
            callback(err);
          });
        }
      );
    }
  }
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
      if (err) return res.status(500).send(err);
      var songsWithLinks = [];
      async.each(
        songs,
        (song, callback) => {
          let index = songs.indexOf(song);
          songsWithLinks[index] = song;
          console.log('song', index);
          async.series(
            [
              callback => {
                let path = `/Music/${req.query.band}/${req.query
                  .album}/${song.name}`;
                dropbox.getTemporaryLink2(path, songLink);
                function songLink(err, data) {
                  if (err) return callback(err);
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
                  if (err) return callback(err);
                  songsWithLinks[index].tempWaveLink = data.link;
                  callback();
                }
              }
            ],
            err => {
              if (err) return callback(err);
              callback();
            }
          );
        },
        err => {
          console.log(err);
          if (err) return res.status(500).send(err);
          res.send(songsWithLinks);
        }
      );
    });
};
function getFileLinks(band, album, song, songsLength, i) {
  let songPath = `/Music/${band}/${album}/${song.name}`;
  dropbox.getTemporaryLink2;
}
