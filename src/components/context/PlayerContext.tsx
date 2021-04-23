import { createContext, ReactNode, useContext, useState } from 'react';

type Episode = {
  title: string;
  members: string;
  thumbnail: string;
  duration: number;
  url: string;
}

type PlayerContextData =  {
  episodeList: Array<Episode>;
  currentEpisodeIndex: number;
  isPlaying: boolean;
  isLooping: boolean;
  isShuffling: boolean;
  hasPrevious: boolean,
  hasNext: boolean,
  play: (episode: Episode) => void;
  playList: (list: Array<Episode>, index: number) => void;
  togglePlay: () => void;
  toggleLoop: () => void;
  toggleShuffle: () => void;
  setPlayingState: (state: boolean) => void;
  playNext: () => void;
  playPrevious: () => void;
};

export const PlayerContext = createContext({} as PlayerContextData);

type PlayerContextProviderProps = {
  children: ReactNode;
}

export function PlayerContextProvider({ children }: PlayerContextProviderProps) {
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  const hasPrevious = currentEpisodeIndex > 0;
  const hasNext = (currentEpisodeIndex + 1) < episodeList.length || isShuffling;

  function play(episode) {
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  }

  function playList(list: Array<Episode>, index: number) {
    setEpisodeList(list);
    setCurrentEpisodeIndex(index);
    setIsPlaying(true);
  }

  function togglePlay() {
    setIsPlaying(!isPlaying);
  }

  function toggleLoop() {
    setIsLooping(!isLooping);
  }

  function toggleShuffle() {
    setIsShuffling(!isShuffling);
  }

  function setPlayingState(state: boolean) {
    setIsPlaying(state);
  }
  
  function playNext() {
    if (isShuffling) {
      const randomIndex = Math.floor(Math.random() * episodeList.length);
      setCurrentEpisodeIndex(randomIndex)
    } else if (hasNext) setCurrentEpisodeIndex(currentEpisodeIndex + 1);
  }

  function playPrevious() {
    if (hasPrevious) setCurrentEpisodeIndex(currentEpisodeIndex -1);
  }

  return (
    <PlayerContext.Provider value={{
      episodeList,
      currentEpisodeIndex,
      isPlaying,
      isLooping,
      isShuffling,
      hasPrevious,
      hasNext,
      play,
      playList,
      togglePlay,
      toggleLoop,
      toggleShuffle,
      setPlayingState,
      playNext,
      playPrevious,
    }}>
     {children}
    </PlayerContext.Provider>
  );
}

export default function usePlayer() {
  return useContext(PlayerContext);
}
