import { ScriptObject, useSpeech } from "../../lib/context/speech.context.tsx";
import { useEffect, useState } from "react";
import useSpeechRecognition from "../../lib/utils/speech-recognition.utils.ts";
import { faEarListen } from "@fortawesome/free-solid-svg-icons/faEarListen";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Toolbar.css";
import { Button } from "../Button.tsx";

export interface ToolbarProps {
  speaking: boolean;
  visible: boolean;
  script: ScriptObject[] | null;
}

export default function Toolbar({ visible, script }: ToolbarProps ) {
  const [speaking, setSpeaking] = useState<boolean>(false);
  const { readText, highlightFocussedDiv, removeHighlightOnDiv } = useSpeech();
  const { recognisedSpeech, startListening, stopListening, updateRecognisedSpeech, isListening, hasRecognitionSupport } = useSpeechRecognition();

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
    console.log('Recognised word:', recognisedSpeech);
    const formatRecognisedSpeech = recognisedSpeech.trim().toLowerCase();
    if (formatRecognisedSpeech === 'next') {
      handleNextClick();
    }

    if (formatRecognisedSpeech === 'cancel') {
      handleCancelSpeech();
    }
  }, [recognisedSpeech]);
  
  async function onReadScript(scriptArray: ScriptObject[] | null) {
    if (!scriptArray) {
      console.log('Please set up a script, find out how to do this using our docs here: https://docs.com');
      return;
    }
    
    setSpeaking(true);
    for (const scriptObject of scriptArray) {
      if (scriptObject.focussedDiv) {
        highlightFocussedDiv(scriptObject.focussedDiv);
      }
      await readScriptOut(scriptObject);
    }
    setSpeaking(false);
  }
  
  function readScriptOut(scriptObject: ScriptObject) {
    
    return new Promise((resolve) => {
      readText(scriptObject.text, {
        onSpeechEnd: () => {
          cleanup();
          if (scriptObject.focussedDiv) {
            removeHighlightOnDiv(scriptObject.focussedDiv) 
          }
          resolve();
        }
      });

      function onNextClick() {
        window.speechSynthesis.cancel();
        cleanup();
        if (scriptObject.focussedDiv) {
          removeHighlightOnDiv(scriptObject.focussedDiv)
        }
        resolve();
      }
      
      function onCancelClick() {
        cleanup();
        if (scriptObject.focussedDiv) {
          removeHighlightOnDiv(scriptObject.focussedDiv);
        }
      }

      function cleanup() {
        window.removeEventListener('nextClicked', onNextClick);
        window.removeEventListener('cancelClicked', onCancelClick);
      }

      window.addEventListener('nextClicked', onNextClick);
      window.addEventListener('cancelClicked', onCancelClick);
    });
  }
  
  function handleNextClick() {
    const event = new Event('nextClicked');
    window.dispatchEvent(event);
  }
  
  function handleCancelSpeech() {
    window.speechSynthesis.cancel();
    setSpeaking(false);
    
    const event = new Event('cancelClicked');
    window.dispatchEvent(event);
  }
  
  return (
    <div className={`${!visible && 'hidden'} sticky bottom-0 z-[910] w-full text-black`}>
      {isListening && (
        <div className={`bg-white border-b border-b-solid border-b-black py-4 flex items-center justify-center`}>
          {recognisedSpeech ? <div>{recognisedSpeech}</div> :
            <div className={'text-gray-400 font-bold'}>Listening...</div>}
        </div>
      )}
      <div className={'bg-white flex justify-center items-center'}>
        <div className={`bg-white py-8 w-full sm:w-[90%] lg:w-[80%] grid grid-cols-3 gap-4`}>
          {!isListening ? (
            <div className={'h-full flex items-center'}>
              <Button onClick={startListening} className={'p-4 bg-black rounded-2xl text-white'}>Use Speech Recognition</Button>
            </div>
          ) : (
            <div className={'h-full flex items-center'}>
              <div className={'h-[50px] w-[50px] relative inline-flex items-center justify-center'}>
                <FontAwesomeIcon icon={faEarListen} size={'xl'}/>
                <div className={'spinner'}/>
              </div>
            </div>
          )}

          {speaking ? (
            <div className={'flex items-center justify-center gap-6'}>
              <div className={'mt-8 flex flex-col gap-2 items-center'}>
                <button onClick={handleCancelSpeech} className={'p-2 border-black border-solid border rounded-2xl'}>Cancel</button>
                <div className={'text-sm text-gray-400 font-bold'}>Or say "cancel"</div>
              </div>
              <div>Speaking...</div>
              <div className={'mt-8 flex flex-col gap-2 items-center'}>
                <button onClick={handleNextClick} className={'p-2 border-black border-solid border rounded-2xl'}>Next</button>
                <div className={'text-sm text-gray-400 font-bold'}>Or say "next"</div>
              </div>
            </div>
          ) : (
            <div className={'flex items-center justify-center flex-col'}>
              <Button onClick={() => onReadScript(script)} className={'p-4 bg-black rounded-2xl text-white'}>Read Script</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}