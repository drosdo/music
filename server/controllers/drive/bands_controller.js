const Band = require('../../models/band');
const Drive = require('../../services/drive');
const _ = require('lodash');

// list folder by band

const rootFolderID = '0B-iNq2K2dQkTMTBLd1pvdEtNMEk'; //music
const rootWaveFolderID = '0B-iNq2K2dQkTaXgwS1dTd0kzYVE'; //_waves

exports.update = function(req, res, next) {
  let wavesBands = [];
  // let params = {
  //   mimeType: 'application/vnd.google-apps.folder',
  //   q: 'name = "_waves"'
  // }
  // Drive.find(req, res, findWaveFolder, params);
  //
  // function findWaveFolder(result) {
  //   res.send(result)
  //
  // }
  Drive.listFolderByFolders(req, res, findWaveAlbums, rootWaveFolderID);
  function findWaveAlbums(result) {
    wavesBands = result.files;
    function getWaveFolderId(band) {
      return _.result(_.find(wavesBands, (wave) =>{
          return wave.name === band;
      }), 'id');
    }
    Drive.listFolderByFolders(req, res, saveBands, rootFolderID);
    function saveBands(data) {
      const bands = data.files;
      Band.collection.remove();

      _.forEach(bands, band => {
        let waveFolderId = getWaveFolderId(band.name);
        console.log(waveFolderId);
        var bandItem = new Band({
          name: band.name,
          driveFolderId: band.id,
          waveFolderId: waveFolderId
        });
        bandItem.save(function(err) {
          if (err) {
            return res.send(err);
          }
        });
      });
      res.send(bands);
    }
  }
};

exports.get = function(req, res, next) {
  Band.collection.find({}).toArray(function(err, result) {
    if (err) throw err;
    res.send(result);
  });
};
