import Image from 'next/image';

import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import { useContext, useEffect, useRef } from 'react';
import { PlayerContext } from '../context/PlayerContext';

import styles from './player.module.scss';

export default function Player() {
  const audioRef = useRef<HTMLAudioElement>(null);

  const {
    episodeList, currentEpisodeIndex, isPlaying, togglePlay, setPlayingState,
  } = useContext(PlayerContext);

  const episode = episodeList[currentEpisodeIndex];

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
          <span>00:00</span>
          <div className={styles.slider}>
            {
              episode
                ? (
                  <Slider
                    trackStyle={{ backgroundColor: '#04d361' }}
                    railStyle={{ backgroundColor: '#9f75ff' }}
                    handleStyle={{ border: '4px solid #04d361' }}
                  />
                )
                : <div className={styles.emptySlider} />
            }
          </div>
          <span>00:00</span>
        </div>

        {episode && (
          <audio
            ref={audioRef}
            src={episode.url}
            onPlay={() => setPlayingState(true)}
            onPause={() => setPlayingState(false)}
            autoPlay
          />
        )}

        <div className={styles.buttons}>
          <button type="button" disabled={!episode}>
            <img src="/shuffle.svg" alt="Embaralhar" />
          </button>
          <button type="button" disabled={!episode}>
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
          <button type="button" disabled={!episode}>
            <img src="/play-next.svg" alt="Tocar próximo" />
          </button>
          <button type="button" disabled={!episode}>
            <img src="/repeat.svg" alt="Repetir" />
          </button>
        </div>
      </footer>
    </div>
  );
}