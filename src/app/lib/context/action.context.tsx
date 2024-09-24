import {createContext, useContext} from "react";
import {ContextProps} from "../types/context-props.types.ts";
import {UserActionObject} from "../types/script-object.types.ts";
import {UserActionType} from "../enums/action-type.enum.ts";

type ActionContextType = {
  handleSpeechPromptedAction: (recognisedSpeech: string | null, userActionObject: UserActionObject | undefined, targetWord?: string) => Promise<ActionResponse | undefined>;
}

type ActionResponse = {
  isSuccess: boolean;
  recognisedWord?: string;
}

const ActionContext = createContext<ActionContextType>({
  handleSpeechPromptedAction: () => {return Promise.resolve(undefined)}
});

export function ActionProvider({ children }: ContextProps) {

  async function handleSpeechPromptedAction(recognisedSpeech: string | null, userActionObject: UserActionObject | undefined, targetWord?: string): Promise<ActionResponse | undefined> {
    if (!userActionObject) {
      return;
    }

    if (recognisedSpeech) {
      switch (userActionObject.userActionType) {
        case(UserActionType.Button) :
          return handleButtonAction(userActionObject, recognisedSpeech, targetWord);
      }
    }
  }

  function handleButtonAction(userActionObject: UserActionObject, recognisedSpeech: string, targetWord: string | undefined): ActionResponse | undefined {
    console.log('is recognised speech dat?');
    if (targetWord && userActionObject.elementId && recognisedSpeech.includes(targetWord)) {
      const button = document.getElementById(userActionObject.elementId);
      if (button) {
        button.click();
        return returnSuccess(targetWord);
      }
    }
  }

  function returnSuccess(targetWord?: string): ActionResponse {
    return {
      isSuccess: true,
      recognisedWord: targetWord
    }
  }

  return (
    <ActionContext.Provider value={{ handleSpeechPromptedAction }}>
      {children}
    </ActionContext.Provider>
);
}

export function useAction() {
  return useContext(ActionContext);
}