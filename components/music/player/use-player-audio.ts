"use client";

import { useEffect, useRef, useState } from "react";
import { usePlayerStore } from "@/store/player-store";
import type { RepeatMode } from "./playback-utils";

type LoadedAudio = {
  src?: string;
  duration: number;
};

type UsePlayerAudioArgs = {
  repeat: RepeatMode;
  shuffle: boolean;
};

export function usePlayerAudio({ repeat, shuffle }: UsePlayerAudioArgs) {
  const { track, isPlaying, progress, setProgress, volume, playNext } = usePlayerStore();
  const audioRef = useRef<HTMLAudioElement>(null);
  const restoredSrcRef = useRef<string | undefined>(undefined);
  const resumeProgressRef = useRef(progress);
  const [loadedAudio, setLoadedAudio] = useState<LoadedAudio>({
    duration: track.duration,
  });

  useEffect(() => {
    resumeProgressRef.current = usePlayerStore.getState().progress;
    restoredSrcRef.current = undefined;
  }, [track.src]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      void audio.play().catch(() => {
        usePlayerStore.setState({ isPlaying: false });
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, track.src]);

  const audioDuration = loadedAudio.src === track.src ? loadedAudio.duration : track.duration;
  const currentTime = progress * audioDuration;

  const handleSeek = (value: number) => {
    setProgress(value);

    const audio = audioRef.current;
    if (!audio || !Number.isFinite(audio.duration)) return;

    audio.currentTime = value * audio.duration;
  };

  const restoreAudioPosition = () => {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(audio.duration) || audio.duration === 0) return;

    if (restoredSrcRef.current === track.src) return;
    restoredSrcRef.current = track.src;

    const resumeProgress = resumeProgressRef.current;
    if (resumeProgress <= 0) return;

    const targetTime = Math.min(
      resumeProgress * audio.duration,
      Math.max(audio.duration - 0.25, 0),
    );

    if (targetTime > 0 && Math.abs(audio.currentTime - targetTime) > 0.5) {
      audio.currentTime = targetTime;
    }
  };

  const handleLoadedMetadata = () => {
    const audio = audioRef.current;
    if (audio && Number.isFinite(audio.duration) && audio.duration > 0) {
      setLoadedAudio({ src: track.src, duration: audio.duration });
    }

    restoreAudioPosition();

    if (isPlaying) {
      void audioRef.current?.play().catch(() => {
        usePlayerStore.setState({ isPlaying: false });
      });
    }
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(audio.duration) || audio.duration === 0) return;

    setProgress(audio.currentTime / audio.duration);
  };

  const handleEnded = () => {
    if (repeat === "one") {
      handleSeek(0);
      void audioRef.current?.play();
      return;
    }

    if (shuffle) {
      const { queue, playTrack } = usePlayerStore.getState();
      const next = queue[Math.floor(Math.random() * queue.length)];
      if (next) playTrack(next, queue);
      return;
    }

    const { currentIndex, queue } = usePlayerStore.getState();
    if (repeat === "all" || currentIndex < queue.length - 1) {
      playNext();
      return;
    }

    usePlayerStore.setState({ isPlaying: false, progress: 0 });
  };

  return {
    audioDuration,
    audioRef,
    currentTime,
    handleEnded,
    handleLoadedMetadata,
    handleSeek,
    handleTimeUpdate,
  };
}
