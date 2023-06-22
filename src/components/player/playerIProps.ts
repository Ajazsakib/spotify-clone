export interface IProps {
    backwardLastSong: () => void;
    togglePlayPause: ()=> void;
    forwardNextSong: ()=> void;
    currentSong: {
        artist: string,
        category_id: string,
        created_by: string,
        id: string,
        src: string,
        title: string
    }
    audioRef: React.RefObject<HTMLAudioElement>;
    setDuration: React.Dispatch<React.SetStateAction<number>>
    setCurrrentProgress: React.Dispatch<React.SetStateAction<number>>
    progressBarWidth: ()=> void;
    elapsedDisplay: number
    handleMouseDown: ()=> void
    rangeRef: React.RefObject<HTMLDivElement>;
    durationDisplay: number
}