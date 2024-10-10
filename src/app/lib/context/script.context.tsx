import {createContext, useContext, useRef, useState} from "react";
import {useSpeechRecognitionContext} from "./speech-recognition.context.tsx";
import {ScriptObject} from "../types/script-object.types.ts";
import {useAction} from "./action.context.tsx";
import {UserActionType} from "../enums/action-type.enum.ts";
import {RecognisedSpeechTypes} from "../enums/recognised-speech-types.enum.ts";
import {focusInput} from "../utils/input-utlis/input.utils.ts";
import {ContextProps} from "../types/context-props.types.ts";
import {useSpeech} from "./accessibility.context.tsx";
import {useInput} from "./input.context.tsx";
import {InputStage} from "../enums/InputStage.enum.ts";
import {CustomEvents} from "../enums/custom-events.enum.ts";

type ReadScriptContextType = {
  handleReadScript: (textId?: number) => Promise<void>;
  goToPreviousScriptObject: () => Promise<void>;
  startScriptObjectAgain: () => Promise<void>;
  handleRecognisedSpeech: (scriptObject: ScriptObject) => void;
  dispatchCancelEvent: () => void;
  dispatchNextEvent: () => void;
  targetWord?: string;
  targetWordDetected: string | null;
  speaking: boolean;
  currentScriptObject: ScriptObject | null;
}

const ReadScriptContext = createContext<ReadScriptContextType>({
  handleReadScript: async () => {},
  goToPreviousScriptObject: async () => {},
  startScriptObjectAgain: async () => {},
  handleRecognisedSpeech: () => {},
  dispatchCancelEvent: () => {},
  dispatchNextEvent: () => {},
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
  const cancelReadScript = useRef(false);
    
  const { readText, highlightFocussedDiv, removeHighlightOnDiv } = useSpeech();
  const { stopListening, startListening, recognisedSpeech, updateListeningFor } = useSpeechRecognitionContext();
  const { handleSpeechPromptedAction } = useAction();
  const { updateInputStage } = useInput();
  const { script } = useSpeech();
  
  async function handleRecognisedSpeech(scriptObject: ScriptObject) {
    const formatRecognisedSpeech = recognisedSpeech.trim().toLowerCase();
    const response = await handleSpeechPromptedAction(formatRecognisedSpeech, scriptObject.userAction, targetWord);
  
    if (response?.isSuccess) {
      onRecognisedSpeechSuccess(response.recognisedWord);
      window.dispatchEvent(new Event(CustomEvents.NextClicked));
    }

    if (formatRecognisedSpeech.includes('next')) {
      onRecognisedSpeechSuccess('next');
      dispatchNextEvent();
    }

    if (formatRecognisedSpeech.includes('cancel')) {
      onRecognisedSpeechSuccess('cancel');
      dispatchCancelEvent();
    }

    if (formatRecognisedSpeech.includes('previous')) {
      onRecognisedSpeechSuccess('previous');
      await goToPreviousScriptObject();
    }
  }
  
  function dispatchCancelEvent() {
    window.dispatchEvent(new Event(CustomEvents.CancelClicked));
  }
  
  function dispatchNextEvent() {
    window.dispatchEvent(new Event(CustomEvents.NextClicked));
  }

  function onRecognisedSpeechSuccess(targetWord?: string) {
    if (targetWord) {
      setTargetWordDetected(targetWord);
    }

    setTimeout(() => {
      setTargetWordDetected(null);
    }, 1000);
  }

  async function handleReadScript(idToJumpTo?: number) {
    if (!script) {
      console.log('Please set up a script, find out how to do this using our docs here: https://docs.com');
      return;
    }
    
    setSpeaking(true);
    for (const scriptObject of script) {
      if (cancelReadScript.current) {
        cancelReadScript.current = false;
        break;
      }
      
      if (idToJumpTo && scriptObject.textId && (scriptObject.textId < idToJumpTo)) {
        continue;
      }
      
      setCurrentScriptObject(scriptObject);
      
      if (scriptObject.focussedDiv) {
        highlightFocussedDiv(scriptObject.focussedDiv);
      }
      await readScriptOut(scriptObject);
      
      if (cancelReadScript.current) {
        cancelReadScript.current = false;
        break;
      }
    }
    setSpeaking(false);
    setCurrentScriptObject(null);
    window.dispatchEvent(new Event(CustomEvents.ReadScriptFinished));
  }
  
  async function readScriptOut(scriptObject: ScriptObject) {
    return new Promise<void>(async (resolve) => {
      readText(scriptObject.text, {
        onSpeechStart: () => {
          stopListening();
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
              updateInputStage(InputStage.FillInput);
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
        window.speechSynthesis.cancel();
        stopListening();
        setSpeaking(false);
        setCurrentScriptObject(null);
        
        cleanup();
        if (scriptObject.focussedDiv) {
          removeHighlightOnDiv(scriptObject.focussedDiv);
        }
        
        resolve();
      }

      function cleanup() {
        window.removeEventListener(CustomEvents.CancelClicked, onNextClick);
        window.removeEventListener(CustomEvents.NextClicked, onCancelClick);
      }

      window.addEventListener(CustomEvents.NextClicked, onNextClick);
      window.addEventListener(CustomEvents.CancelClicked, onCancelClick);
    });
  }

  async function goToPreviousScriptObject() {
    const scriptObjectToJumpTo = currentScriptObject?.textId ? currentScriptObject.textId - 1 : undefined;
    if (scriptObjectToJumpTo === undefined) {
      console.warn("Current script object does not have a valid textId.");
    }
    
    await jumpToScriptObject(scriptObjectToJumpTo);
  }

  async function startScriptObjectAgain() {
    await jumpToScriptObject(currentScriptObject?.textId);
  }
  
  async function jumpToScriptObject(textIdToJumpTo?: number) {
    cancelReadScript.current = true;
    dispatchCancelEvent();
    
    await new Promise<void>((resolve) => {
      function onReadScriptFinished() {
        window.removeEventListener(CustomEvents.NextClicked, onReadScriptFinished);
        resolve();
      }

    window.addEventListener(CustomEvents.ReadScriptFinished, onReadScriptFinished);
    });
    
    await handleReadScript(textIdToJumpTo);
  }
  
  return (
    <ReadScriptContext.Provider value={{handleReadScript, goToPreviousScriptObject, startScriptObjectAgain, handleRecognisedSpeech, dispatchCancelEvent, dispatchNextEvent, targetWord, targetWordDetected, speaking, currentScriptObject}}>
      {children}
    </ReadScriptContext.Provider>
  )
}

export function useScript() {
  return useContext(ReadScriptContext);
}