import React, { useEffect, useRef, useState } from "react";
import ReactPlayer, { ReactPlayerProps } from "react-player";
import PlayerControls from "./PlayerControls";
import { INITIAL_STATE, reducer } from './States';
import { FaPlay } from 'react-icons/fa';

export const VideoPlayer = (props: ReactPlayerProps) => {
  const { url } = props;
  const [state, dispatch] = React.useReducer(reducer, INITIAL_STATE);
  const playerRef = React.useRef<ReactPlayer>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [controlsVisible, setControlsVisible] = React.useState(true);
  const timeoutRef = useRef<number | null>(null);

  // Função para mostrar os controles
  const showControls = () => {
    setControlsVisible(true);
    resetTimeout();
  };

  // Função para esconder os controles
  const hideControls = () => {
    setControlsVisible(false);
  };

  // Reseta o timeout para esconder os controles
  const resetTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      hideControls();
    }, 3000); // Esconde após 3 segundos de inatividade
  };

  useEffect(() => {
    // Mostra os controles ao passar o mouse e redefine o timeout
    const handleMouseMove = () => {
      showControls();
    };

    // Adiciona os listeners de movimento do mouse
    const playerContainer = containerRef.current;
    if (playerContainer) {
      playerContainer.addEventListener("mousemove", handleMouseMove);
    }

    // Limpa o timeout e listeners ao desmontar o componente
    return () => {
      if (playerContainer) {
        playerContainer.removeEventListener("mousemove", handleMouseMove);
      }
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative max-w-full mx-auto bg-black h-full"
      style={{ aspectRatio: "16/9" }}
    >
      <ReactPlayer
        ref={playerRef}
        url={url}
        width="100%"
        height="100%"
        playIcon={
          <div className="bg-white text-black rounded-xl flex justify-center items-center h-14 w-14">
            <FaPlay fontSize="2rem" />
          </div>
        }
        controls={false} // Desabilita os controles nativos
        loop={state.loop}
        muted={state.muted}
        playing={state.playing}
        playbackRate={state.playbackRate}
        volume={state.volume}
        onPlay={() => dispatch({ type: 'PLAY' })}
        onPause={() => dispatch({ type: 'PAUSE' })}
        onEnded={() => {
          dispatch({ type: 'LIGHT', payload: true });
          playerRef.current?.showPreview();
        }}
        onDuration={(duration) => dispatch({ type: 'DURATION', payload: duration })}
        onProgress={(progress) => dispatch({ type: 'SEEK', payload: progress.playedSeconds })}
        onClickPreview={() => dispatch({ type: 'PLAY' })}
      />

      {/* Exibe os controles quando visíveis */}
      {controlsVisible && (
        <PlayerControls
          state={state}
          dispatch={dispatch}
          playerRef={playerRef}
          containerRef={containerRef}
        />
      )}
    </div>
  );
};
