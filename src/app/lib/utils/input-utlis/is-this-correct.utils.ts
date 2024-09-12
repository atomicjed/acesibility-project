export function handleRecognisedIsThisCorect(inputSpeech: string) {
  const affirmativeResponses = ['yes', 'yeah', 'yup', 'yep', 'sure', 'absolutely', 'of course', 'right', 'correct', 'definitely', 'uh-huh', 'you bet', 'totally', 'for sure'];
  const negativeResponses = ['no', 'nope', 'nah', 'not really', 'incorrect', 'wrong', 'negative', 'absolutely not', 'certainly not', 'no way', 'uh-uh', 'nuh-uh', 'no chance'];

  if (affirmativeResponses.some(word => inputSpeech.includes(word))) {
    handleYes();
  }

  if (negativeResponses.some(word => inputSpeech.includes(word))) {
    handleNo();
  }
}

export function handleYes() {
  const event = new Event('yes');
  window.dispatchEvent(event);
}

export function handleNo() {
  const event = new Event('no');
  window.dispatchEvent(event);
}