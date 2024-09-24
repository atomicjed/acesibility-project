import {createContext, useContext, useState} from "react";
import {ContextProps} from "../types/context-props.types.ts";
import {useSpeech} from "./accessibility.context.tsx";
import {useSpeechRecognitionContext} from "./speech-recognition.context.tsx";
import {replaceWordWith} from "../utils/input-utlis/input.utils.ts";

type ReplaceWordContextType = {
  handleFindWordToReplace: (updateInputStage: () => void) => Promise<void>;
  handleReplaceWordWith: (updateInputStage: () => void, wordToReplace: string) => Promise<void>;
  handleReplaceWord: (elementId: string, newWord: string) => string | undefined;
  updateWordToReplace: (word: string) => void;
}

const ReplaceWordContext = createContext<ReplaceWordContextType>({
  handleFindWordToReplace: () => {
    return new Promise<void>(resolve => resolve())
  },
  handleReplaceWordWith: () => {
    return new Promise<void>(resolve => resolve())
  },
  handleReplaceWord: () => undefined,
  updateWordToReplace: () => {},
});

export function ReplaceWordProvider({children}: ContextProps) {
  const { readText } = useSpeech();
  const { stopListening, clearRecognisedSpeech, startListening } = useSpeechRecognitionContext();
  const [wordToReplace, setWordToReplace] = useState<string | null>(null);

  async function handleFindWordToReplace(updateInputStage: () => void) {
    updateInputStage();
    
    return new Promise<void>(async (resolve) => {
      readText(`Which word would you like to replace?`, {
        onSpeechStart: () => {
          console.log('find word stop listening');
          stopListening();
          clearRecognisedSpeech();
        },
        onSpeechEnd: () => {startListening();}
      });
      function onWordToReplace() {
        console.log('found word');
        cleanup();
        resolve();
      }

      function cleanup() {
        window.removeEventListener('word-to-replace', onWordToReplace);
      }

      window.addEventListener('word-to-replace', onWordToReplace);
    });
  }

  async function handleReplaceWordWith(updateInputStage: () => void, wordToReplace: string) {
    updateInputStage();
    stopListening();
    clearRecognisedSpeech();
    
    return new Promise<void>(async (resolve) => {
      readText(`Say a word or a phrase to replace ${wordToReplace} with`, {
        onSpeechStart: () => {
        },
        onSpeechEnd: () => {
          startListening();
        }
      });
      function onReplaceWordWith() {
        cleanup();
        resolve();
      }

      function cleanup() {
        window.removeEventListener('replace-word-with', onReplaceWordWith);
      }

      window.addEventListener('replace-word-with', onReplaceWordWith);
    });
  }
  
  function handleReplaceWord(elementId: string, newWord: string) {
    if (!wordToReplace) {
      console.error('No word to replace');
      return;
    }
    return replaceWordWith(elementId, wordToReplace, newWord);
  }
  
  function updateWordToReplace(word: string) {
    setWordToReplace(word);
  }
  
  return (
    <ReplaceWordContext.Provider value={{ handleFindWordToReplace, handleReplaceWordWith, handleReplaceWord, updateWordToReplace }}>
      {children}
    </ReplaceWordContext.Provider>
  )
}

export function useReplaceWord() {
  return useContext(ReplaceWordContext);
}