import {InputStage} from "../../../../lib/enums/InputStage.enum.ts";

interface UserInputActionProps {
  inputStage: InputStage;
  recognisedInputSpeech: string;
}

export function UserInputAction({inputStage, recognisedInputSpeech}: UserInputActionProps) {
  return (
    <>
      {inputStage === InputStage.FillInput && (
        <div className={'flex w-full justify-center'}>
          <div className={'flex justify-center'}>
            <div className={'text-gray-400 font-bold'}>Response: <span>{recognisedInputSpeech ? recognisedInputSpeech : '...'}</span>
            </div>
          </div>
        </div>
      )}
      {inputStage === InputStage.IsThisCorrect && (
        <div className={'flex flex-col items-center justify-center'}>
          <div className={'flex justify-center'}>
            <div className={'text-gray-400 font-bold'}>Is this correct?<span>Yay or nay?</span></div>
          </div>
          <div className={'flex'}>
            <div className={'flex justify-center'}>
              <div className={'text-gray-400 font-bold'}>Response: <span>{recognisedInputSpeech ? recognisedInputSpeech : '...'}</span>
              </div>
            </div>
          </div>
        </div>
      )}
      {inputStage === InputStage.InputEditOptions && (
        <div className={'flex flex-col items-center justify-center'}>
          <div className={'flex justify-center'}>
            <div className={'text-gray-400 font-bold'}>Listening for: <span>A number of actions</span></div>
          </div>
          <div className={'flex justify-center'}>
            <div className={'text-gray-400 font-bold'}>Response: <span>{recognisedInputSpeech ? recognisedInputSpeech : '...'}</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}