export function focusInput(elementId: string) {
  const input = document.getElementById(elementId);
  if (input) {
    input.focus();
  }
}

export function fillInputField(elementId: string, value: string) {
  const inputToFill = document.getElementById(elementId);
  if (inputToFill && inputToFill instanceof HTMLInputElement) {
    inputToFill.value = value;
  } else {
    console.log('Input element with id ', elementId, ' could not be found');
  }
}

export function replaceWordWith(elementId: string, wordToReplace: string, newWord: string) {
  const input = document.getElementById(elementId);
  if (input && input instanceof HTMLInputElement) {
    const currentValue = input.value;
    input.value = currentValue.replace(wordToReplace, newWord);
    return input.value;
  } else {
    console.log('Input element with id ', elementId, ' could not be found');
  }
}

export function capitaliseInputWord(elementId: string, word: string) {
  const input = document.getElementById(elementId);
  if (input && input instanceof HTMLInputElement) {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    input.value = input.value.replace(regex, () => {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });
  } else {
    console.log('Input element with id ', elementId, ' could not be found');
  }
}

export function findWordToReplace(elementId: string, word: string) {
  if (word.length === 0) {
    return false;
  }
  
  const input = document.getElementById(elementId);
  let includesWord = false;
  if (input && input instanceof HTMLInputElement) {
    const inputValue = input.value.toLowerCase().trim();
    const targetWord = word.toLowerCase().trim();

    const regex = new RegExp(`\\b${targetWord}\\b`, 'i');
    includesWord = regex.test(inputValue);
  }
  
  return includesWord;
}