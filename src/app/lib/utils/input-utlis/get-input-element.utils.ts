import {CantFindInputError} from "../../errors/CantFindInputError.ts";

export function getInputElement(elementId: string): HTMLInputElement {
  const input = document.getElementById(elementId);
  if (input && input instanceof HTMLInputElement) {
    return input;
  } else {
    throw new CantFindInputError(`Input element with id "${elementId}" was not found.`);
  }
}