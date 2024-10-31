import {createContext, useContext} from "react";
import {ContextProps} from "../types/context-props.types.ts";
import {useSpeech} from "./accessibility.context.tsx";
import {useSpeechRecognitionContext} from "./speech-recognition.context.tsx";
import {CustomEvents} from "../enums/custom-events.enum.ts";

type AddToInputContextType = {
  handleAddToInput: (updateInputStage: () => void) => Promise<void>;
}

const AddToInputContext = createContext<AddToInputContextType>({
  handleAddToInput: async () => {},
});

export function AddToInputProvider({ children }: ContextProps) {
  const { readText } = useSpeech();
  const { stopListening, startListening } = useSpeechRecognitionContext();
  
  async function handleAddToInput(updateInputStage: () => void) {
    updateInputStage();
    
    return new Promise<void>(async (resolve) => {
      readText('What would you like to add to this input?', {
        onSpeechStart: () => {
          stopListening();
        },
        onSpeechEnd: () => startListening()
      });
      
      function onAddedToInput() {
        window.removeEventListener(CustomEvents.AddToInputCompleted, onAddedToInput);
        resolve();
      }
      
      window.addEventListener(CustomEvents.AddToInputCompleted, onAddedToInput);
    })
  }
  
  return (
    <AddToInputContext.Provider value={{handleAddToInput}}>
      {children}
    </AddToInputContext.Provider>
  )
}

export function useAddToInput() {
  return useContext(AddToInputContext);
}