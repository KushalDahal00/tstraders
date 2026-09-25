'use client';

import { useEffect, useRef } from 'react';

export function ClickSound() {
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const getAudioContext = () => {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      return audioCtxRef.current;
    };

    const playSound = () => {
      try {
        const audioCtx = getAudioContext();
        if (audioCtx.state === 'suspended') {
          audioCtx.resume();
        }

        // Create a short, mechanical "click" / "fahh" sound
        // We'll use a mix of a quick oscillator sweep and a tiny burst of noise if possible,
        // but a triangle sweep is very reliable for a UI click.
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'square'; // Square wave for a bit more "grit" suitable for brutalism

        // Quick frequency sweep down
        osc.frequency.setValueAtTime(400, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.05);

        // Amplitude envelope: fast attack, fast decay
        gain.gain.setValueAtTime(0, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.05, audioCtx.currentTime + 0.005); // low volume to not be annoying
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + 0.06);
      } catch (err) {
        console.error("Audio playback failed", err);
      }
    };

    const handleClick = () => {
      playSound();
    };

    // Use mousedown so the sound plays immediately upon press for better tactile feel
    window.addEventListener('mousedown', handleClick);

    return () => {
      window.removeEventListener('mousedown', handleClick);
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(console.error);
      }
    };
  }, []);

  return null;
}
