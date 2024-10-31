import React, {createContext, useContext, useEffect, useState} from 'react';
import Toolbar from "../../components/Toolbar/Toolbar.component.tsx";
import Navbar from "../../components/Layout/Navbar.tsx";
import {ScriptProvider} from "./script.context.tsx";
import {SpeechRecognitionProvider} from "./speech-recognition.context.tsx";
import {ScriptObject} from "../types/script-object.types.ts";
import {InputProvider} from "./input.context.tsx";
import {ContextProps} from "../types/context-props.types.ts";
import {ActionProvider} from "./action.context.tsx";
import {ReplaceWordProvider} from "./replace-word.context.tsx";
import {StartAgainProvider} from "./start-again.context.tsx";
import {getHighlightedDivWrapperId} from "../utils/accessibility-context.utils/highlight-focussed-div.utils.ts";
import {AddToInputProvider} from "./add-to-input.context.tsx";
import {CapitaliseWordProvider} from "./capitalise-word.context.tsx";

type SpeechContextType = {
  readText: (text: string, speechState?: SpeechState) => void;
  updatePageScript: (scriptArray: ScriptObject[]) => void;
  highlightFocussedDiv: (divId: string) => void;
  removeHighlightOnDiv: (divId: string) => void;
  updateHighlightedDivStyling: (styles: React.CSSProperties) => void;
  toggleToolbar: () => void;
  script: ScriptObject[] | null;
};

type SpeechState = {
  onSpeechStart?: () => void;
  onSpeechEnd?: () => void;
  onError?: (event: SpeechSynthesisErrorEvent) => void;
}

const speechContextIsNotInitialised = () => {
  console.warn('SpeechContext is not initialised');
};

const SpeechContext = createContext<SpeechContextType>({
  readText: speechContextIsNotInitialised, 
  updatePageScript: speechContextIsNotInitialised, 
  highlightFocussedDiv: speechContextIsNotInitialised, 
  removeHighlightOnDiv: speechContextIsNotInitialised,
  updateHighlightedDivStyling: speechContextIsNotInitialised,
  toggleToolbar: speechContextIsNotInitialised,
  script: null,
});

export function AccessibilityProvider({ children }: ContextProps) {
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [script, setScript] = useState<ScriptObject[] | null>(null);
  const [toolbarIsVisible, setToolbarIsVisible] = useState<boolean>(false);
  const [focussedDivStyles, setFocussedDivStyles] = useState<React.CSSProperties>({
    position: 'relative',
    backgroundColor: 'rgba(255, 255, 0, 0.3)',
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: '#FBBF24',
    padding: '20px',
    borderRadius: '0.125rem',
    zIndex: '900'
  });

  useEffect(() => {
    initializeSpeechSynthesis();
  }, []);

  function initializeSpeechSynthesis() {
    if ('speechSynthesis' in window) {
      const synthesis = window.speechSynthesis;
      let voice = null;

      const setVoices = () => {
        const voices = synthesis.getVoices();
        const selectedVoice = voices.find(v => v.name === 'Google UK English Female') || voices[0];
        setVoice(selectedVoice);
        voice = selectedVoice;
      };

      synthesis.onvoiceschanged = setVoices;
      setVoices();
      return voice;
    } else {
      console.error('Text-to-speech not supported.');
      return null;
    }
  }

  function readText(text: string, speechState?: SpeechState) {
    let initialisedVoice = null;
    if (!voice) {
      initialisedVoice = initializeSpeechSynthesis();
    }

    const utterance: SpeechSynthesisUtterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voice ? voice : initialisedVoice;
    utterance.pitch = 1;
    utterance.rate = 1;
    utterance.volume = 1;

    utterance.onstart = () => {
      if (speechState?.onSpeechStart) speechState.onSpeechStart();
    };

    utterance.onend = () => {
      if (speechState?.onSpeechEnd) speechState.onSpeechEnd();
    };

    utterance.onerror = (event) => {
      if (event.error === 'interrupted') {
        return;
      }
      
      console.error('SpeechSynthesisUtterance error:', event);
      if (speechState?.onError) speechState.onError(event);
    };

    window.speechSynthesis.speak(utterance);
  }
  
  function updatePageScript(pageScript: ScriptObject[]) {
    let i = 1;
    for (const scriptObject of pageScript) {
      scriptObject.textId = i;
      i++;
    }
    
    setScript(pageScript);
  }

  function highlightFocussedDiv(divId: string) {
    const divToHighlight = document.getElementById(divId);
    if (divToHighlight) {
      const wrapper = document.createElement('div');
      Object.assign(wrapper.style, focussedDivStyles);
      
      wrapper.id = getHighlightedDivWrapperId(divId);
      
      divToHighlight.parentNode?.insertBefore(wrapper, divToHighlight);
      
      wrapper.appendChild(divToHighlight);
    }
  }

  function updateHighlightedDivStyling(styles: React.CSSProperties) {
    setFocussedDivStyles(styles);
  }
  
  function removeHighlightOnDiv(divId: string) {
    const divToLoseFocus = document.getElementById(divId);
    if (divToLoseFocus) {
      const highlightedWrapper = divToLoseFocus.parentElement;
      const highlightedWrapperId = getHighlightedDivWrapperId(divId);
      
      if (highlightedWrapper && highlightedWrapper.id === highlightedWrapperId) {
        const parentDiv = highlightedWrapper.parentNode;
        if (parentDiv) {
          parentDiv.insertBefore(divToLoseFocus, highlightedWrapper);
          parentDiv.removeChild(highlightedWrapper);
        }
      }
    }
  }
  
  function toggleToolbar() {
    setToolbarIsVisible(prevState => !prevState);
  }

  return (
    <SpeechContext.Provider value={{ readText, updatePageScript, highlightFocussedDiv, removeHighlightOnDiv, updateHighlightedDivStyling, toggleToolbar, script }}>
      <Navbar toolbarIsVisible={toolbarIsVisible} />
      {children}
      <SpeechRecognitionProvider>
        <ReplaceWordProvider>
          <StartAgainProvider>
            <AddToInputProvider>
              <CapitaliseWordProvider>
                <InputProvider>
                  <ActionProvider>
                    <ScriptProvider>
                      <Toolbar speaking={window.speechSynthesis.speaking} visible={toolbarIsVisible} />
                    </ScriptProvider>
                  </ActionProvider>
                </InputProvider>
              </CapitaliseWordProvider>
            </AddToInputProvider>
          </StartAgainProvider>
        </ReplaceWordProvider>
      </SpeechRecognitionProvider>
    </SpeechContext.Provider>
  );
}

export const useSpeech = () => {
  return useContext(SpeechContext);
};