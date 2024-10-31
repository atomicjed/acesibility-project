import {CustomEvents} from "../../enums/custom-events.enum.ts";

export function handleRecognisedIsThisCorrect(inputSpeech: string) {
  const affirmativeResponses = ['yes', 'yeah', 'yup', 'yep', 'sure', 'absolutely', 'of course', 'right', 'correct', 'definitely', 'uh-huh', 'you bet', 'totally', 'for sure'];
  const negativeResponses = ['no', 'nope', 'nah', 'not really', 'incorrect', 'wrong', 'negative', 'absolutely not', 'certainly not', 'no way', 'uh-uh', 'nuh-uh', 'no chance'];

  if (affirmativeResponses.some(word => inputSpeech.includes(word))) {
    window.dispatchEvent(new Event(CustomEvents.IsCorrect));
  }

  if (negativeResponses.some(word => inputSpeech.includes(word))) {
    window.dispatchEvent(new Event(CustomEvents.IsNotCorrect));
  }
}