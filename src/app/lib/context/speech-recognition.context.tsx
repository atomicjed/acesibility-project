import { createContext, ReactNode, useContext } from "react";
import useSpeechRecognition from "../utils/speech-recognition.utils.ts";

const SpeechRecognitionContext = createContext<ReturnType<typeof useSpeechRecognition> | null>(null);

interface SpeechRecognitionProviderProps {
  children: ReactNode;
}

export const SpeechRecognitionProvider = ({ children }: SpeechRecognitionProviderProps) => {
  const speechRecognition = useSpeechRecognition();

  return (
    <SpeechRecognitionContext.Provider value={speechRecognition}>
      {children}
    </SpeechRecognitionContext.Provider>
  );
};

export const useSpeechRecognitionContext = () => {
  const context = useContext(SpeechRecognitionContext);
  if (!context) {
    throw new Error("useSpeechRecognitionContext must be used within a SpeechRecognitionProvider");
  }
  return context;
};