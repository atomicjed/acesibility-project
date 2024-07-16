import React, { createContext, useContext, useEffect, useState } from 'react';

type SpeechContextType = ((text: string) => void);

const defaultReadText: SpeechContextType = () => {
  console.warn('SpeechContext is not initialized');
};

const SpeechContext = createContext<SpeechContextType>(defaultReadText);

export const SpeechProvider = ({ children }) => {
  const [voice, setVoice] = useState(null);

  useEffect(() => {
    const initializeSpeechSynthesis = () => {
      if ('speechSynthesis' in window) {
        const synthesis = window.speechSynthesis;

        const setVoices = () => {
          const voices = synthesis.getVoices();
          setVoice(voices.find(v => v.name === 'Google UK English Female') || voices[0]);
        };

        synthesis.onvoiceschanged = setVoices;
        setVoices(); // Initial call
      } else {
        console.error('Text-to-speech not supported.');
      }
    };

    initializeSpeechSynthesis();
  }, []);

  const readText = (text: string) => {
    if (!voice) {
      console.error('Voice not initialized.');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voice;
    utterance.pitch = 1;
    utterance.rate = 1.1;
    utterance.volume = 0.8;

    window.speechSynthesis.speak(utterance);
  };

  return (
    <SpeechContext.Provider value={readText}>
      {children}
      </SpeechContext.Provider>
  );
};

export const useSpeech = () => {
  return useContext(SpeechContext);
};