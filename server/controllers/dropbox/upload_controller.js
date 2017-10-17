'use strict';
const _ = require('lodash');
const multer = require('multer');
const fs = require('fs');
const Band = require('../../models/dropbox/band');
const Song = require('../../models/dropbox/song');
const Albums = require('./albums_controller');
const async = require('async');

const dropbox = require('../../services/dropbox');

const storage = multer.diskStorage({
  destination: './files/',
  filename(req, file, cb) {
    console.log(file);
    cb(null, `${file.originalname}`);
  }
});
// exports.multerUpload = multer({ storage }).any('file');

class Upload {
  constructor(req, res, next) {
    this.req = req;
    this.res = res;
    this.next = next;
    this.uploadAlbum();
  }

  uploadAlbum() {
    this.files = this.req.files;
    this.folderPath = this.req.body.fullPath[0];
    this.folderName = this.folderPath.substr(
      0,
      this.folderPath.lastIndexOf('/')
    );
    this.band = this.req.body.band[0];
    Albums.saveAlbum(this.res, this.folderName, this.band);
    this.asyncUploadFiles();
  }

  multerUpload(req, res, next) {
    console.log('multerUpload');
    multer({ storage }).any('file');
  }

  asyncUploadFiles() {
    console.log('asyncUploadFiles');
    async.each(
      this.files,
      (file, callback) => {
        let source = `./files/${file.filename}`;
        let waveName = `${file.filename.replace(/\.[^/.]+$/, '')}.dat`;
        let wave = `./files/${waveName}`;
        let wavePath = `/waves/${this.band}/${this.folderName}/${waveName}`;
        let songPath = `/Music/${this.band}/${this
          .folderName}/${file.filename}`;
        async.series(
          {
            // create wave
            wave: callback => {
              this.createWaveFile(source, wave, callback);
            }, // upload wave
            uploadedWave: callback => {
              console.log('start upload wave', wave);
              let readStream = fs.createReadStream(wave);
              dropbox.uploadFile2(wavePath, readStream, callback);
            }, //upload song
            uploadedSong: callback => {
              console.log('start upload song', source);
              fs.unlinkSync(wave);
              let readStream = fs.createReadStream(source);
              dropbox.uploadFile2(songPath, readStream, callback);
            }
          },
          (err, data) => {
            if (err) return callback(err);

            fs.unlinkSync(source);
            //save to db
            let songData = {
              name: file.filename,
              band: this.band,
              createdTime: data.uploadedSong.client_modified,
              size: data.uploadedSong.size,
              album: this.folderName
            };
            let song = new Song(songData);
            console.log('songUploaded', songData);
            song.save(err => {
              console.log(err);
              callback(err);
            });
          }
        );
      },
      err => {
        console.log('all series callback');
        if (err) return this.error(err);
        this.success();
      }
    );
  }

  // CREATE WAVE FILE
  createWaveFile(source, wave, next) {
    let audiowave = require('child_process').spawn('audiowaveform', [
      '-i',
      source,
      '-o',
      wave,
      '-z',
      '256',
      '-b',
      '8'
    ]);

    audiowave
      .on('close', (code, signal) => {
        fs.readFile(wave, (err, data) => {
          next(err, wave);
        });
      })
      .on('error', err => next(err));
  }
  success() {
    this.res.status(200).send('all uploaded');
  }
  error(err) {
    this.res.status(500).send(err);
  }

}

exports.init = function(req, res, next) {
  return new Upload(req, res, next);
};
