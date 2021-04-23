import Image from 'next/image';

import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import { useEffect, useRef, useState } from 'react';
import convertDurationToTimeString from '../../utils/convertDurationToTimeString';
import usePlayer from '../context/PlayerContext';

import styles from './player.module.scss';

export default function Player() {
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const {
    episodeList,
    currentEpisodeIndex,
    isPlaying,
    isLooping,
    isShuffling,
    hasPrevious,
    hasNext,
    togglePlay,
    toggleLoop,
    toggleShuffle,
    setPlayingState,
    playPrevious,
    playNext,
  } = usePlayer();

  const episode = episodeList[currentEpisodeIndex];

  function setupProgressListener() {
    audioRef.current.currentTime = 0;
    audioRef.current.addEventListener('timeupdate', () => {
      setProgress(Math.floor(audioRef.current.currentTime));
    });
  }

  function handleSeek(amount: number) {
    audioRef.current.currentTime = amount;
    setProgress(amount);
  }

  useEffect(() => {
    if (!audioRef.current) return undefined;
    if (isPlaying) audioRef.current.play();
    else audioRef.current.pause();
  }, [isPlaying])

  return (
    <div className={styles.playerContainer}>
      <header>
        <img src="/playing.svg" alt="Tocando agora" />
        <strong>Tocando agora</strong>
      </header>
      
      {episode
        ? (
          <div className={styles.currentEpisode}>
            <Image
              src={episode.thumbnail}
              width={592}
              height={592}
              objectFit="cover"
            />
            <strong>{episode.title}</strong>
            <span>{episode.members}</span>
          </div>
        )
        : (
          <div className={styles.emptyPlayer}>
            <strong>Selecione um podcast para ouvir</strong>
          </div>
        )}

      <footer className={!episode ? styles.empty : undefined}>
        <div className={styles.progress}>
          <span>{convertDurationToTimeString(progress)}</span>
          <div className={styles.slider}>
            {
              episode
                ? (
                  <Slider
                    max={episode.duration}
                    value={progress}
                    onChange={handleSeek}
                    trackStyle={{ backgroundColor: '#04d361' }}
                    railStyle={{ backgroundColor: '#9f75ff' }}
                    handleStyle={{ border: '4px solid #04d361' }}
                  />
                )
                : <div className={styles.emptySlider} />
            }
          </div>
          <span>{convertDurationToTimeString(episode?.duration || 0)}</span>
        </div>

        {episode && (
          <audio
            ref={audioRef}
            src={episode.url}
            loop={isLooping}
            onPlay={() => setPlayingState(true)}
            onPause={() => setPlayingState(false)}
            onLoadedMetadata={setupProgressListener}
            onEnded={playNext}
            autoPlay
          />
        )}

        <div className={styles.buttons}>
          <button
            type="button"
            disabled={!episode}
            onClick={toggleShuffle}
            className={isShuffling ? styles.isActive : undefined }
          >
            <img src="/shuffle.svg" alt="Embaralhar" />
          </button>
          <button type="button" onClick={playPrevious} disabled={!episode || !hasPrevious}>
            <img src="/play-previous.svg" alt="Tocar anterior" />
          </button>
          <button
            type="button"
            className={styles.playButton}
            disabled={!episode}
            onClick={() => togglePlay()}
          >
            <img src={`/${isPlaying ? "pause" : "play"}.svg`} alt="Tocar/Pausar" />
          </button>
          <button type="button" onClick={playNext} disabled={!episode || !hasNext}>
            <img src="/play-next.svg" alt="Tocar próximo" />
          </button>
          <button
            type="button"
            disabled={!episode}
            onClick={toggleLoop}
            className={isLooping ? styles.isActive : undefined }
          >
            <img src="/repeat.svg" alt="Repetir" />
          </button>
        </div>
      </footer>
    </div>
  );
}