import {InputEditOptions} from "../../enums/input-edit-options.enum.ts";

type InputEditActions = {
  option: InputEditOptions;
  action: () => void;
}
export function handleRecognisedInputEditOption(recognisedSpeech: string): InputEditOptions | undefined {
  const actionsMap: InputEditActions[] = [
    { option: InputEditOptions.ReplaceWord, action: () => {/* replace */} },
    { option: InputEditOptions.AddToAnswer, action: () => {/* add to answer */} },
    { option: InputEditOptions.StartAgain, action: () => {/* start over */} },
    { option: InputEditOptions.CapitaliseWord, action: () => {/* capitalise word */} },
    { option: InputEditOptions.AddPunctuation, action: () => {/* add punctuation */} },
  ];
  
  let selectedOption: InputEditOptions | undefined = undefined;
  for (const action of actionsMap) {
    if (recognisedSpeech.includes(action.option)) {
      selectedOption = action.option;
      break;
    }
  }
  
  return selectedOption;
}