import {ScriptObject, useSpeech} from "../../context/speech.context.tsx";
import useSpeechRecognition from "../speech-recognition.utils.ts";
import {createContext, ReactNode, useContext, useState} from "react";

type ReadScriptContextType = {
  readScriptOut: (scriptObject: ScriptObject) => Promise<void>;
  targetWord: string | null;
  buttonId: string | null;
}

interface ScriptProviderProps {
  children: ReactNode;
}

const ReadScriptContext = createContext<ReadScriptContextType | undefined>(undefined);

export function ScriptProvider({ children }: ScriptProviderProps) {
  const [targetWord, setTargetWord] = useState<string | null>(null);
  const [buttonId, setButtonId] = useState<string | null>(null);
  
  async function readScriptOut(scriptObject: ScriptObject) {
    const { readText, removeHighlightOnDiv } = useSpeech();
    const { stopListening, startListening } = useSpeechRecognition();

    return new Promise<void>(async (resolve) => {
      readText(scriptObject.text, {
        onSpeechStart: () => {
          if (!scriptObject.targetPhrase) {
            stopListening();
          }
        },

        onSpeechEnd: () => {
          if (!scriptObject.targetPhrase) {
            if (scriptObject.focussedDiv) {
              removeHighlightOnDiv(scriptObject.focussedDiv);
            }

            cleanup();
            return resolve();
          }

          startListening();
          setTargetWord(scriptObject.targetPhrase.phrase);

          if (scriptObject.targetPhrase.buttonToClickId) {
            setButtonId(scriptObject.targetPhrase.buttonToClickId);
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
    <ReadScriptContext.Provider value={{readScriptOut, targetWord, buttonId}}>
      {children}
    </ReadScriptContext.Provider>
  )
}

export const useScript = () => {
  return useContext(ReadScriptContext);
};