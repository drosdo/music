import React, { Component } from 'react';
import DropzoneComponent from 'react-dropzone-component';

export default class Upload extends Component {
  static propTypes = {
    band: React.PropTypes.string
  };
  constructor(props) {
    super(props);
    // For a full list of possible configurations,
    // please consult http://www.dropzonejs.com/#configuration
    this.djsConfig = {
      addRemoveLinks: true,
      uploadMultiple: true,
      autoProcessQueue: true,
      parallelUploads: 20
    };

    this.componentConfig = {
      iconFiletypes: ['.jpg', '.png', '.gif'],
      showFiletypeIcon: true,

      postUrl: 'http://localhost:3090/upload'
    };

    // If you want to attach multiple callbacks, simply
    // create an array filled with all your callbacks.

    // Simple callbacks work too, of course
    this.addedfile = file => console.log(file);
    this.processingmultiple = files => console.log(files);
    this.sending = (file, xhr, formData) => {
      if (file.fullPath) {
        formData.append('fullPath', file.fullPath);
        formData.append('band', props.band);
      }
    };

    this.removedfile = file => console.log('removing...', file);

    this.dropzone = null;
  }

  render() {
    const config = this.componentConfig;
    const djsConfig = this.djsConfig;

    // For a list of all possible events (there are many), see README.md!
    const eventHandlers = {
      init: dz => (this.dropzone = dz),
      drop: this.callbackArray,
      processingmultiple: this.processingmultiple,
      addedfile: this.addedfile,
      success: this.success,
      sending: this.sending,
      removedfile: this.removedfile
    };

    return (
      <DropzoneComponent
        config={config}
        eventHandlers={eventHandlers}
        djsConfig={djsConfig}
      />
    );
  }
}
