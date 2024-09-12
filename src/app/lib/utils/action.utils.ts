import {UserActionObject} from "../types/script-object.types.ts";
import {UserActionType} from "../enums/action-type.enum.ts";
import {fillInputField} from "./input-utlis/input.utils.ts";

type ActionResponse = {
  isSuccess: boolean;
  targetWord?: string;
}

export function handleSpeechPromptedAction(recognisedSpeech: string | null, userActionObject: UserActionObject | undefined, targetWord?: string): ActionResponse | undefined {
  if (!userActionObject) {
    return;
  }
  
  if (recognisedSpeech) {
    switch (userActionObject.userActionType) {
      case(UserActionType.Button) :
        return handleButtonAction(userActionObject, recognisedSpeech, targetWord);
      case(UserActionType.Input) :
        return handleInputAction(userActionObject, recognisedSpeech);
    }
  }
}

function handleButtonAction(userActionObject: UserActionObject, recognisedSpeech: string, targetWord: string | undefined): ActionResponse | undefined {
  if (targetWord && userActionObject.elementId && recognisedSpeech.includes(targetWord)) {
    const button = document.getElementById(userActionObject.elementId);
    if (button) {
      button.click();
      return returnSuccess(targetWord);
    }
  }
}

function handleInputAction(userActionObject: UserActionObject, recognisedSpeech: string): ActionResponse | undefined {
  if (userActionObject.userActionType === UserActionType.Input && userActionObject.elementId) {
    const input = document.getElementById(userActionObject.elementId);
    if (input) {
      fillInputField(userActionObject.elementId, recognisedSpeech);
      return returnSuccess();
    }
  }
}

function returnSuccess(targetWord?: string): ActionResponse {
  return {
    isSuccess: true,
    targetWord: targetWord
  }
}