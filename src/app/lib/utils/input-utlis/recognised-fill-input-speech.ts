import {UserActionObject} from "../../types/script-object.types.ts";
import {UserActionType} from "../../enums/action-type.enum.ts";
import {fillInputField} from "./input.utils.ts";
import {SuccessEnum} from "../../enums/success.enum.ts";

export function handleFillInputAction(userActionObject: UserActionObject, recognisedSpeech: string): SuccessEnum {
  if (userActionObject.userActionType === UserActionType.Input && userActionObject.elementId) {
    const input = document.getElementById(userActionObject.elementId);
    if (input) {
      fillInputField(userActionObject.elementId, recognisedSpeech);
      return SuccessEnum.Success;
    }
  }
  
  return SuccessEnum.UnSuccessful;
}