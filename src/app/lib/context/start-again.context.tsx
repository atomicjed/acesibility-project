import {createContext, useContext} from "react";
import {ContextProps} from "../types/context-props.types.ts";
import {clearInputField} from "../utils/input-utlis/input.utils.ts";

type StartAgainContextType = {
  handleStartAgain: (inputId: string, updateInputStage: () => void, startScriptObjectAgain: () => Promise<void>) => Promise<void>,
}

const StartAgainContext = createContext<StartAgainContextType>({
  handleStartAgain: async () => {},
})

export function StartAgainProvider({ children }: ContextProps) {
  
  async function handleStartAgain(inputId: string, updateInputStage: () => void, startScriptObjectAgain: () => Promise<void>) {
    updateInputStage();
    clearInputField(inputId);
    await startScriptObjectAgain();
  } 
  
  return (
    <StartAgainContext.Provider value={{ handleStartAgain }}>
      {children}
    </StartAgainContext.Provider>
  )
}

export function useStartAgain() {
  return useContext(StartAgainContext);
}