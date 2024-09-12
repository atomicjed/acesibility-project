import {createContext, useContext, useState} from "react";
import {useSpeech} from "./speech.context.tsx";
import {useSpeechRecognitionContext} from "./speech-recognition.context.tsx";
import {ContextPropsTypes} from "../types/context-props.types.ts";
import {InputEditOptions} from "../enums/input-edit-options.enum.ts";
import {InputStage} from "../enums/InputStage.enum.ts";
import {ScriptObject} from "../types/script-object.types.ts";
import {handleFillInputAction} from "../utils/input-utlis/recognised-fill-input-speech.ts";
import {SuccessEnum} from "../enums/success.enum.ts";
import {handleRecognisedIsThisCorect} from "../utils/input-utlis/is-this-correct.utils.ts";

type InputContextType = {
  handleRecognisedInputSpeech: (currentScriptObject: ScriptObject) => Promise<SuccessEnum | void>;
  editOptions: InputEditOptions[] | null;
  inputStage: InputStage;
}

const InputContext = createContext<InputContextType>({
  handleRecognisedInputSpeech: (currentScriptObject: ScriptObject) => {
    return new Promise<SuccessEnum | void>((resolve) => {
      console.log(currentScriptObject);
      resolve();
    })
  },
  editOptions: null,
  inputStage: InputStage.FillInput,
});

export function InputProvider({ children }: ContextPropsTypes) {
  const [editOptions, setEditOptions] = useState<InputEditOptions[] | null>(null);
  const [inputStage, setInputStage] = useState<InputStage>(InputStage.FillInput);
  const { readText } = useSpeech();
  const { recognisedInputSpeech, stopListening, startListening, clearRecognisedSpeech } = useSpeechRecognitionContext();
  const editOptionsArray: InputEditOptions[] = [
    InputEditOptions.ReplaceWord,
    InputEditOptions.AddToAnswer,
    InputEditOptions.StartAgain,
    InputEditOptions.CapitaliseWord,
    InputEditOptions.DeleteSentence,
    InputEditOptions.AddPunctuation
  ];
  
  async function handleRecognisedInputSpeech(currentScriptObject: ScriptObject): Promise<SuccessEnum | void> {
    const formattedInputSpeech = recognisedInputSpeech.trim().toLowerCase();
    
    if (!currentScriptObject.userAction) {
      return SuccessEnum.UnSuccessful;
    }
    
    if (inputStage === InputStage.FillInput && formattedInputSpeech.length > 0) {
      handleFillInputAction(currentScriptObject.userAction, formattedInputSpeech);
      await handleUserInputEdit(formattedInputSpeech);
    }
    if (inputStage == InputStage.IsThisCorrect) {
      handleRecognisedIsThisCorect(formattedInputSpeech);
    }
  }
  
  
  async function handleUserInputEdit(currentInput: string) {
    setInputStage(InputStage.IsThisCorrect);
    stopListening();
    return new Promise<void>(async (resolve) => {
      readText(`You inputted ${currentInput}, is this correct?`, {
        onSpeechStart: () => {
          stopListening();
          clearRecognisedSpeech();
        },
        onSpeechEnd: () => startListening()
      });
      function onIsCorrect() {
        setEditOptions(null);
        resolve();
      }

      async function onIsNotCorrect() {
        cleanup(); 
        await handleInputEditOptions();
        resolve();
      }

      function cleanup() {
        window.removeEventListener('yes', onIsCorrect);
        window.removeEventListener('no', onIsNotCorrect);
      }

      window.addEventListener('yes', onIsCorrect);
      window.addEventListener('no', onIsNotCorrect);
    });
  }
  
  async function handleInputEditOptions() {
    setInputStage(InputStage.InputEditOptions);
    return new Promise<void>(async (resolve) => {
      readText(`Choose an action from the following options: ${InputEditOptions.ReplaceWord}... ${InputEditOptions.AddToAnswer}... ${InputEditOptions.AddPunctuation}... ${InputEditOptions.CapitaliseWord}... ${InputEditOptions.StartAgain}... ${InputEditOptions.DeleteSentence}`, {
        onSpeechStart: () => {
          stopListening();
          setEditOptions(editOptionsArray);
          clearRecognisedSpeech();
        },
        onSpeechEnd: () => {
          startListening();
        }
      });
    })
  }
    
  return (
    <InputContext.Provider value={{ handleRecognisedInputSpeech, editOptions, inputStage }}>
      {children}
    </InputContext.Provider>
  )
}

export function useInput() {
  return useContext(InputContext);
}