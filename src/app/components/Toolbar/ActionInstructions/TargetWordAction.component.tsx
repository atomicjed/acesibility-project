import {ActionInstructionContainer} from "./ActionInstructionContainer.tsx";

interface TargetWordProps {
  targetWordDetected: string | null;
  targetWord?: string;
  recognisedSpeech: string;
}

export function TargetWordAction({targetWordDetected, targetWord, recognisedSpeech}: TargetWordProps) {
  return (
    <ActionInstructionContainer>
      <div className={'w-[90%] lg:w-[70%] grid grid-cols-2 gap-12'}>
        <div className={'flex justify-center'}>
          <div className={'text-gray-400 font-bold'}>Listening for: <span
            className={`${targetWordDetected === targetWord && 'flash-green'}`}>{targetWord}</span></div>
        </div>
        <div className={'flex justify-center'}>
          <div className={'text-gray-400 font-bold'}>Response: <span
            className={`${targetWordDetected === targetWord && 'flash-green'}`}>{recognisedSpeech ? recognisedSpeech : '...'}</span>
          </div>
        </div>
      </div>
    </ActionInstructionContainer>
)
}