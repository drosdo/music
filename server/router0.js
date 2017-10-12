const Authentification = require('./controllers/authentification');
const passportService = require('./services/passport');
const passport = require('passport');
const async = require('async');
const ms = require('mediaserver');
const dropboxV2Api = require('dropbox-v2-api');
var path = require('path');
const sendSeekable = require('send-seekable');


const dropbox = dropboxV2Api.authenticate({
  token: 'WLGeOlInMSsAAAAAAAAAR9986UA_F3_-8weI9Cf_rI3wXhUoZELn-MjZs5KFDebm'
});
const fs = require('fs');

const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });

var pageToken = null;
var files = null;
var readable = fs.createReadStream('7_8-take2.mp3');
module.exports = function(app) {
  app.use(sendSeekable);

  app.get('/', requireAuth, function(req, res) {
    res.send({ message: 'super secret code 123' });
  });
  app.post('/signin', requireSignin, Authentification.signin);
  app.post('/signup', Authentification.signup);
  // app.get('/drive', function(req, res){ res.send(files) })


  app.get('/drive', function(req, res) {
    var writable = fs.createWriteStream('./7_8-take2.mp3');
    var dropboxObj = dropbox(
      {
        resource: 'files/download',
        parameters: {
          path: '/Public/7_8-take2.mp3'
        }
      },
      (err, result) => {
      }
    );
    dropboxObj.pipe(writable)
    console.log(writable)
    res.sendSeekable(dropboxObj, {type: 'audio/mp3',length: 30656178})

  });
  // function(req, res) {
  //   var fileId = '0B-iNq2K2dQkTVkFQSklXSW5SalE';
  //   var dest = fs.createWriteStream('2.mp3');
  //   drive.files
  //     .get(
  //       {
  //         fileId: fileId,
  //         alt: 'media'
  //       },
  //       {
  //         encoding: null // make sure that we get the binary data
  //       },
  //       function(err, buffer) {
  //         // I wrap this in a promise to handle the data
  //         if (err) reject(err);
  //         console.log('dddd')
  //         res.set('Content-Type', 'audio/mpeg');
  //         res.send(buffer);
  //
  //       }
  //     )
  //     // .on('end', function() {
  //     //   //res.pipe(dest);
  //     // })
  //     // .on('error', function(err) {
  //     //   console.log('Error during download', err);
  //     // })
  //     // .pipe(dest);
  // });
};
