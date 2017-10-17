const _ = require('lodash');
const multer = require('multer');

const Authentification = require('./controllers/authentification');
const Bands = require('./controllers/dropbox/bands_controller');
const Albums = require('./controllers/dropbox/albums_controller');
const Songs = require('./controllers/dropbox/songs_controller');
const Upload = require('./controllers/dropbox/upload_controller');
const Update = require('./controllers/dropbox/update_controller');

//const Upload = new UploadController.upload();

const dropbox = require('./services/dropbox');

//const googleDrive = require('./services/drive');

const passportService = require('./services/passport');
const passport = require('passport');
var path = require('path');


const fs = require('fs');

const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });

var pageToken = null;
const storage = multer.diskStorage({
  destination: './files/',
  filename(req, file, cb) {
    console.log(file);
    cb(null, `${file.originalname}`);
  }
});

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
  app.get('/update-all', Update.updateAll);
  app.post('/upload', multer({ storage }).any('file'), Upload.init);
};
