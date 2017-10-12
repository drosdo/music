const dropboxV2Api = require('dropbox-v2-api');

const dropbox = dropboxV2Api.authenticate({
  token: 'WLGeOlInMSsAAAAAAAAAR9986UA_F3_-8weI9Cf_rI3wXhUoZELn-MjZs5KFDebm'
});
const songsUrl = '/Music/';
const wavesUrl = '/waves/';

exports.list_folder_all_files = function(req, res, next, path, recursive) {
  let resultAll = [];

  function dxContinue(cursor) {
    dropbox(
      {
        resource: 'files/list_folder/continue',
        parameters: {
          cursor
        }
      },
      (err, data) => {
        if (err) {
          return next(err);
        }
        resultAll = resultAll.concat(data.entries);
        if (data.has_more) {
          dxContinue(data.cursor);
        } else {
          next(null, resultAll);
        }
      }
    );
  }
  dropbox(
    {
      resource: 'files/list_folder',
      parameters: {
        path,
        recursive,
        include_media_info: true
      }
    },
    (err, data) => {
      if (err) {
        return next(err);
      }
      if (data.has_more) {
        resultAll = data.entries;
        dxContinue(data.cursor);
      } else {
        next(null, data.entries);
      }
    }
  );
};

exports.getTemporaryLink = function(req, res, next) {
  console.log(req.query.path);
  var dx = dropbox(
    {
      resource: 'files/get_temporary_link',
      parameters: {
        path: req.query.path
      }
    },
    (err, data) => {
      if (err) {
        return res.send(err);
      }
      res.send(data);
    }
  ).on('error', (err)=> res.send(err));
};

exports.get_updates = function(req, res, next, path, recursive) {
  dropbox(
    {
      resource: 'files/list_folder/continue',
      parameters: {
        cursor: 'AAHxvUopPa397xkqnOp7cT6Y81FHo71f62poTZ0TY7wvqi39ELs5-e0p2TGEOQaXQvrheXijmoB_HKqRityYt_0AL5snSQIq4ERnnxCYc6c2NkGCNye_z3XLMjRFILWH8Da6I8L31Nv9orImtsB4mSKIg9uY4rt7V0gveZ_en5Y4SkyYHsAXg5sNsDkMJwGAbYUnUzGHBvwJXzu7SNS3Zst2GfZmtmCVbXwottp6MVRoXQ'
      }
    },
    (err, data) => {
      if (err) {
        return next(err);
      }
      next(null, data);
    }
  );
};
exports.createFolder = (req, res, next, path) => {
  dropbox(
    {
      resource: 'files/create_folder_v2',
      parameters: {
        path
      }
    },
    (err, data) => {
      if (err) {
        return next(err);
      }
      next(null, data);
    }
  );
}

exports.uploadFile = (req, res, next, path, readStream) => {
  dropbox(
    {
      resource: 'files/upload',
      parameters: {
        path
      },
      readStream
    },
    (err, data) => {
      if (err) {
        return next(err);
      }
      next(null, data);
    }
  );
}
