const _ = require('lodash');
const multer = require('multer');
const fs = require('fs');
const Band = require('../../models/dropbox/band');
const Song = require('../../models/dropbox/song');

const dropbox = require('../../services/dropbox');

const storage = multer.diskStorage({
  destination: './files/',
  filename(req, file, cb) {
    console.log(file);
    cb(null, `${file.originalname}`);
  }
});
exports.multerUpload = multer({ storage }).any('file');

exports.createAlbumFolder = function(req, res, next, folderName, band) {
  let bandFolderId = '';
  Band.findOne({ name: new RegExp(band, 'i') }, function(err, data) {
    if (err) return next(err);

    let path = '/Music/' + band + '/' + folderName;
    dropbox.createFolder(req, res, folderCreated, path);
    function folderCreated(err, data) {
      if (err) return next(err);
      next(null, data);
    }
  });
  //
};

exports.createWaveFolder = function(req, res, next, folderName, band) {
  Band.findOne({ name: new RegExp(band, 'i') }, function(err, data) {
    if (err) return next(err);

    let path = '/waves/' + band + '/' + folderName;
    dropbox.createFolder(req, res, folderCreated, path);
    function folderCreated(err, data) {
      if (err) return next(err);
      next(null, data);
    }
  });
  //
};

function createWaveFile(source, wave, next) {
  var audiowave = require('child_process').spawn('audiowaveform', [
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
        if (err !== null) {
          next(err);
        } else {
          next(null, data);
        }
      });
    })
    .on('error', err => next(err));
}

exports.uploadWithWave = function(
  req,
  res,
  next,
  file,
  albumName,
  band,
  isLast
) {
  let source = './files/' + file.filename;
  let waveName = file.filename.replace(/\.[^/.]+$/, '') + '.dat';
  let wave = './files/' + waveName;
  let isSongUploaded = false;
  let isWaveUploaded = false;

  createWaveFile(source, wave, waveUpload);

  function waveUpload(err, data) {
    if (err !== null) {
      next(err);
      return;
    }
    let path = '/waves/' + band + '/' + albumName + '/' + waveName;
    let readStream = fs.createReadStream(wave);

    dropbox.uploadFile(req, res, waveUploaded, path, readStream);
  }

  function waveUploaded(err, data) {
    if (err !== null) {
      next(err);
      return;
    }
    console.log('waveUploaded', data);

    fs.unlinkSync(wave);

    let path = '/Music/' + band + '/' + albumName + '/' + file.filename;
    let readStream = fs.createReadStream(source);
    dropbox.uploadFile(req, res, songUploaded, path, readStream);
  }

  function songUploaded(err, data) {
    if (err !== null) {
      next(err);
      return;
    }
    console.log('song');
    console.log(data);
    fs.unlinkSync(source);


    let song = new Song({
      name: file.filename,
      band: band,
      createdTime: dataclient_modified,
      size: data.size,
      album: albumName
    });

    song.save(err => {
      if (err) {
        return next(err);
      }
      next(null, isLast);
    });
  }
};

// var dropbox1 = dropbox(
//   {
//     resource: 'files/upload',
//     parameters: {
//       path: '/waves/' + waveName
//     },
//     readStream: fs.createReadStream(wave)
//   },
//   (err, result) => {
//     if (err) {
//       res.status(500).send('Something broke!');
//     } else {
//       var dropbox2 = dropbox(
//         {
//           resource: 'files/upload',
//           parameters: {
//             path: '/songs/' + req.file.originalname
//           },
//           readStream: fs.createReadStream(source)
//         },
//         (err, result) => {
//           if (err) {
//             res.status(500).send('Something broke!');
//           }
//           res.status(200).send('OK!');
//         }
//       );
//     }
//   }
// );
