import React from 'react';
import ReactDOM from 'react-dom';
const WaveformData = require('waveform-data');
const webAudioBuilder = require('waveform-data/webaudio');
import axios from 'axios';

export default class Waveform extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    axios.get('http://7758f764.ngrok.io/dropbox').then(data => {
      var contextObj = window.webkitAudioContext || window.AudioContext;
      var context = new contextObj();
      //var source = context.createBufferSource();
      var audioTag = document.getElementById('myAudioElement');

      var sourceTag = document.getElementById('audioSource');
      sourceTag.src = data.data;

      audioTag.load(); //call this to just preload the audio without playing
      audioTag.play();

      audioTag.crossOrigin = 'anonymous';
      var analyser = context.createAnalyser();
      var source = context.createMediaElementSource(audioTag);
      var javaScriptNode = context.createScriptProcessor(8192, 1, 1);
      var audioData = document.getElementById( 'audio-data' )

      var processAudio = function(e) {
        var channels = e.inputBuffer.numberOfChannels,
          buffer = e.inputBuffer;

        for(var i=0; i< channels; i++){
          console.log(buffer.getChannelData(i));
        }
      };

      javaScriptNode.onaudioprocess = processAudio;

      source.connect(javaScriptNode);
      javaScriptNode.connect(context.destination);

      audioTag.onloadeddata = function(response) {
        console.log(response);
        var audioData = response;
        // webAudioBuilder(context, audioData, (error, waveform) => {
        //   const canvas = document.querySelector('canvas');
        //   const interpolateHeight = total_height => {
        //     const amplitude = 256;
        //     return size => total_height - (size + 128) * total_height / amplitude;
        //   };
        //
        //   const y = interpolateHeight(canvas.height);
        //   const ctx = canvas.getContext('2d');
        //   ctx.beginPath();
        //   const resampled_waveform = waveform.resample({ width: 500 });
        //
        //   // from 0 to 100
        //   resampled_waveform.min.forEach((val, x) =>
        //     ctx.lineTo(x + 0.5, y(val) + 0.5)
        //   );
        //
        //   // then looping back from 100 to 0
        //   resampled_waveform.max.reverse().forEach((val, x) => {
        //     ctx.lineTo(resampled_waveform.offset_length - x + 0.5, y(val) + 0.5);
        //   });
        //
        //   ctx.closePath();
        //   ctx.stroke();
        // });
      };

      //request.send();
    });
    axios
      .get('/files/open_knife.dat', { responseType: 'arraybuffer' })
      .then(buffer => {
        const waveform = WaveformData.create(buffer.data);

        // const canvas = document.querySelector('canvas');
        // const interpolateHeight = total_height => {
        //   const amplitude = 256;
        //   return size => total_height - (size + 128) * total_height / amplitude;
        // };
        //
        // const y = interpolateHeight(canvas.height);
        // const ctx = canvas.getContext('2d');
        // ctx.beginPath();
        // const resampled_waveform = waveform.resample({ width: 500 });
        //
        // // from 0 to 100
        // resampled_waveform.min.forEach((val, x) =>
        //   ctx.lineTo(x + 0.5, y(val) + 0.5)
        // );
        //
        // // then looping back from 100 to 0
        // resampled_waveform.max.reverse().forEach((val, x) => {
        //   ctx.lineTo(resampled_waveform.offset_length - x + 0.5, y(val) + 0.5);
        // });
        //
        // ctx.closePath();
        // ctx.stroke();

        const oAudio = document.querySelector('audio');
        const cursor = document.querySelector('#cursor');
        oAudio.addEventListener('timeupdate', () => {
          var elapsedTime = Math.round(oAudio.currentTime);
          //update the progress bar
          if (cursor.getContext) {
            var ctx = cursor.getContext('2d');
            //clear canvas before painting
            ctx.clearRect(0, 0, cursor.clientWidth, cursor.clientHeight);
            ctx.fillStyle = 'rgba(0,0,0,.2)';
            var fWidth = elapsedTime / oAudio.duration * cursor.clientWidth;
            if (fWidth > 0) {
              ctx.fillRect(0, 0, fWidth, cursor.clientHeight);
            }
          }
        });

        cursor.addEventListener('click', e => {
          let pos = e.pageX - cursor.offsetLeft;
          let currentTime = pos * oAudio.duration / cursor.clientWidth;
          oAudio.currentTime = currentTime;
        });
      });
  }
  render() {
    return (
      <div>
        <canvas width="500" />
        <canvas id="cursor">|</canvas>
        <audio id="myAudioElement" controls>
          <source id="audioSource" src="" type="audio/mp3" />
        </audio>
        <div id="audio-data"/>
      </div>
    );
  }
}
