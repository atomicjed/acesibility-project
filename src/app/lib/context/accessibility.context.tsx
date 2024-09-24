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

type SpeechContextType = {
  readText: (text: string, speechState?: SpeechState) => void;
  updatePageScript: (scriptArray: ScriptObject[]) => void;
  highlightFocussedDiv: (divId: string) => void;
  removeHighlightOnDiv: (divId: string) => void;
  updateHighlightedDivStyling: (styles: React.CSSProperties) => void;
  toggleToolbar: () => void;
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
});

export function AccessibilityProvider({ children }: ContextProps) {
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [pageScript, setPageScript] = useState<ScriptObject[] | null>(null);
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
  
  function updatePageScript(script: ScriptObject[]) {
    setPageScript(script);
  }

  function highlightFocussedDiv(divId: string) {
    const divToHighlight = document.getElementById(divId);
    if (divToHighlight) {
      const wrapper = document.createElement('div');
      Object.assign(wrapper.style, focussedDivStyles);
      
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
      if (highlightedWrapper && highlightedWrapper !== document.body) {
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
    <SpeechContext.Provider value={{readText, updatePageScript, highlightFocussedDiv, removeHighlightOnDiv, updateHighlightedDivStyling, toggleToolbar}}>
      <Navbar toolbarIsVisible={toolbarIsVisible} />
      {children}
      <SpeechRecognitionProvider>
        <ReplaceWordProvider>
          <InputProvider>
            <ActionProvider>
              <ScriptProvider>
                <Toolbar speaking={window.speechSynthesis.speaking} script={pageScript} visible={toolbarIsVisible} />
              </ScriptProvider>
            </ActionProvider>
          </InputProvider>
        </ReplaceWordProvider>
      </SpeechRecognitionProvider>
    </SpeechContext.Provider>
  );
}

export const useSpeech = () => {
  return useContext(SpeechContext);
};