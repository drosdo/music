const _ = require('lodash');

const Authentification = require('./controllers/authentification');
const Bands = require('./controllers/dropbox/bands_controller');
const Albums = require('./controllers/dropbox/albums_controller');
const Songs = require('./controllers/dropbox/songs_controller');
const Upload = require('./controllers/dropbox/upload_controller');

const dropbox = require('./services/dropbox');

//const googleDrive = require('./services/drive');

const passportService = require('./services/passport');
const passport = require('passport');
var path = require('path');
// const multer = require('multer');
// var token =
//   'ya29.GlvdBEUbfTop7fdD6Mau6OudUKUbrLRrj3_JJcNne55hIH_SLggSJFj_Se_pkkjVbBhOacDOgCzKhSyTpj7beHtIXJrPio_3yj-ORHY7o6g6MiKxflXbjOn8JPkL';
// const dropbox = require('./services/dropbox');
const fs = require('fs');

const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });

var pageToken = null;
//
// const storage = multer.diskStorage({
//   destination: './files/',
//   filename(req, file, cb) {
//     console.log(file);
//     cb(null, `${file.originalname}`);
//   }
// });
// const upload = multer({ storage });

module.exports = function(app) {
  app.get('/', requireAuth, function(req, res) {
    res.send({ message: 'super secret code 123' });
  });
  app.post('/signin', requireSignin, Authentification.signin);
  app.post('/signup', Authentification.signup);
  app.get('/update-bands', Bands.update);
  app.get('/get_bands', Bands.get);
  app.get('/update-albums', Albums.update);
  app.get('/get-albums', Albums.get);
  app.get('/get-songs', Songs.get);
  app.get('/get-dropbox-file-link', dropbox.getTemporaryLink);

  // app.get('/get_song_list', function(req, res, next) {
  //   passport.authenticate('jwt', { session: false }, function(err, user, info) {
  //     if (err) {
  //       res.send(err);
  //     }
  //     console.log(user);
  //     if (!user) {
  //       dropbox.list_folder(req, res);
  //       if (req.query.foo == 'secret' && req.query.path == 'songs') {
  //         dropbox.list_folder(req, res);
  //       } else {
  //         res.status(422).send({ error: 'You must provide secret link' });
  //       }
  //     } else {
  //       dropbox.list_folder(req, res);
  //     }
  //   })(req, res, next);
  // });

  let isFoldersCreated = false;
  app.post('/upload', Upload.multerUpload, (req, res) => {
    let itemsProcessed = 0;
    let files = req.files;
    let isLast = false;
    let folderPath = req.body.fullPath[0];
    let folderName = folderPath.substr(0, folderPath.lastIndexOf('/'));
    let band = req.body.band[0];
    let albumFolderId = '';

    if (!isFoldersCreated) {
      Upload.createAlbumFolder(req, res, albumFolderCreated, folderName, band);
    }

    function albumFolderCreated(err, data) {
      if (err) res.status(500).send(err);
      console.log(albumFolderCreated, data);
      Upload.createWaveFolder(req, res, waveFolderCreated, folderName, band);
    }
    function waveFolderCreated(err, data) {
      console.log(err, data);
      if (err) res.status(500).send(err);
      console.log(waveFolderCreated, data);
      isFoldersCreated = true;
      Albums.saveAlbum(res, folderName, band);
      uploadFiles();
    }
    function uploadFiles() {
      _.forEach(files, file => {
        itemsProcessed++;

        isLast = itemsProcessed === files.length;

        console.log('uploadFileToFolder', isLast);
        Upload.uploadWithWave(
          req,
          res,
          uploaded,
          file,
          folderName,
          band,
          isLast
        );
      });
      function uploaded(err, last) {
        if (err) res.status(500).send(err);
        console.log('uploaded', last);
        if (last) {
          res.sendStatus(200);
        }
      }
    }
  });
};
