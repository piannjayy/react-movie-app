import React, { createContext, useState, useContext } from 'react';

const SoundContext = createContext();

export const SoundProvider = ({ children }) => {
  const [trailerMuted, setTrailerMuted] = useState(true); // Start muted
  const [trailerVolume, setTrailerVolume] = useState(50);
  const [backgroundSoundOn, setBackgroundSoundOn] = useState(false);

  const toggleTrailerSound = () => {
    setTrailerMuted(prev => {
      const newMuted = !prev;
      // When trailer is unmuted, turn off background sound to prevent collision
      if (!newMuted) {
        setBackgroundSoundOn(false);
      }
      return newMuted;
    });
  };

  const updateTrailerVolume = (volume) => {
    setTrailerVolume(volume);
  };

  const toggleBackgroundSound = () => {
    setBackgroundSoundOn(prev => {
      const newOn = !prev;
      // When background sound is turned on, mute trailer to prevent collision
      if (newOn) {
        setTrailerMuted(true);
      }
      return newOn;
    });
  };

  return (
    <SoundContext.Provider value={{
      trailerMuted,
      trailerVolume,
      backgroundSoundOn,
      toggleTrailerSound,
      updateTrailerVolume,
      toggleBackgroundSound
    }}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => useContext(SoundContext);
