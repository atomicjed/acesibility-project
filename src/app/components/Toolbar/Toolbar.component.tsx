import {useEffect} from "react";
import {faEarListen} from "@fortawesome/free-solid-svg-icons/faEarListen";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import "./Toolbar.css";
import {Button} from "../Button.tsx";
import {useScript} from "../../lib/context/script.context.tsx";
import {useSpeechRecognitionContext} from "../../lib/context/speech-recognition.context.tsx";
import {ScriptObject} from "../../lib/types/script-object.types.ts";
import {RecognisedSpeechTypes} from "../../lib/enums/recognised-speech-types.enum.ts";
import {useInput} from "../../lib/context/input.context.tsx";
import {TargetWordAction} from "./ActionInstructions/TargetWordAction.component.tsx";
import {UserInputAction} from "./ActionInstructions/UserInputAction/UserInputAction.tsx";

export interface ToolbarProps {
  speaking: boolean;
  visible: boolean;
  script: ScriptObject[] | null;
}

export default function Toolbar({ visible, script }: ToolbarProps ) {
  const { recognisedSpeech, recognisedInputSpeech, interimRecognisedSpeech, interimRecognisedInputSpeech, startListening, stopListening, isListening, listeningFor } = useSpeechRecognitionContext();
  const { handleReadScript, handleRecognisedSpeech, handleNextClick, handleCancelSpeech, targetWord, targetWordDetected, speaking, currentScriptObject } = useScript();
  const { inputStage, handleRecognisedInputSpeech } = useInput();

  useEffect(() => {
    if (script) {
      let i = 1;
      for (const scriptObject of script) {
        scriptObject.textId = i;
        i++;
      }
    }
  }, [script]);

  useEffect(() => {
    if (currentScriptObject && listeningFor === RecognisedSpeechTypes.TargetWord) {
      handleRecognisedSpeech(currentScriptObject);
    }
  }, [recognisedSpeech, interimRecognisedSpeech, listeningFor, targetWord, currentScriptObject]);

  useEffect(() => {
    async function onRecognisedInputSpeech() {
      if (listeningFor === RecognisedSpeechTypes.UserInput && currentScriptObject) {
        await handleRecognisedInputSpeech(currentScriptObject);
      }
    }
    
    void onRecognisedInputSpeech();
  }, [recognisedInputSpeech, interimRecognisedInputSpeech, listeningFor, targetWord, currentScriptObject]);
  
  return (
    <div className={`${!visible && 'hidden'} sticky bottom-0 z-[910] w-full text-black`}>
      {listeningFor === RecognisedSpeechTypes.UserInput && (
        <UserInputAction interimRecognisedInputSpeech={interimRecognisedInputSpeech} inputStage={inputStage} recognisedInputSpeech={recognisedInputSpeech}/>
      )}
      {listeningFor === RecognisedSpeechTypes.TargetWord && isListening && (
        <TargetWordAction targetWordDetected={targetWordDetected} targetWord={targetWord}
                          recognisedSpeech={recognisedSpeech}/>
      )}

      <div className={'bg-white flex justify-center items-center'}>
        <div className={`bg-white py-4 w-full sm:w-[90%] lg:w-[80%] grid grid-cols-3 gap-4`}>
          {!isListening ? (
            <div></div>
          ) : (
            <div onMouseDown={startListening} onMouseUp={stopListening}
                 className={'ml-[25px] h-full flex items-center cursor-pointer'}>
              <div
                className={'h-[35px] lg:h-[50px] w-[35px] lg:w-[50px] relative inline-flex items-center justify-center'}>
                <FontAwesomeIcon icon={faEarListen} className={'text-lg lg:text-xl'}/>
                <div className={`${isListening ? '' : 'hidden'} spinner`}/>
              </div>
            </div>
          )}

          {speaking ? (
            <div className={'flex items-center justify-center gap-6'}>
              <div className={`${isListening && 'mt-8'} flex flex-col gap-2 items-center`}>
                <button onClick={handleCancelSpeech}
                        className={'p-2 border-black border-solid border rounded-2xl'}>Cancel
                </button>
                {isListening && <div
                    className={`${targetWordDetected === 'cancel' && 'flash-green'} text-sm text-center text-gray-400 font-bold`}>Or
                    say "cancel"</div>}
              </div>

              {!isListening ? <div>Speaking...</div> : <div>Listening...</div>}

              <div className={`${isListening && 'mt-8'} flex flex-col gap-2 items-center`}>
                <button onClick={handleNextClick} className={'p-2 border-black border-solid border rounded-2xl'}>Next</button>
                {isListening && <div className={`${targetWordDetected === 'next' && 'flash-green'} text-sm text-center text-gray-400 font-bold`}>Or say "next"</div>}
              </div>
            </div>
          ) : (
            <div className={'flex items-center justify-center flex-col'}>
              <Button onClick={() => handleReadScript(script)} className={'p-4 bg-black rounded-2xl text-white'}>Read Script</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}