import React from 'react';
const WaveformData = require('waveform-data');
import styles from './style/player.styl';

export default class Waveform extends React.Component {
  static propTypes = {
    playingSongId: React.PropTypes.string,
    setPlayingSong: React.PropTypes.func,
    song: React.PropTypes.object
  };

  state = {
    isPlaying: false,
    isAudioLoaded: null,
    isPuasable: false,
    audioDuration: 0
  };

  componentDidMount() {
    const { tempSongLink, wave } = this.props.song;
    this.hasWaveDat = false;

    if (wave) {
      // this.getWaveFormFromDat(tempWaveLink.link);
      const waveform = WaveformData.create(JSON.parse(wave));
      // let waveformdata = new WaveformData(this.props.song.wave, WaveformData.adapters.object);
      // this.getWaveFormFromLocal()
      this.drawWave(waveform);
      this.hasWaveDat = true;
    }
    if (tempSongLink) {
      this.initAudioTag(tempSongLink.link);
    }
  }
  componentDidUpdate() {
    const { _id } = this.props.song;
    const { playingSongId } = this.props;
    const { isPlaying } = this.state;
    if (isPlaying && playingSongId !== _id) {
      this.pause();
    }
  }

  initAudioTag() {
    // var contextObj = window.webkitAudioContext || window.AudioContext;
    // var context = new contextObj();

    // this.audioTagSource.src = url;

    // this.audioTag.load(); //call this to just preload the audio without playing
    // this.audioTag.play();
    // var source = context.createMediaElementSource(audioTag);
    // source.connect(context.destination);
    this.audioTag.crossOrigin = 'anonymous';

    this.audioTag.addEventListener('timeupdate', () => {
      let elapsedTime = Math.round(this.audioTag.currentTime);
      // update the progress bar
      if (this.cursorCanvas.getContext) {
        let ctx = this.cursorCanvas.getContext('2d');
        // clear canvas before painting
        ctx.clearRect(
          0,
          0,
          this.cursorCanvas.clientWidth,
          this.cursorCanvas.clientHeight
        );
        ctx.fillStyle = 'rgba(0,0,0,.2)';
        let fWidth =
          elapsedTime / this.audioTag.duration * this.cursorCanvas.clientWidth;
        if (fWidth > 0) {
          ctx.fillRect(0, 0, fWidth, this.cursorCanvas.clientHeight);
        }
      }
    });
    this.audioTag.addEventListener(
      'loadedmetadata',
      () => {
        console.log(this.audioTag.duration);
        this.setState({ audioDuration: this.audioTag.duration });
      },
      false
    );
  }

  onCursorCanvasCLick(e) {
    const { isAudioLoaded, audioDuration } = this.state;
    if (isAudioLoaded && audioDuration) {
      let pos = e.pageX - this.cursorCanvas.offsetLeft;
      let currentTime = pos * audioDuration / this.cursorCanvas.clientWidth;
      this.audioTag.currentTime = currentTime;
    } else {
      this.play();
    }
  }

  pause() {
    const { isPuasable } = this.state;

    if (isPuasable) {
      this.audioTag.pause();
      this.setState({ isPlaying: false });
    }
  }

  play() {
    const { tempSongLink, _id } = this.props.song;
    const { isAudioLoaded } = this.state;
    let playPromise;

    if (!isAudioLoaded) {
      this.setState({ isAudioLoaded: true });
      this.audioTagSource.src = tempSongLink.link;
      this.audioTag.load();
    }

    playPromise = this.audioTag.play();

    if (playPromise !== undefined) {
      playPromise.then(() => {
        this.setState({ isPuasable: true });
      });
      /* .catch(error => {
          // Auto-play was prevented
          // Show paused UI.
        });*/
    }

    this.setState({ isPlaying: true });
    this.props.setPlayingSong(_id);
  }

  onPlayClick() {
    const { isPlaying } = this.state;

    if (!isPlaying) {
      this.play();
    } else {
      this.pause();
    }
  }
  drawWave(waveform) {
    const interpolateHeight = totalHeight => {
      const amplitude = 256;
      return size => totalHeight - (size + 128) * totalHeight / amplitude;
    };

    const y = interpolateHeight(this.waveCanvas.height);
    const ctx = this.waveCanvas.getContext('2d');
    ctx.beginPath();
    const resampledWaveform = waveform.resample({ width: 500 });

    // from 0 to 100
    resampledWaveform.min.forEach((val, x) =>
      ctx.lineTo(x + 0.5, y(val) + 0.5)
    );

    // then looping back from 100 to 0
    resampledWaveform.max.reverse().forEach((val, x) => {
      ctx.lineTo(resampledWaveform.offset_length - x + 0.5, y(val) + 0.5);
    });

    ctx.closePath();
    ctx.stroke();
  }

  render() {
    const { name } = this.props.song;

    return (
      <div className={styles.player}>
        <h3>{name}</h3>
        <canvas
          ref={waveCanvas => {
            this.waveCanvas = waveCanvas;
          }}
          width='500'
          height='50'
        />
        <canvas
          ref={cursorCanvas => {
            this.cursorCanvas = cursorCanvas;
          }}
          width='500'
          height='50'
          onClick={this.onCursorCanvasCLick.bind(this)}
          style={{ marginTop: '-70px' }}
        >
          |
        </canvas>
        <audio
          controls
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
        <div
          onClick={this.onPlayClick.bind(this)}
          className={styles.playButton}
        >
          Play/Pause
        </div>
      </div>
    );
  }
}
