import {InputStage} from "../../../../lib/enums/InputStage.enum.ts";
import {ActionInstructionContainer} from "../ActionInstructionContainer.tsx";
import "../../Toolbar.css";
import {InputEditOptions} from "../../../../lib/enums/input-edit-options.enum.ts";

interface UserInputActionProps {
  inputStage: InputStage;
  recognisedInputSpeech: string;
  interimRecognisedInputSpeech: string;
}

export function UserInputAction({inputStage, recognisedInputSpeech, interimRecognisedInputSpeech}: UserInputActionProps) {
  function flashOnRecognisedWord(targetWord: string) {
    if (recognisedInputSpeech.includes(targetWord)) {
      return 'flash-green';
    } 
  }
  
  return (
    <ActionInstructionContainer>
      {inputStage === InputStage.FillInput && (
        <div className={'flex w-full justify-center'}>
          <div className={'flex justify-center'}>
            <div className={'text-gray-400 font-bold'}>Response: <span>{recognisedInputSpeech ? recognisedInputSpeech : '...'}</span>
            </div>
          </div>
        </div>
      )}
      {inputStage === InputStage.IsThisCorrect && (
        <div className={'w-[90%] lg:w-[70%] grid grid-cols-2 gap-12'}>
          <div className={'flex justify-center'}>
            <div className={'text-gray-400 font-bold'}>Is this correct?</div>
          </div>
            <div className={'flex justify-center'}>
              <div className={'text-gray-400 font-bold'}>Response: <span>{(interimRecognisedInputSpeech && interimRecognisedInputSpeech.length !== 0) ? interimRecognisedInputSpeech : '...'}</span>
              </div>
            </div>
        </div>
      )}
      {inputStage === InputStage.InputEditOptions && (
        <div className={'flex flex-col'}>
          <div className={'flex justify-center'}>
            <div className={'text-gray-400 font-bold text-center'}>
              <table>
                <tbody>
                <tr className={'border-b border-b-solid border-b-black'}>
                  <td className={'p-4 border-r border-r-solid border-r-black text-black'}>Command</td>
                  <td className={`${flashOnRecognisedWord(InputEditOptions.ReplaceWord)} p-4 border-r border-r-solid border-r-black`}>replace</td>
                  <td className={`${flashOnRecognisedWord(InputEditOptions.AddToAnswer)} p-4 border-r border-r-solid border-r-black`}>add</td>
                  <td className={`${flashOnRecognisedWord(InputEditOptions.StartAgain)} p-4 border-r border-r-solid border-r-black`}>start again</td>
                  <td className={`${flashOnRecognisedWord(InputEditOptions.CapitaliseWord)} p-4 border-r border-r-solid border-r-black`}>capital</td>
                  <td className={`${flashOnRecognisedWord(InputEditOptions.AddPunctuation)} p-4`}>punctuation</td>
                </tr>
                <tr>
                  <td className={'p-4 border-r border-r-solid border-r-black text-black'}>Action</td>
                  <td className={'p-4 border-r border-r-solid border-r-black'}>Replace a word</td>
                  <td className={'p-4 border-r border-r-solid border-r-black'}>Add to your answer</td>
                  <td className={'p-4 border-r border-r-solid border-r-black'}>Clear the input and start again</td>
                  <td className={'p-4 border-r border-r-solid border-r-black'}>Capitalise a word</td>
                  <td className={'p-4'}>Add punctuation to your answer</td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className={'flex justify-center'}>
            <div className={'text-gray-400 font-bold'}>Response: <span>{(interimRecognisedInputSpeech && interimRecognisedInputSpeech.length !== 0) ? interimRecognisedInputSpeech : '...'}</span>
            </div>
          </div>
        </div>
      )}
      {inputStage === InputStage.FindWordToReplace && (
        <div className={'w-[90%] lg:w-[70%] grid grid-cols-2 gap-12'}>
          <div className={'flex justify-center'}>
            <div className={'text-gray-400 font-bold'}>Which word would you like to replace?</div>
          </div>
          <div className={'flex justify-center'}>
            <div className={'text-gray-400 font-bold'}>Response: <span>{recognisedInputSpeech ? recognisedInputSpeech : '...'}</span></div>
          </div>
        </div>
      )}
      {inputStage === InputStage.ReplaceWordWith && (
        <div className={'w-[90%] lg:w-[70%] grid grid-cols-2 gap-12'}>
          <div className={'flex justify-center'}>
            <div className={'text-gray-400 font-bold'}>What word or phrase would you like to replace this with?</div>
          </div>
          <div className={'flex justify-center'}>
            <div className={'text-gray-400 font-bold'}>Response: <span>{recognisedInputSpeech ? recognisedInputSpeech : '...'}</span></div>
          </div>
        </div>
      )}
    </ActionInstructionContainer>
  )
}