var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;
var oauth2Client = new OAuth2(
  '704020984578-90diddgrikojvgaoocuuvmesu5shemdu.apps.googleusercontent.com',
  'bmavmRX-f5gydh6M-_e9lwb5',
  'http://localhost:8080'
);
oauth2Client.setCredentials({
  access_token:
    'ya29.GlzeBAtdCme_3i-z4RHSPJH98D5EFwiE3_XHy3ywaS4sq4p4deusEVNwrXb0ZfVkd-zLPVsWmZVyYgY7hg1oiqJTWHiuzFY6RKWCWfSm6lVS-off9di74QkDt2qL5g',
  refresh_token: '1/RRjs0KHZnGYdpE2KqgZJK7QXsKbdk2jgYC69UrCxH1M'
  // Optional, provide an expiry_date (milliseconds since the Unix Epoch)
  // expiry_date: (new Date()).getTime() + (1000 * 60 * 60 * 24 * 7)
});
var drive = google.drive({
  version: 'v3',
  auth: oauth2Client
});

// oauth2Client.refreshAccessToken(function(err, tokens) {
//   res.send({
//     access_token: tokens.access_token
//   });
// });
exports.find = function(req, res, next, params) {
  drive.files.list(params, (err, data) => {
    if (err) {
      next(err);
      return;
    }

    next(null, data);
    //process.exit();
  }).on('error', err => next(err));
};
exports.listFolderByFiles = function(req, res, next, folderId) {
  var params = {
    mimeType: 'application/vnd.google-apps.folder',
    q: 'parents in "' + folderId + '"',
    fields: 'files(id, name, webContentLink, size, createdTime)'
  };

  console.log(drive);
  drive.files.list(params, (err, data) => {
    if (err) {
      next(err);
      return;
    }

    next(null, data);
    //process.exit();
  }).on('error', err => next(err));
};
exports.listFolderByFolders = (req, res, next, folderId) => {

  var params = {
    mimeType: 'application/vnd.google-apps.folder',
    q: 'parents in "' + folderId + '"'
  };
  console.log(drive);
  drive.files.list(params, (err, data) => {
    if (err) {
      next(err);
      return;
    }

    next(null, data);
    //process.exit();
  }).on('error', err => next(err));
};
exports.upload = function(req, res, next, params) {
  drive.files.create(params, (err, data) => {
    if (err) {
      next(err);
      return;
    }

    next(null, data);
  }).on('error', err => next(err));
};

exports.getFileData = function(req, res, next, fileId) {
  var params = {
    fileId,
    fields: 'id, webContentLink, title, fileSize, createdDate'
  };
  drive.files.get(params, function(err, data) {
    if (err) {
      next(err);
      return;
    }

    next(null, data);
  }).on('error', err => next(err));
};
