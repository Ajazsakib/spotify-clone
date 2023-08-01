import React from 'react';

interface VolumeRangeSliderProps {
  toggleVolume: () => void;
  isVolumeOn: boolean;
  volumeRangeRef: React.RefObject<HTMLInputElement>;
  handleMouseDown: (event: React.MouseEvent<HTMLDivElement>) => void;
}

const VolumeRangeSlider = (props: VolumeRangeSliderProps) => {
  const { toggleVolume, isVolumeOn, volumeRangeRef, handleMouseDown } = props;

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
