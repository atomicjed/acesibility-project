import {createContext, useContext, useState} from "react";
import {useSpeechRecognitionContext} from "./speech-recognition.context.tsx";
import {ContextProps} from "../types/context-props.types.ts";
import {InputEditOptions} from "../enums/input-edit-options.enum.ts";
import {InputStage} from "../enums/InputStage.enum.ts";
import {ScriptObject} from "../types/script-object.types.ts";
import {handleFillInputAction} from "../utils/input-utlis/recognised-fill-input-speech.ts";
import {SuccessEnum} from "../enums/success.enum.ts";
import {handleRecognisedIsThisCorrect} from "../utils/input-utlis/is-this-correct.utils.ts";
import {handleRecognisedInputEditOption} from "../utils/input-utlis/input-edit-options.utils.ts";
import {
  addToCurrentInputValue,
  capitaliseInputWord,
  findNumberOfOccurrencesOfWordInInput
} from "../utils/input-utlis/input.utils.ts";
import {useReplaceWord} from "./replace-word.context.tsx";
import {useSpeech} from "./accessibility.context.tsx";
import {useStartAgain} from "./start-again.context.tsx";
import {CustomEvents} from "../enums/custom-events.enum.ts";
import {useAddToInput} from "./add-to-input.context.tsx";
import {useCapitaliseWord} from "./capitalise-word.context.tsx";

type InputContextType = {
  handleRecognisedInputSpeech: (currentScriptObject: ScriptObject, startScriptObjectAgain: () => Promise<void>) => Promise<SuccessEnum | void>;
  editOptions: InputEditOptions[] | null;
  inputStage: InputStage;
  updateInputStage: (newInputStage: InputStage) => void;
}

const InputContext = createContext<InputContextType>({
  handleRecognisedInputSpeech: async () => {},
  editOptions: null,
  inputStage: InputStage.FillInput,
  updateInputStage: () => {},
});

export function InputProvider({ children }: ContextProps) {
  const [editOptions, setEditOptions] = useState<InputEditOptions[] | null>(null);
  const [inputStage, setInputStage] = useState<InputStage>(InputStage.FillInput);
  const { readText } = useSpeech();
  const { recognisedInputSpeech, interimRecognisedInputSpeech, stopListening, startListening } = useSpeechRecognitionContext();
  const { handleFindWordToReplace, handleReplaceWordWith, handleReplaceWord, updateWordToReplace } = useReplaceWord();
  const { handleStartAgain } = useStartAgain();
  const { handleAddToInput } = useAddToInput();
  const { handleFindWordToCapitalise, handleCapitaliseWord } = useCapitaliseWord();
  
  const editOptionsArray: InputEditOptions[] = [
    InputEditOptions.ReplaceWord,
    InputEditOptions.AddToAnswer,
    InputEditOptions.StartAgain,
    InputEditOptions.CapitaliseWord,
    InputEditOptions.DeleteSentence,
    InputEditOptions.AddPunctuation
  ];
  
  async function handleRecognisedInputSpeech(currentScriptObject: ScriptObject, startScriptObjectAgain: () => Promise<void>): Promise<SuccessEnum | void> {
    const formattedInputSpeech = recognisedInputSpeech.trim().toLowerCase();
    const formattedInterimInputSpeech = interimRecognisedInputSpeech.trim().toLowerCase();
    
    if (!currentScriptObject.userAction) {
      return SuccessEnum.UnSuccessful;
    }
    
    if (inputStage === InputStage.FillInput && formattedInputSpeech.length > 0) {
      handleFillInputAction(currentScriptObject.userAction, formattedInputSpeech);
      await handleIsThisCorrect(formattedInputSpeech);
    }
    if (inputStage === InputStage.IsThisCorrect) {
      handleRecognisedIsThisCorrect(formattedInterimInputSpeech);
    }
    if (inputStage === InputStage.InputEditOptions) {
      const option = handleRecognisedInputEditOption(formattedInterimInputSpeech);
      await handleOptionSelected(startScriptObjectAgain, option, currentScriptObject.userAction.elementId);
    }
    
    if (inputStage === InputStage.FindWordToReplace && currentScriptObject.userAction.elementId) {
      const wordIsInInput = findNumberOfOccurrencesOfWordInInput(currentScriptObject.userAction.elementId, formattedInputSpeech);
      if (wordIsInInput > 0) {
        updateWordToReplace(formattedInputSpeech);
        window.dispatchEvent(new Event(CustomEvents.WordToReplace));
        await handleReplaceWordWith(() => setInputStage(InputStage.ReplaceWordWith), formattedInputSpeech);
      }
    }
    
    if (inputStage === InputStage.ReplaceWordWith && currentScriptObject.userAction.elementId && formattedInputSpeech.length > 0) {
      const newInputValue = handleReplaceWord(currentScriptObject.userAction.elementId, formattedInputSpeech);
      
      if (newInputValue) {
        window.dispatchEvent(new Event(CustomEvents.ReplaceWordWith));
        await handleIsThisCorrect(newInputValue);
      }
    }
    
    if (inputStage === InputStage.AddToAnswer && currentScriptObject.userAction.elementId && formattedInputSpeech.length > 0) {
      const newInputValue = addToCurrentInputValue(currentScriptObject.userAction.elementId, formattedInputSpeech);
      
      window.dispatchEvent(new Event(CustomEvents.AddToInputCompleted));
      await handleIsThisCorrect(newInputValue);
    }
    
    if (inputStage === InputStage.FindWordToCapitalise && currentScriptObject.userAction.elementId && formattedInputSpeech.length > 0) {
      const numberOfOccurrencesOfWordInInput = findNumberOfOccurrencesOfWordInInput(currentScriptObject.userAction.elementId, formattedInputSpeech);
      
      if (numberOfOccurrencesOfWordInInput !== 0) {
        window.dispatchEvent(new Event(CustomEvents.FoundWordToCapitalise));
        await handleCapitaliseWord(numberOfOccurrencesOfWordInInput, formattedInputSpeech, () => setInputStage(InputStage.CapitaliseWord));
      }
    }
    
    if (inputStage === InputStage.CapitaliseWord && currentScriptObject.userAction.elementId && formattedInputSpeech.length > 0) {
      // output a number based on user input
      const specifiedNthValue = 1;
      
      const newInputValue = capitaliseInputWord(currentScriptObject.userAction.elementId, "ryan", specifiedNthValue);
      window.dispatchEvent(new Event(CustomEvents.CapitalisedWord));
      await handleIsThisCorrect(newInputValue);
    }
  }
  
  async function handleOptionSelected(startScriptObjectAgain: () => Promise<void>, option?: InputEditOptions, elementId?: string) {
    if (!option) {
      return;
    }
    
    window.dispatchEvent(new Event(CustomEvents.OptionSelected));
    switch(option) {
      case InputEditOptions.ReplaceWord:
        await handleFindWordToReplace(() => setInputStage(InputStage.FindWordToReplace));
        break;
      case InputEditOptions.StartAgain:
        if (elementId) {
          await handleStartAgain(elementId, () => setInputStage(InputStage.FillInput), startScriptObjectAgain);
        }
        break;
      case InputEditOptions.AddToAnswer:
        await handleAddToInput(() => setInputStage(InputStage.AddToAnswer));
        break;
      case InputEditOptions.CapitaliseWord:
        await handleFindWordToCapitalise(() => setInputStage(InputStage.FindWordToCapitalise));
        break;
    }
  }
  
  async function handleIsThisCorrect(currentInput: string) {
    setInputStage(InputStage.IsThisCorrect);
    
    return new Promise<void>(async (resolve) => {
      readText(`You inputted ${currentInput}, is this correct?`, {
        onSpeechStart: () => {
          stopListening();
        },
        onSpeechEnd: () => startListening()
      });
      function onIsCorrect() {
        cleanup();
        setEditOptions(null);
        window.dispatchEvent(new Event(CustomEvents.NextClicked));
        resolve();
      }

      async function onIsNotCorrect() {
        cleanup(); 
        await handleInputEditOptions();
        resolve();
      }

      function cleanup() {
        window.removeEventListener(CustomEvents.IsCorrect, onIsCorrect);
        window.removeEventListener(CustomEvents.IsNotCorrect, onIsNotCorrect);
      }

      window.addEventListener(CustomEvents.IsCorrect, onIsCorrect);
      window.addEventListener(CustomEvents.IsNotCorrect, onIsNotCorrect);
    });
  }
  
  async function handleInputEditOptions() {
    setInputStage(InputStage.InputEditOptions);
    return new Promise<void>(async (resolve) => {
      readText(`Choose an action from the following options: ${InputEditOptions.ReplaceWord}... ${InputEditOptions.AddToAnswer}... ${InputEditOptions.StartAgain}... ${InputEditOptions.CapitaliseWord}... ${InputEditOptions.AddPunctuation}`, {
        onSpeechStart: () => {
          stopListening();
          setEditOptions(editOptionsArray);
        },
        onSpeechEnd: () => {
          startListening();
        },
      });
      
      function onOptionSelected() {
        cleanup();
        resolve();
      }
      function cleanup() {
        window.removeEventListener(CustomEvents.OptionSelected, onOptionSelected);
      }

      window.addEventListener(CustomEvents.OptionSelected, onOptionSelected);
    })
  }
  
  function updateInputStage(newInputStage: InputStage) {
    setInputStage(newInputStage);
  }
    
  return (
    <InputContext.Provider value={{ handleRecognisedInputSpeech, editOptions, inputStage, updateInputStage }}>
      {children}
    </InputContext.Provider>
  )
}

export function useInput() {
  return useContext(InputContext);
}