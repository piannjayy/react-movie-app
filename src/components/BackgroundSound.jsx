import React, { useEffect, useRef, useState } from 'react';
import { useSound } from '../context/SoundContext';

const BackgroundSound = () => {
  const { backgroundSoundOn, toggleBackgroundSound } = useSound();
  const audioRef = useRef(null);
  const [userInteracted, setUserInteracted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      if (backgroundSoundOn && userInteracted) {
        audio.play().catch((error) => {
          console.log('Audio play failed:', error);
        });
      } else {
        audio.pause();
      }
    }
  }, [backgroundSoundOn, userInteracted]);

  useEffect(() => {
    const handleUserInteraction = () => {
      setUserInteracted(true);
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
    };

    window.addEventListener('click', handleUserInteraction);
    window.addEventListener('keydown', handleUserInteraction);

    return () => {
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
    };
  }, []);

  return (
    <audio
      ref={audioRef}
      loop
      preload="auto"
      style={{ display: 'none' }}
    >
      <source src="https://www.soundjay.com/misc/sounds/bell-ringing-05.wav" type="audio/wav" />
      {/* Replace with your preferred background music URL */}
    </audio>
  );
};

export default BackgroundSound;
