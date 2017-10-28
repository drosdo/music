const Album = require('../../models/dropbox/album');
const Band = require('../../models/dropbox/band');
const Song = require('../../models/dropbox/song');
const dropbox = require('../../services/dropbox');
const _ = require('lodash');
const async = require('async');
const moment = require('moment');
const fs = require('fs');
const Cron = require('./cron_controller');

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

    async.eachSeries(
      songs,
      (song, callback) => {
        saveSong(song, err => {
          console.log(song.name, ' finished');
          callback();
        });
      },
      function(err) {
        if (err) {
          throw err;
        }
        next(null, songs);
      }
    );

    function saveSong(song, next) {
      let songPath = `/Music/${band.name}/${album.name}/${song.name}`;
      let index = songs.indexOf(song);
      tempSongLink = {};
      async.waterfall(
        [
          callback => {
            let path = `/Music/${band.name}/${album.name}/${song.name}`;
            dropbox.getTemporaryLink2(path, songLink);
            function songLink(err, data) {
              tempSongLink = {
                link: data.link,
                expires: moment().add(4, 'hours')
              };

              callback(null, data.link);
            }
          },
          (url, callback) => {
            createWaveJSON(songPath, song.name, callback);
          }
        ],
        (err, data) => {
          if (err) return callback(err);
          let songItem = new Song({
            name: song.name,
            band: band.name,
            createdTime: song.client_modified,
            size: song.size,
            album: album.name,
            wave: data,
            tempSongLink
          });
          songItem.save(function(err) {
            console.log('saved song ' + song.name + ' callback');

            next(err);
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
      res.send(songs);
    });
};

exports.getAll = function(next) {
  Song.collection.find({}).toArray((err, data) => {
    if (err) throw err;
    next(data);
  });
};

function createWaveJSON(url, name, next) {
  let waveName = `${name.replace(/\.[^/.]+$/, '')}.json`;
  let wavePath = `./files/${waveName}`;
  let songPath = `./files/${name}`;
  let wave = '';

  async.waterfall(
    [
      callback => {
        console.log('download song', name);
        dropbox.download(url, name, songDownloaded);
        function songDownloaded(err, data) {
          callback();
        }
      },
      callback => {
        // create wavefile
        console.log('creating wavefile', name);

        let audiowave = require('child_process').spawn('audiowaveform', [
          '-i',
          songPath,
          '-o',
          wavePath,
          '-z',
          '256',
          '-b',
          '8'
        ]);

        audiowave.on('close', (code, signal) => {
          fs.readFile(wavePath, 'utf8', function(err, data) {
            wave = data;
            callback();
          });
        });
        //.on('error', err => callback(err));
      },
      callback => {
        console.log('wave-created');
        fs.unlinkSync(songPath);
        fs.unlinkSync(wavePath);
        callback();
      }
    ],
    err => {
      if (err) return next(err);
      next(null, wave);
    }
  );
}

exports.updateLinks = next => {
  let myDate = new Date();

  Song.collection.find().toArray((err, songs) => {
    if (err) return next(err);
    async.eachSeries(
      songs,
      (song, callback) => {
        let path = `/Music/${song.band}/${song.album}/${song.name}`;
        dropbox.getTemporaryLink2(path, (err, data) => {
          if (err) {
            return next(err);
          }
          console.log(song.name);

          let tempSongLink = {
            link: data.link,
            expires: moment().add(4, 'hours')
          };

          Song.findOne({ _id: song._id }, function(err, song) {
            if (err) {
              return next(err);
            }
            song.tempSongLink = {
              link: data.link,
              expires: moment().add(4, 'hours')
            };
            song.save(callback);
          });
        });
      },
      function(err) {
        if (err) {
          return next(err);
        }
        myDate.setHours(myDate.getHours() + 4);
        Cron.add(myDate);
        next(null, 'song links updated');
      }
    );
  });
};
