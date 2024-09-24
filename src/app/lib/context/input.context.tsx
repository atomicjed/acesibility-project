import {createContext, useContext, useState} from "react";
import {useSpeechRecognitionContext} from "./speech-recognition.context.tsx";
import {ContextProps} from "../types/context-props.types.ts";
import {InputEditOptions} from "../enums/input-edit-options.enum.ts";
import {InputStage} from "../enums/InputStage.enum.ts";
import {ScriptObject} from "../types/script-object.types.ts";
import {handleFillInputAction} from "../utils/input-utlis/recognised-fill-input-speech.ts";
import {SuccessEnum} from "../enums/success.enum.ts";
import {handleRecognisedIsThisCorect} from "../utils/input-utlis/is-this-correct.utils.ts";
import {handleRecognisedInputEditOption} from "../utils/input-utlis/input-edit-options.utils.ts";
import {findWordToReplace} from "../utils/input-utlis/input.utils.ts";
import {useReplaceWord} from "./replace-word.context.tsx";
import {useSpeech} from "./accessibility.context.tsx";

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

export function InputProvider({ children }: ContextProps) {
  const [editOptions, setEditOptions] = useState<InputEditOptions[] | null>(null);
  const [inputStage, setInputStage] = useState<InputStage>(InputStage.FillInput);
  const { readText } = useSpeech();
  const { recognisedInputSpeech, interimRecognisedInputSpeech, stopListening, startListening, clearRecognisedSpeech } = useSpeechRecognitionContext();
  const { handleFindWordToReplace, handleReplaceWordWith, handleReplaceWord, updateWordToReplace } = useReplaceWord();
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
    const formattedInterimInputSpeech = interimRecognisedInputSpeech.trim().toLowerCase();
    
    if (!currentScriptObject.userAction) {
      return SuccessEnum.UnSuccessful;
    }
    
    if (inputStage === InputStage.FillInput && formattedInputSpeech.length > 0) {
      handleFillInputAction(currentScriptObject.userAction, formattedInputSpeech);
      await handleIsThisCorrect(formattedInputSpeech);
    }
    if (inputStage == InputStage.IsThisCorrect) {
      handleRecognisedIsThisCorect(formattedInterimInputSpeech);
    }
    if (inputStage == InputStage.InputEditOptions) {
      const option = handleRecognisedInputEditOption(formattedInterimInputSpeech);
      await handleOptionSelected(option);
    }
    
    if (inputStage == InputStage.FindWordToReplace && currentScriptObject.userAction.elementId) {
      const doesWordExistInInput = findWordToReplace(currentScriptObject.userAction.elementId, formattedInputSpeech);
      if (doesWordExistInInput) {
        updateWordToReplace(formattedInputSpeech);
        window.dispatchEvent(new Event('word-to-replace'));
        await handleReplaceWordWith(() => setInputStage(InputStage.ReplaceWordWith), formattedInputSpeech);
      }
    }
    
    if (inputStage == InputStage.ReplaceWordWith && currentScriptObject.userAction.elementId && formattedInputSpeech.length > 0) {
      const newInputValue = handleReplaceWord(currentScriptObject.userAction.elementId, formattedInputSpeech);
      
      if (newInputValue) {
        setInputStage(InputStage.IsThisCorrect);
        await handleIsThisCorrect(newInputValue);
      }
    }
  }
  
  async function handleOptionSelected(option?: InputEditOptions) {
    if (!option) {
      return;
    }
    
    window.dispatchEvent(new Event('optionSelected'));
    switch(option) {
      case InputEditOptions.ReplaceWord:
        await handleFindWordToReplace(() => setInputStage(InputStage.FindWordToReplace));
        break;
        
    }
  }
  
  async function handleIsThisCorrect(currentInput: string) {
    setInputStage(InputStage.IsThisCorrect);
    stopListening();
    return new Promise<void>(async (resolve) => {
      readText(`You inputted ${currentInput}, is this correct?`, {
        onSpeechStart: () => {
          clearRecognisedSpeech();
        },
        onSpeechEnd: () => startListening()
      });
      function onIsCorrect() {
        cleanup();
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
      readText(`Choose an action from the following options: ${InputEditOptions.ReplaceWord}... ${InputEditOptions.AddToAnswer}... ${InputEditOptions.StartAgain}... ${InputEditOptions.CapitaliseWord}... ${InputEditOptions.AddPunctuation}`, {
        onSpeechStart: () => {
          stopListening();
          setEditOptions(editOptionsArray);
          clearRecognisedSpeech();
        },
        onSpeechEnd: () => {
          startListening();
        },
      });
      
      function onOptionSelected() {
        cleanup();
        console.log('option selected');
        resolve();
      }
      function cleanup() {
        window.removeEventListener('optionSelected', onOptionSelected);
      }

      window.addEventListener('optionSelected', onOptionSelected);
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