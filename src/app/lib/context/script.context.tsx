import {createContext, useContext, useState} from "react";
import {useSpeechRecognitionContext} from "./speech-recognition.context.tsx";
import {ScriptObject} from "../types/script-object.types.ts";
import {useAction} from "./action.context.tsx";
import {UserActionType} from "../enums/action-type.enum.ts";
import {RecognisedSpeechTypes} from "../enums/recognised-speech-types.enum.ts";
import {focusInput} from "../utils/input-utlis/input.utils.ts";
import {ContextProps} from "../types/context-props.types.ts";
import {useSpeech} from "./accessibility.context.tsx";

type ReadScriptContextType = {
  handleReadScript: (scriptArray: ScriptObject[] | null) => Promise<void>;
  handleRecognisedSpeech: (scriptObject: ScriptObject) => void;
  handleNextClick: () => void;
  handleCancelSpeech: () => void;
  targetWord?: string;
  targetWordDetected: string | null;
  speaking: boolean;
  currentScriptObject: ScriptObject | null;
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
  targetWord: undefined,
  targetWordDetected: null,
  speaking: false,
  currentScriptObject: null,
});

export function ScriptProvider({ children }: ContextProps) {
  const [targetWord, setTargetWord] = useState<string | undefined>(undefined);
  const [targetWordDetected, setTargetWordDetected] = useState<string | null>(null);
  const [speaking, setSpeaking] = useState<boolean>(false);
  const [currentScriptObject, setCurrentScriptObject] = useState<ScriptObject | null>(null);
  const { readText, highlightFocussedDiv, removeHighlightOnDiv } = useSpeech();
  const { stopListening, startListening, clearRecognisedSpeech, recognisedSpeech, updateListeningFor } = useSpeechRecognitionContext();
  const { handleSpeechPromptedAction } = useAction();
  
  async function handleRecognisedSpeech(scriptObject: ScriptObject) {
    const formatRecognisedSpeech = recognisedSpeech.trim().toLowerCase();
    const response = await handleSpeechPromptedAction(formatRecognisedSpeech, scriptObject.userAction, targetWord);
    if (response?.isSuccess) {
      onRecognisedSpeechSuccess(response.recognisedWord);
      handleNextClick();
    }

    if (formatRecognisedSpeech.includes('next')) {
      onRecognisedSpeechSuccess('next');
      handleNextClick();
    }

    if (formatRecognisedSpeech.includes('cancel')) {
      onRecognisedSpeechSuccess('cancel');
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

  function onRecognisedSpeechSuccess(targetWord?: string) {
    if (targetWord) {
      setTargetWordDetected(targetWord);
    }

    setTimeout(() => {
      setTargetWordDetected(null);
      clearRecognisedSpeech();
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

          if (scriptObject.userAction) {
            startListening();
            
            if (scriptObject.userAction.userActionType === UserActionType.Button) {
              setTargetWord(scriptObject.userAction.targetPhrase);
              updateListeningFor(RecognisedSpeechTypes.TargetWord);
            }
            
            if (scriptObject.userAction.userActionType === UserActionType.Input && scriptObject.userAction.elementId) {
              updateListeningFor(RecognisedSpeechTypes.UserInput);
              focusInput(scriptObject.userAction.elementId);
            }
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

export function useScript() {
  return useContext(ReadScriptContext);
}