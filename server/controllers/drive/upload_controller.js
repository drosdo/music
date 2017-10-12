const _ = require('lodash');
const multer = require('multer');
const fs = require('fs');
const Band = require('../models/band');
const Song = require('../models/song');

const googleDrive = require('../services/drive');

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

    bandFolderId = data.driveFolderId;
    var params = {
      resource: {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
        parents: [bandFolderId]
      },
      fields: 'id'
    };
    googleDrive.upload(req, res, uploaded, params);
    function uploaded(err, data) {
      if (err) return next(err);
      next(null, data);
    }
  });
  //
};

exports.createWaveFolder = function(req, res, next, folderName, band) {
  Band.findOne({ name: new RegExp(band, 'i') }, function(err, data) {
    if (err) return next(err);

    let waveFolderId = data.waveFolderId;

    var params = {
      resource: {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
        parents: [waveFolderId]
      },
      fields: 'id, name'
    };
    googleDrive.upload(req, res, uploaded, params);
    function uploaded(err, data) {
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
  folderId,
  waveFolderId,
  albumName,
  band,
  isLast
) {
  let source = './files/' + file.filename;
  let waveName = file.filename.replace(/\.[^/.]+$/, '') + '.dat';
  let wave = './files/' + waveName;
  let isSongUploaded = false;
  let isWaveUploaded = false;
  let driveWaveId = '';
  let waveWebContentLink = '';

  createWaveFile(source, wave, waveUpload);

  function waveUpload(err, data) {
    if (err !== null) {
      next(err);
      return;
    }

    let waveParams = {
      resource: {
        name: waveName,
        parents: [waveFolderId]
      },
      media: {
        mimeType: 'application/octet-stream',
        body: fs.createReadStream(wave)
      },
      fields: 'id, webContentLink'
    };
    googleDrive.upload(req, res, waveUploaded, waveParams);
  }

  function waveUploaded(err, data) {
    fs.unlinkSync(wave);
    if (err !== null) {
      next(err);
      return;
    }
    driveWaveId = data.id;
    waveWebContentLink = data.webContentLink;
    console.log('waveUploaded', data);
    let songParams = {
      resource: {
        name: file.filename,
        parents: [folderId]
      },
      media: {
        mimeType: 'audio/mp3',
        body: fs.createReadStream(source)
      },
      fields: 'id, webContentLink, size, createdTime'
    };
    googleDrive.upload(req, res, songUploaded, songParams);
  }

  function songUploaded(err, data) {
    fs.unlinkSync(source);
    if (err !== null) {
      next(err);
      return;
    }
    console.log('song');
    console.log(data);
    let song = new Song({
      name: file.filename,
      band: band,
      driveFileId: data.id,
      webContentLink: data.webContentLink,
      createdTime: data.createdTime,
      size: data.size,
      driveWaveId: driveWaveId,
      waveWebContentLink: waveWebContentLink,
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
