import {act, render} from "@testing-library/react";
import {
  addToCurrentInputValue,
  capitaliseInputWord,
  clearInputField, 
  findNumberOfOccurrencesOfWordInInput, 
} from "../../../../app/lib/utils/input-utlis/input.utils.ts";
import {CantFindInputError} from "../../../../app/lib/errors/CantFindInputError.ts";

const inputToBeClearedId = "inputToBeClearedId";
const addToInputId = "addToInputId";
const capitaliseWordId = "capitaliseWordId";
const additionalText = "sentence";

function TestComponent() {
  return (
    <div>
      <input id={inputToBeClearedId} type={"text"} defaultValue={"Not empty"} /> 
      <input id={addToInputId} type={"text"} defaultValue={"finish this"} />
      <input id={capitaliseWordId} type={"text"} defaultValue={"capital letter capital"} />
    </div>
  )
}

describe("clearInputField", () => {
  it("clears input when called when input element is found", () => {
    // ARRANGE
    render(<TestComponent />);
    
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

    // ACT & ASSERT
    expect(() => clearInputField(incorrectElementId)).toThrow(CantFindInputError);
  })
});

describe("addToCurrentInputValue", () => {
  it("should add to the current input value", () => {
    // ARRANGE
    render(<TestComponent />);
    const input = document.getElementById(addToInputId);
    if (!(input instanceof HTMLInputElement)) {
      throw new Error("Element is not an input");
    }
    
    // ACT
    act(() => addToCurrentInputValue(addToInputId, additionalText));
    
    // ASSERT
    expect(input.value).toBe(`finish this ${additionalText}`);
  });
  
  it("Should throw CantFindInputError if input element could not be found", () => {
    // ARRANGE
    render(<TestComponent />);
    
    // ACT & ASSERT
    expect(() => addToCurrentInputValue("incorrectInputId", "")).toThrow(CantFindInputError);
  });
});

describe("capitaliseInputWord", () => {
  it("Should capitalise the specified word", () => {
    // ARRANGE
    render(
      <TestComponent />
    );
    const input = document.getElementById(capitaliseWordId);
    if (!(input instanceof HTMLInputElement)) {
      throw new Error("Specified element is not an input");
    }
    
    // ACT
    act(() => {
      capitaliseInputWord(capitaliseWordId, "capital", 1);
    });
    
    // ASSERT
    expect(input.value).toBe("Capital letter capital");
  });
  
  it("Should return the new input value", () => {
    // ARRANGE
    render(
      <TestComponent />
    );
    const input = document.getElementById(capitaliseWordId);
    if (!(input instanceof HTMLInputElement)) {
      throw new Error("Specified element is not an input");
    }

    // ACT
    const newInputValue = capitaliseInputWord(capitaliseWordId, "capital", 1);

    // ASSERT
    expect(newInputValue).toBe("Capital letter capital");
  });
  
  it ("Should capitalise specified word if there are more than one of the same word", () => {
    // ARRANGE
    render(
      <TestComponent />
    );
    const input = document.getElementById(capitaliseWordId);
    if (!(input instanceof HTMLInputElement)) {
      throw new Error("Specified element is not an input");
    }

    // ACT
    act(() => {
      capitaliseInputWord(capitaliseWordId, "capital", 2);
    });

    // ASSERT
    expect(input.value).toBe("capital letter Capital");
  });
});

describe("findNumberOfOccurrencesOfWordInInput", () => {
  it("should return the number occurrences of the word in input value", () => {
    // ARRANGE
    render(
      <TestComponent />
    );
    const input = document.getElementById(capitaliseWordId);
    if (!(input instanceof HTMLInputElement)) {
      throw new Error("Specified element is not an input");
    }

    // ACT
    const wordCount = findNumberOfOccurrencesOfWordInInput(capitaliseWordId, "capital");

    // ASSERT
    expect(wordCount).toBe(2);
  });
  
  it("should return 0 if input value does not contain the word", () => {
    // ARRANGE
    render(
      <TestComponent />
    );
    const input = document.getElementById(capitaliseWordId);
    if (!(input instanceof HTMLInputElement)) {
      throw new Error("Specified element is not an input");
    }

    // ACT
    const numberOfOccurrences = findNumberOfOccurrencesOfWordInInput(capitaliseWordId, "not-in-there");

    // ASSERT
    expect(numberOfOccurrences).toBe(0);
  });
  
  it("should throw CantFindInputError if can't find input", () => {
    // ARRANGE
    render(
      <TestComponent />
    );
    
    // ACT & ASSERT
    expect(() => findNumberOfOccurrencesOfWordInInput("incorrect-id", "capital")).toThrow(CantFindInputError);
  })
});