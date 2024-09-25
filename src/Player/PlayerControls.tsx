import * as React from 'react';
import PauseRounded from '@mui/icons-material/PauseRounded';
import PlayArrowRounded from '@mui/icons-material/PlayArrowRounded';
import { IconButton, Slider, Stack, styled, Typography } from '@mui/material';
import { ReactPlayerProps } from 'react-player';
import { format } from 'date-fns';
import { FullscreenRounded, VolumeDownRounded, VolumeUpRounded } from '@mui/icons-material';
import { FaVolumeUp } from 'react-icons/fa';

const PlayerControls: React.FC<ReactPlayerProps> = (props) => {
  const { state, dispatch, playerRef, handleFullscreen,handleVolumeChange,volume } = props;

  const handleSeek = (_event: Event, newValue: number | number[]) => {
    playerRef.current.seekTo(newValue as number);
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
      <div className="volume-control flex items-center">
        <FaVolumeUp className="text-white mr-2"/>
        <input
          type="range"
          min={0}
          max={1}
          step="any"
          value={volume}
          onChange={handleVolumeChange}
          className="w-20 rounded-lg"
        />
      </div>
    );
  };

  const renderDurationText = () => {
    return (
      <Stack spacing={2} direction="row" sx={{ mb: 1, px: 1 }} alignItems="center">
        <Typography variant="body2" color="white">
          {format(new Date(state.progress.playedSeconds * 1000), 'mm:ss')}
          {' / '}
          {format(new Date(state.duration * 1000), 'mm:ss')}
        </Typography>
      </Stack>
    );
  };

  const renderFullscreenButton = () => {
    return (
      <IconButton onClick={handleFullscreen}>
        <FullscreenRounded sx={{ fontSize: '2rem', color: 'white' }} />
      </IconButton>
    );
  };

  return (
    <div className='z-50 absolute w-full bottom-0 transition-opacity duration-300 ease-in-out'>
      <Stack direction="row" alignItems="center">
        {renderSeekSlider()}
      </Stack>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" alignItems="center" spacing={2}>
          {renderPlayButton()} {renderSoundSlider()} {renderDurationText()}
        </Stack>
        <Stack direction="row" alignItems="center" spacing={2}>
          {renderFullscreenButton()}
        </Stack>
      </Stack>
    </div>
  );
};

export default PlayerControls;
