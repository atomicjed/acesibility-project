import {render} from "@testing-library/react";
import {clearInputField} from "../../../../app/lib/utils/input-utlis/input.utils.ts";

function TestComponent() {
  const inputToBeClearedId = "inputToBeClearedId";
  return (
    <div>
      <input id={inputToBeClearedId} type={"text"} defaultValue={"Not empty"} /> 
    </div>
  )
}

describe("clearInputField", () => {
  it("clears input when called when input element is found", () => {
    // ARRANGE
    render(<TestComponent />);
    const inputToBeClearedId = "inputToBeClearedId";
    
    const inputElementToBeCleared = document.getElementById(inputToBeClearedId);
    if (!(inputElementToBeCleared instanceof HTMLInputElement)) {
      throw new Error("Element under test is not an input element");
    }
    
    // ACT
    clearInputField(inputToBeClearedId);

    // ASSERT
    expect(inputElementToBeCleared.value).toBe("");
  });
  
  it("Should throw an error if it can't find the input element", () => {
    // ARRANGE
    render(<TestComponent />);
    const incorrectElementId = "incorrectElementId";

    // ACT
    expect(() => clearInputField(incorrectElementId)).toThrow(`Input element with id, ${incorrectElementId}, could not be found`)
  })
});
