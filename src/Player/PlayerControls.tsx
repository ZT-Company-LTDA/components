import * as React from 'react';
import PauseRounded from '@mui/icons-material/PauseRounded';
import PlayArrowRounded from '@mui/icons-material/PlayArrowRounded';
import { IconButton, Slider, Stack, styled, Typography } from '@mui/material';
import ReactPlayer, { ReactPlayerProps } from 'react-player';
import { format } from 'date-fns';
import { FullscreenRounded, VolumeDownRounded, VolumeUpRounded, PictureInPicture } from '@mui/icons-material';
import { FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import screenfull from 'screenfull';
import { INITIAL_STATE} from './States';
import { TbPictureInPictureOn } from "react-icons/tb";
import { useMediaQuery } from '../hooks/useMediaQuery';
import { motion } from 'framer-motion';

interface ControlProps extends ReactPlayerProps {
  containerRef:React.MutableRefObject<HTMLDivElement | null>
  playerRef: React.RefObject<ReactPlayer>
  state: typeof INITIAL_STATE
  dispatch:React.Dispatch<ReactPlayerProps>
}

const PlayerControls = (props:ControlProps) => {
  const { state, dispatch, playerRef, containerRef } = props;
  const [showSlider, setShowSlider] = React.useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)')
  const [isSliding, setIsSliding] = React.useState(false);

  const handleMouseDown = () => {
    setIsSliding(true);
  };

  const handleMouseUp = () => {
    setIsSliding(false);
  };

  const handleSeek = (_event: Event, newValue: number | number[]) => {
    playerRef.current?.seekTo(newValue as number);
  };
  
  const handleFullscreen = () => {
    if (screenfull.isEnabled && containerRef.current) {
      screenfull.toggle(containerRef.current);
    }
  };
  
  const renderDurationText = () => {
    return (
      <Typography
        variant="body2"
        color="white"
        sx={{
          fontSize: '.8rem',
          position: 'absolute',
          top: '-20px',
          left: 0, 
          px: 1
        }}
      >
        {format(new Date(state.progress.playedSeconds * 1000), 'mm:ss')}
        {' / '}
        {format(new Date(state.duration * 1000), 'mm:ss')}
      </Typography>
    );
  };
  
  const renderSeekSlider = () => {
    return (
      <Slider
        aria-label="Time"
        min={0}
        max={state.duration}
        step={0.01}
        value={state.progress.playedSeconds}
        onChange={handleSeek}
        color='error'
      />
    );
  };

  const renderPlayButton = () => {
    return (
      <IconButton onClick={() => dispatch({ type: 'TOGGLE_PLAY' })}>
        {state.playing ? (
          <PauseRounded sx={{ fontSize: '2rem', color: 'white' }} />
        ) : (
          <PlayArrowRounded sx={{ fontSize: '2rem', color: 'white' }} />
        )}
      </IconButton>
    );
  };

  const renderSoundSlider = () => {  
    return (
      <div 
        className="flex items-center relative"
        onMouseEnter={() => setShowSlider(true)}
        onMouseLeave={() => {
          if (!isSliding) setShowSlider(false);
        }}
      >
        {
          !!state.volume ? (
            <FaVolumeUp
              className="text-white mr-2 cursor-pointer"
              onClick={() => dispatch({ type: 'VOLUME', payload: 0 })}
              size={'1.5rem'}
            />
          ) : (
            <FaVolumeMute
              className="text-white mr-2 cursor-pointer"
              size={'1.5rem'}
              onClick={() => dispatch({ type: 'VOLUME', payload: 1 })}
            />
          )
        }
        {(showSlider || isSliding) && !isMobile && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: 'hidden' }}
            className='flex text-center'
          >
            <Slider
              aria-label="Volume"
              min={0}
              max={1}
              step={0.01}
              value={state.volume}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onChange={(e, newValue) => dispatch({ type: 'VOLUME', payload: newValue })}
              color="error"
              sx={{ width: 100, marginRight: '1rem' }} // Ajuste o tamanho do slider conforme necessário
            />
          </motion.div>
        )}
      </div>
    );
  };

  const renderFullscreenButton = () => {
    return (
      <FullscreenRounded sx={{ fontSize: '2rem', color: 'white', cursor:'pointer' }} onClick={handleFullscreen}/>
    );
  };

  const renderConfig = () => {
    return (
      <IconButton onClick={handleFullscreen}>
        <FullscreenRounded sx={{ fontSize: '2rem', color: 'white' }} />
      </IconButton>
    );
  };

  const renderPiP = () => {
    return (
      <PictureInPicture sx={{ fontSize: '2rem', color: 'white' }} onClick={()=>playerRef.current?.getInternalPlayer().requestPictureInPicture()}/>
    );
  };

  return (
    <div className='z-50 flex flex-row items-center absolute w-full bottom-0 transition-opacity duration-300 ease-in-out max-h-full gap-2' style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
      {renderDurationText()}
      {renderPlayButton()} 
      {renderSoundSlider()} 
      {renderSeekSlider()}
      {renderFullscreenButton()}
    </div>
      // {renderPiP()}
  );
};

export default PlayerControls;
