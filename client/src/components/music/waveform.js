import React from 'react';
import ReactDOM from 'react-dom';
const WaveformData = require('waveform-data');
const webAudioBuilder = require('waveform-data/webaudio');
import axios from 'axios';

export default class Waveform extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    const { tempSongLink, tempWaveLink } = this.props.song;
    this.hasWaveDat = false;

    if (tempWaveLink) {
      this.getWaveFormFromDat(tempWaveLink.link);
      this.hasWaveDat = true;
    }
    if (tempSongLink) {
      this.initAudioTag(tempSongLink.link);
    }
  }

  initAudioTag(url) {
    const { tempSongLink } = this.props.song;
    this.isAudioLoaded = false;
    // var contextObj = window.webkitAudioContext || window.AudioContext;
    // var context = new contextObj();

    //this.audioTagSource.src = url;

    //this.audioTag.load(); //call this to just preload the audio without playing
    //this.audioTag.play();
    // var source = context.createMediaElementSource(audioTag);
    // source.connect(context.destination);
    this.audioTag.crossOrigin = 'anonymous';

    this.audioTag.addEventListener('timeupdate', () => {
      var elapsedTime = Math.round(this.audioTag.currentTime);
      //update the progress bar
      if (this.cursorCanvas.getContext) {
        var ctx = this.cursorCanvas.getContext('2d');
        //clear canvas before painting
        ctx.clearRect(
          0,
          0,
          this.cursorCanvas.clientWidth,
          this.cursorCanvas.clientHeight
        );
        ctx.fillStyle = 'rgba(0,0,0,.2)';
        var fWidth =
          elapsedTime / this.audioTag.duration * this.cursorCanvas.clientWidth;
        if (fWidth > 0) {
          ctx.fillRect(0, 0, fWidth, this.cursorCanvas.clientHeight);
        }
      }
    });

    this.cursorCanvas.addEventListener('click', e => {
      if(this.isAudioLoaded) {
        let pos = e.pageX - this.cursorCanvas.offsetLeft;
        let currentTime =
          pos * this.audioTag.duration / this.cursorCanvas.clientWidth;
        this.audioTag.currentTime = currentTime;
      }else {
        this.isAudioLoaded = true;
        this.audioTagSource.src = url;
        this.audioTag.load();
        this.audioTag.play();
      }
    });
  }
  drawWave(waveform) {
    const interpolateHeight = total_height => {
      const amplitude = 256;
      return size => total_height - (size + 128) * total_height / amplitude;
    };

    const y = interpolateHeight(this.waveCanvas.height);
    const ctx = this.waveCanvas.getContext('2d');
    ctx.beginPath();
    const resampled_waveform = waveform.resample({ width: 500 });

    // from 0 to 100
    resampled_waveform.min.forEach((val, x) =>
      ctx.lineTo(x + 0.5, y(val) + 0.5)
    );

    // then looping back from 100 to 0
    resampled_waveform.max.reverse().forEach((val, x) => {
      ctx.lineTo(resampled_waveform.offset_length - x + 0.5, y(val) + 0.5);
    });

    ctx.closePath();
    ctx.stroke();
  }
  getWaveFormFromDat(url) {
    console.log(url);
    axios.get(url, { responseType: 'arraybuffer' }).then(buffer => {
      const waveform = WaveformData.create(buffer.data);
      this.drawWave(waveform);
    });
  }

  getWaveForm(url) {
    console.log(url);
    axios.get(url, { responseType: 'arraybuffer' }).then(data => {
      var contextObj = window.webkitAudioContext || window.AudioContext;
      var context = new contextObj();
      console.log(data);
      webAudioBuilder(context, data.data, (error, waveform) => {
        this.drawWave(waveform);
      });
    });
  }
  render() {
    return (
      <div>
        <canvas
          ref={waveCanvas => {
            this.waveCanvas = waveCanvas;
          }}
          width="500"
          height="50"
        />
        <canvas
          ref={cursorCanvas => {
            this.cursorCanvas = cursorCanvas;
          }}
          width="500"
          height="50"
          style={{ marginTop: '-70px' }}
        >
          |
        </canvas>
        <audio
          controls={true}
          ref={audioTag => {
            this.audioTag = audioTag;
          }}
        >
          <source
            ref={audioTagSource => {
              this.audioTagSource = audioTagSource;
            }}
          />
        </audio>
      </div>
    );
  }
}
