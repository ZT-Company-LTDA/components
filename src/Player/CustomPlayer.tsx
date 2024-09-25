"use client";
import React, { useRef, useState } from "react";
import ReactPlayer,{ReactPlayerProps} from "react-player";
import PlayerControls from "./PlayerControls";
import { INITIAL_STATE, reducer } from './States';
import {FaPlay} from 'react-icons/fa'
import screenfull from 'screenfull';

export const VideoPlayer = (props:ReactPlayerProps) => {
  const { url, light,labelOverlay } = props;
  const [state, dispatch] = React.useReducer(reducer, INITIAL_STATE);
  const playerRef = React.useRef<ReactPlayer>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [volume, setVolume] = React.useState(0.5);
  const [controlsVisible, setControlsVisible] = React.useState(true);

  const handleFullscreen = () => {
    if (screenfull.isEnabled && containerRef.current) {
      screenfull.toggle(containerRef.current);
    }
  };

  const handlePlayerClick = () => {
    setControlsVisible(true);

    setTimeout(() => {
      setControlsVisible(false);
    }, 3000);
  };

  const handlePreview = () => {
    dispatch({ type: 'PLAY' });
    dispatch({ type: 'CUSTOM_CONTROLS', payload: true });
    dispatch({ type: 'LIGHT', payload: false });
  };

  const handlePause = () => {
    dispatch({ type: 'PAUSE' });
  };

  const handlePlay = () => {
    dispatch({ type: 'PLAY' });
  };

  const handleEnded = () => {
    dispatch({ type: 'LIGHT', payload: true });
    playerRef.current?.showPreview();
  };

  const handleProgress = (progress: { playedSeconds: number }) => {
    dispatch({ type: 'SEEK', payload: progress.playedSeconds });
  };

  const handleDuration = (duration: number) => {
    dispatch({ type: 'DURATION', payload: duration });
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

  return (
    <div
      ref={containerRef}
      className="relative max-w-full mx-auto bg-black h-[50%]"
      style={{ aspectRatio: "16/9" }}
      onClick={handlePlayerClick}
    >
      <ReactPlayer
        ref={playerRef}
        url={url}
        width="100%"
        height="100%"
        playIcon={
          <div
            className="bg-white text-black rounded-xl flex justify-center items-center h-14 w-14"
          >
            <FaPlay
              fontSize="2rem"
            />
          </div>
        }
        controls={state.controls}
        loop={state.loop}
        muted={state.muted}
        playing={state.playing}
        playbackRate={state.playbackRate}
        volume={volume}
        onPlay={handlePlay}
        onEnded={handleEnded}
        onPause={handlePause}
        onDuration={handleDuration}
        onProgress={handleProgress}
        onClickPreview={handlePreview}
      />
      { controlsVisible && 
        <PlayerControls 
          state={state} 
          dispatch={dispatch} 
          playerRef={playerRef}
          handleFullscreen={handleFullscreen} 
          handleVolumeChange={handleVolumeChange} 
          volume={volume}
        />
      }
    </div>
  );
};
