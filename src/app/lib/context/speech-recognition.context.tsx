import { createContext, useContext } from "react";
import useSpeechRecognition from "../utils/speech-recognition.utils.ts";
import {ContextProps} from "../types/context-props.types.ts";

const SpeechRecognitionContext = createContext<ReturnType<typeof useSpeechRecognition> | null>(null);

export const SpeechRecognitionProvider = ({ children }: ContextProps) => {
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