import { renderComponent , expect } from '../test_helper';
import Song from '../../src/components/music/waveform';


describe('Song' , () => {
  let component;

  beforeEach(() => {
    component = renderComponent(Song);
  });

  it('renders something', () => {
    expect(component).to.exist;
  });

})
