import {getInputElement} from "./get-input-element.utils.ts";

export function focusInput(elementId: string) {
  const input = document.getElementById(elementId);
  if (input) {
    input.focus();
  }
}

export function fillInputField(elementId: string, value: string) {
  const inputToFill = getInputElement(elementId);

  if (inputToFill.type === "email") {
    fillEmailInputField(inputToFill, value);
    return;
  }

  inputToFill.value = value;
}

export function clearInputField(elementId: string) {
  const inputToFill = getInputElement(elementId);

  inputToFill.value = "";
}

function formatEmail(input: string): string {
  return input
    .toLowerCase() 
    .replace(/\s+/g, '') // Remove all spaces
    .replace(/at/g, '@') // Replace "at" with "@"
    .replace(/dot/g, '.'); // Replace "dot" with "."
}

function fillEmailInputField(emailInput: HTMLInputElement, value: string) {
  emailInput.value = formatEmail(value);
}

export function replaceWordWith(elementId: string, wordToReplace: string, newWord: string) {
  const input = getInputElement(elementId);

  const currentValue = input.value;
  input.value = currentValue.replace(wordToReplace, newWord);
  return input.value;
}

export function capitaliseInputWord(elementId: string, word: string, nthWord: number) {
  const input = getInputElement(elementId);
  let matchedCount = 0;
    
  const regex = new RegExp(`\\b${word}\\b`, 'gi');
  input.value = input.value.replace(regex, (matchedWord) => {
    matchedCount++;
    if (matchedCount === nthWord) {
      return matchedWord.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }
    
    return matchedWord;
  });
   
   return input.value;
}

export function findNumberOfOccurrencesOfWordInInput(elementId: string, word: string): number {
  if (word.length === 0) {
    return 0;
  }
  
  const input = getInputElement(elementId);
  
  const inputValue = input.value.toLowerCase().trim();
  const targetWord = word.toLowerCase().trim();

  const regex = new RegExp(`\\b${targetWord}\\b`, 'gi');
  const matches = inputValue.match(regex);
  
  return matches ? matches.length : 0;
}

export function addToCurrentInputValue(elementId: string, additionalText: string): string {
  const input = getInputElement(elementId);
  
  const currentInputValue = input.value;
  const newInputValue = `${currentInputValue} ${additionalText}`
  input.value = newInputValue;
  
  return newInputValue;
}