import {UserActionObject} from "../types/script-object.types.ts";
import {UserActionType} from "../enums/action-type.enum.ts";

type ActionResponse = {
  isSuccess: boolean;
  targetWord: string;
}

export function handleSpeechPromptedAction(targetWord: string | null, recognisedSpeech: string | null, userActionObject: UserActionObject | undefined): ActionResponse | undefined {
  if (!userActionObject) {
    return;
  }
  
  if (targetWord && recognisedSpeech?.includes(targetWord)) {
    
    if (userActionObject.userActionType === UserActionType.Button && userActionObject.elementId) {
      const button = document.getElementById(userActionObject.elementId);
      if (button) {
        button.click();
      }
    }
    
    return {
      isSuccess: true,
      targetWord: targetWord
    };
  }
}