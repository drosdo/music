'use strict';
const _ = require('lodash');
const multer = require('multer');
const fs = require('fs');
const Band = require('../../models/dropbox/band');
const Song = require('../../models/dropbox/song');
const Albums = require('./albums_controller');

const dropbox = require('../../services/dropbox');

const storage = multer.diskStorage({
  destination: './files/',
  filename(req, file, cb) {
    console.log(file);
    cb(null, `${file.originalname}`);
  }
});
// exports.multerUpload = multer({ storage }).any('file');

exports.upload = class Upload {
  constructor(req, res) {}

  uploadAlbum(req, res, next) {
    this.req = req;
    this.res = res;
    this.files = req.files;
    this.folderPath = req.body.fullPath[0];
    this.folderName = this.folderPath.substr(
      0,
      this.folderPath.lastIndexOf('/')
    );
    this.band = req.body.band[0];

    Albums.saveAlbum(this.res, this.folderName, this.band);
    this.uploadFiles();
  }

  multerUpload(req, res, next) {
    console.log('multerUpload');
    multer({ storage }).any('file');
  }

  uploadFiles() {
    this.filesCompleteCount = 0;
    _.times(this.files.length, index => {
      this.uploadWithWave(index);
    });
  }
  uploadFilesCallback(err, isLast) {
    if (err) return this.error(err);
    console.log('uploaded', isLast);
    if (isLast) {
      this.success();
    }
  }
  // CREATE WAVE FILE
  createWaveFile(source, wave, i) {
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
          if (err !== null) return this.error(err);
          this.createWaveFileCallback(i);
        });
      })
      .on('error', err => this.error(err));
  }
  createWaveFileCallback(i) {
    // TODO загнать это в this.fileData[i]
    let file = this.files[i];
    let waveName = `${file.filename.replace(/\.[^/.]+$/, '')}.dat`;
    let wave = `./files/${waveName}`;
    let path = `/waves/${this.band}/${this.folderName}/${waveName}`;
    let readStream = fs.createReadStream(wave);

    dropbox.uploadFile(
      this.req,
      this.res,
      this.waveUploadCallback.bind(this),
      path,
      readStream,
      i
    );
  }
  waveUploadCallback(err, data, i) {
    if (err !== null) return this.error(err);
    let wave = './files/' + data.name;
    let source = './files/' + this.files[i].filename;

    console.log('waveUploaded', data);

    fs.unlinkSync(wave);

    let path = `/Music/${this.band}/${this.folderName}/${this.files[i]
      .filename}`;
    let readStream = fs.createReadStream(source);
    dropbox.uploadFile(
      this.req,
      this.res,
      this.songUploadedCallback.bind(this),
      path,
      readStream,
      i
    );
  }
  songUploadedCallback(err, data, i) {
    if (err !== null) return this.error(err);
    console.log('song');
    console.log(data);
    let source = './files/' + this.files[i].filename;
    fs.unlinkSync(source);
    this.saveSongToDb(
      {
        name: this.files[i].filename,
        band: this.band,
        createdTime: data.client_modified,
        size: data.size,
        album: this.folderName
      },
      i
    );
  }
  saveSongToDb(data, i) {
    let song = new Song(data);

    song.save(err => {
      if (err) {
        return this.error(err);
      }
      this.songFinishCallback();
    });
  }
  songFinishCallback() {
    console.log('song finished');
    this.filesCompleteCount++;
    console.log(this.filesCompleteCount);
    if (this.filesCompleteCount === this.files.length) {
      this.success();
    }
  }
  success() {
    this.res.status(200).send('all uploaded');
  }
  error(err) {
    this.res.status(500).send(err);
  }

  uploadWithWave(i) {
    let file = this.files[i];
    let source = `./files/${file.filename}`;
    let waveName = `${file.filename.replace(/\.[^/.]+$/, '')}.dat`;
    let wave = `./files/${waveName}`;

    this.createWaveFile(source, wave, i);
  }
};
