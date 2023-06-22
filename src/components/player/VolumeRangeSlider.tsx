import React from 'react';

const VolumeRangeSlider = (props) => {
  const { toggleVolume, isVolumeOn, volumeRangeRef, handleMouseDown } = props;

  console.log('volume Render');

  return (
    <div className="right">
      <div className="icons">
        <span className="material-symbols-outlined">segment</span>
        <span className="material-symbols-outlined">
          keyboard_previous_language
        </span>
      </div>
      <div className="sound-bar">
        <div className="icon" onClick={toggleVolume}>
          <span className="material-symbols-outlined">
            {isVolumeOn ? 'volume_up' : 'volume_off'}
          </span>
        </div>
        <div
          className="sound-progress-bar volumeParent"
          onMouseDown={handleMouseDown}
        >
          <div className="range-bar volumeChild" ref={volumeRangeRef}></div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(VolumeRangeSlider);
