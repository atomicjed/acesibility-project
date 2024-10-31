import {createContext, useContext} from "react";
import {ContextProps} from "../types/context-props.types.ts";
import {useSpeech} from "./accessibility.context.tsx";
import {useSpeechRecognitionContext} from "./speech-recognition.context.tsx";
import {CustomEvents} from "../enums/custom-events.enum.ts";

type CapitaliseWordContextType = {
  handleFindWordToCapitalise: (updateInputStage: () => void) => Promise<void>;
  handleCapitaliseWord: (numberOfOccurrences: number, word: string, updateInputStage: () => void) => Promise<void>;
}

const CapitaliseWordContext = createContext<CapitaliseWordContextType>({
  handleFindWordToCapitalise: async () => {},
  handleCapitaliseWord: async () => {},
});

export function CapitaliseWordProvider({ children }: ContextProps) {
  const { readText } = useSpeech();
  const { stopListening, startListening } = useSpeechRecognitionContext();
  
  async function handleFindWordToCapitalise(updateInputStage: () => void) {
    updateInputStage();
    
    return new Promise<void>(async (resolve) => {
      readText('Which word would you like to capitalise?', {
        onSpeechStart: () => stopListening(),
        onSpeechEnd: () => startListening(),
      });

      function onRecognisedWordToCapitalise() {
        window.removeEventListener(CustomEvents.FoundWordToCapitalise, onRecognisedWordToCapitalise);
        resolve();
      }

      window.addEventListener(CustomEvents.FoundWordToCapitalise, onRecognisedWordToCapitalise);
    });
  }
  
  async function handleCapitaliseWord(numberOfOccurrences: number, word: string, updateInputStage: () => void) {
    updateInputStage();
    
    await new Promise<void>((resolve) => {
      readText(`There are ${numberOfOccurrences} of ${word} in your answer, which would you like to capitalise?`, {
        onSpeechStart: () => stopListening(),
        onSpeechEnd: () => startListening()
      });

      function onCapitalisedWord() {
        window.removeEventListener(CustomEvents.CapitalisedWord, onCapitalisedWord);
        readText(`I have capitalised ${word}.`, {
          onSpeechStart: () => stopListening(),
          onSpeechEnd: () => resolve()
        });
      }

      window.addEventListener(CustomEvents.CapitalisedWord, onCapitalisedWord);
    });
  }
  
  return (
    <CapitaliseWordContext.Provider value={{ handleFindWordToCapitalise, handleCapitaliseWord }}>
      {children}
    </CapitaliseWordContext.Provider>
  )
}

export function useCapitaliseWord() {
  return useContext(CapitaliseWordContext);
}