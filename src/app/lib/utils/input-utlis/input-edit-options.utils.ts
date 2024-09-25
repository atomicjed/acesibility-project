import {InputEditOptions} from "../../enums/input-edit-options.enum.ts";

type InputEditActions = {
  option: InputEditOptions;
}
export function handleRecognisedInputEditOption(recognisedSpeech: string): InputEditOptions | undefined {
  const actionsMap: InputEditActions[] = [
    { option: InputEditOptions.ReplaceWord },
    { option: InputEditOptions.AddToAnswer },
    { option: InputEditOptions.StartAgain },
    { option: InputEditOptions.CapitaliseWord },
    { option: InputEditOptions.AddPunctuation },
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