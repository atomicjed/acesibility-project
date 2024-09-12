export function focusInput(elementId: string) {
  const nameInput = document.getElementById(elementId);
  if (nameInput) {
    nameInput.focus();
  }
}

export function fillInputField(elementId: string, value: string) {
  const nameInput = document.getElementById(elementId);
  if (nameInput && nameInput instanceof HTMLInputElement) {
    nameInput.value = value;
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