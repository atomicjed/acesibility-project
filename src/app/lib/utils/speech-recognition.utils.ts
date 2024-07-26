import { useCallback, useEffect, useState } from "react";

let recognition: any = null;

if ("webkitSpeechRecognition" in window) {
  recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.lang = "en-GB";
} else {
  console.log("Browser doesn't support speech recognition");
}

function useSpeechRecognition() {
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [recognisedSpeech, setRecognisedSpeech] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [speechRecognitionError, setSpeechRecognitionError] = useState<string | null>(null);

  useEffect(() => {
    initialiseRecognition();
  }, []);
  
  function initialiseRecognition() {
    if ("webkitSpeechRecognition" in window) {
      const recognitionInstance = new webkitSpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.lang = "en-GB";

      recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
        const result = event.results[event.results.length - 1][0].transcript;
        setRecognisedSpeech(result);
      };

      recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error("Speech recognition error:", event.error);
        setSpeechRecognitionError(`A speech recognition error occured: ${event.error}`);
        stopListening(); 
      };

      setRecognition(recognitionInstance);
    } else {
      console.log("Browser doesn't support speech recognition");
    }
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
  
  function updateRecognisedSpeech(text: string) {
    setRecognisedSpeech(text);
  }
  
  return {
    recognisedSpeech,
    isListening,
    startListening,
    stopListening,
    updateRecognisedSpeech,
    hasRecognitionSupport: !!recognition
  }
}

export default useSpeechRecognition;