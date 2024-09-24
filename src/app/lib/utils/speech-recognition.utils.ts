import {useEffect, useState} from "react";
import {RecognisedSpeechTypes} from "../enums/recognised-speech-types.enum.ts";

let recognition: any = null;

if ("webkitSpeechRecognition" in window) {
  recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.lang = "en-GB";
} else {
  console.log("Browser doesn't support speech recognition");
}

export default function useSpeechRecognition() {
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  
  const [recognisedSpeech, setRecognisedSpeech] = useState("");
  const [recognisedInputSpeech, setRecognisedInputSpeech] = useState("");
  const [interimRecognisedSpeech, setInterimRecognisedSpeech] = useState("");
  const [interimRecognisedInputSpeech, setInterimRecognisedInputSpeech] = useState("");
  
  const [isListening, setIsListening] = useState(false);
  const [speechRecognitionError, setSpeechRecognitionError] = useState<string | null>(null);
  const [listeningFor, setListeningFor] = useState<RecognisedSpeechTypes>(RecognisedSpeechTypes.Default);

  useEffect(() => {
    initialiseRecognition();
  }, []);
  
  function initialiseRecognition() {
    if (!("webkitSpeechRecognition" in window)) {
      console.log("Browser doesn't support speech recognition");
      return;
    }
    
    const recognitionInstance = new webkitSpeechRecognition();
    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = true;
    recognitionInstance.lang = "en-GB";

    recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
      const result = event.results[event.results.length - 1][0].transcript;
      setInterimRecognisedSpeech(result);
      setInterimRecognisedInputSpeech(result);
      
      if (event.results[0].isFinal) {
        setRecognisedSpeech(recognisedSpeech + ' ' + result);
        setRecognisedInputSpeech(recognisedInputSpeech + ' ' + result);
      }
    };

    recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === 'no-speech') {
        return;
      }
      console.error("Speech recognition error:", event.error);
      setSpeechRecognitionError(`A speech recognition error occured: ${event.error}`);
      stopListening();
    };

    setRecognition(recognitionInstance);
  }
  
  function startListening() {
    if (!recognition) {
      console.log("No recognition instance available, initializing...")
      initialiseRecognition();
    } else {
      setIsListening(true);
      recognition?.start(); 
    }
  }
  
  function stopListening() {
    setIsListening(false);
    recognition?.stop();
  }
  
  function clearRecognisedSpeech() {
    setRecognisedSpeech('');
    setRecognisedInputSpeech('');
  }
  
  function updateListeningFor(recognisedSpeechType: RecognisedSpeechTypes) {
    setListeningFor(recognisedSpeechType);
  }
  
  return {
    recognisedSpeech,
    recognisedInputSpeech,
    interimRecognisedSpeech,
    interimRecognisedInputSpeech,
    isListening,
    startListening,
    stopListening,
    speechRecognitionError,
    clearRecognisedSpeech,
    updateListeningFor,
    listeningFor,
    hasRecognitionSupport: !!recognition
  }
}