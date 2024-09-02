import {createContext, ReactNode, useContext, useState} from "react";
import {useSpeech} from "./speech.context.tsx";
import {useSpeechRecognitionContext} from "./speech-recognition.context.tsx";
import {ScriptObject} from "../types/script-object.types.ts";
import {handleSpeechPromptedAction} from "../utils/action.utils.ts";

type ReadScriptContextType = {
  handleReadScript: (scriptArray: ScriptObject[] | null) => Promise<void>;
  handleRecognisedSpeech: (scriptObject: ScriptObject) => void;
  handleNextClick: () => void;
  handleCancelSpeech: () => void;
  targetWord: string | null;
  targetWordDetected: string | null;
  speaking: boolean;
  currentScriptObject: ScriptObject | null;
}

interface ScriptProviderProps {
  children: ReactNode;
}

const ReadScriptContext = createContext<ReadScriptContextType>({
  handleReadScript: async (scriptArray: ScriptObject[] | null) => {
    console.log("Default handleReadScript called", scriptArray);
    return Promise.resolve();
  },
  handleRecognisedSpeech: (scriptObject: ScriptObject) => {
    console.log('Uninitialised handleRecognisedSpeech function', scriptObject);
  },
  handleNextClick: () => {},
  handleCancelSpeech: () => {},
  targetWord: null,
  targetWordDetected: null,
  speaking: false,
  currentScriptObject: null,
});

export function ScriptProvider({ children }: ScriptProviderProps) {
  const [targetWord, setTargetWord] = useState<string | null>(null);
  const [targetWordDetected, setTargetWordDetected] = useState<string | null>(null);
  const [speaking, setSpeaking] = useState<boolean>(false);
  const [currentScriptObject, setCurrentScriptObject] = useState<ScriptObject | null>(null);
  const { readText, highlightFocussedDiv, removeHighlightOnDiv } = useSpeech();
  const { stopListening, startListening, recognisedSpeech } = useSpeechRecognitionContext();
  
  function handleRecognisedSpeech(scriptObject: ScriptObject) {
    const formatRecognisedSpeech = recognisedSpeech.trim().toLowerCase();
    const response = handleSpeechPromptedAction(targetWord, formatRecognisedSpeech, scriptObject.userAction);
    if (response?.isSuccess) {
      setTargetWordDetected(response.targetWord);
      handleNextClick();
    }
    
    // if (targetWord && formatRecognisedSpeech.includes(targetWord)) {
    //   setTargetWordDetected(targetWord);
    //   handleNextClick();
    //
    //   if (buttonId) {
    //     const button = document.getElementById(buttonId);
    //     if (button) {
    //       button.click();
    //     }
    //   }
    // }

    if (formatRecognisedSpeech.includes('next')) {
      onTargetWordDetected('next');
      handleNextClick();
    }

    if (formatRecognisedSpeech.includes('cancel')) {
      onTargetWordDetected('cancel');
      handleCancelSpeech();
    }
  }
  
  function handleNextClick() {
    const event = new Event('nextClicked');
    window.dispatchEvent(event);
  }

  function handleCancelSpeech() {
    window.speechSynthesis.cancel();
    stopListening();
    setSpeaking(false);

    const event = new Event('cancelClicked');
    window.dispatchEvent(event);
  }

  function onTargetWordDetected(word: string) {
    setTargetWordDetected(word);

    setTimeout(() => {
      setTargetWordDetected(null);
    }, 1000);
  }

  async function handleReadScript(scriptArray: ScriptObject[] | null) {
    if (!scriptArray) {
      console.log('Please set up a script, find out how to do this using our docs here: https://docs.com');
      return;
    }

    setSpeaking(true);
    for (const scriptObject of scriptArray) {
      setCurrentScriptObject(scriptObject);
      
      if (scriptObject.focussedDiv) {
        highlightFocussedDiv(scriptObject.focussedDiv);
      }
      await readScriptOut(scriptObject);
    }
    setSpeaking(false);
  }
  
  async function readScriptOut(scriptObject: ScriptObject) {
    return new Promise<void>(async (resolve) => {
      readText(scriptObject.text, {
        onSpeechStart: () => {
          if (!scriptObject.userAction) {
            stopListening();
          }
        },

        onSpeechEnd: () => {
          if (!scriptObject.userAction) {
            if (scriptObject.focussedDiv) {
              removeHighlightOnDiv(scriptObject.focussedDiv);
            }

            cleanup();
            return resolve();
          }
          
          if (scriptObject.userAction.targetPhrase) {
            startListening();
            setTargetWord(scriptObject.userAction.targetPhrase);
          }
        }
      });

      function onNextClick() {
        window.speechSynthesis.cancel();
        cleanup();
        if (scriptObject.focussedDiv) {
          removeHighlightOnDiv(scriptObject.focussedDiv)
        }
        resolve();
      }

      function onCancelClick() {
        cleanup();
        if (scriptObject.focussedDiv) {
          removeHighlightOnDiv(scriptObject.focussedDiv);
        }
      }

      function cleanup() {
        window.removeEventListener('nextClicked', onNextClick);
        window.removeEventListener('cancelClicked', onCancelClick);
      }

      window.addEventListener('nextClicked', onNextClick);
      window.addEventListener('cancelClicked', onCancelClick);
    });
  }
  
  return (
    <ReadScriptContext.Provider value={{handleReadScript, handleRecognisedSpeech, handleNextClick, handleCancelSpeech, targetWord, targetWordDetected, speaking, currentScriptObject}}>
      {children}
    </ReadScriptContext.Provider>
  )
}

export const useScript = () => {
  return useContext(ReadScriptContext);
};