import {act, render, screen} from "@testing-library/react";
import {StartAgainProvider, useStartAgain} from "../../../app/lib/context/start-again.context.tsx";

const startScriptObjectAgain = jest.fn();

const startAgainButtonText = "Start Again";
const defaultInputValue = "Not empty"

function TestComponent() {
  const { handleStartAgain } = useStartAgain();
  const inputId = "inputId";
  
  return (
    <div>
      <button onClick={async () => await handleStartAgain(inputId, () => {}, startScriptObjectAgain)}>{startAgainButtonText}</button>
      <input id={inputId} type={"text"} defaultValue={defaultInputValue} />
    </div>
  )
}

describe("handleStartAgain", () => {
  it("clears input when called", async () => {
    render(
      <StartAgainProvider>
        <TestComponent />
      </StartAgainProvider>
    );
    const inputId = "inputId";
    const inputElementToBeCleared = document.getElementById(inputId);
    if (!(inputElementToBeCleared instanceof HTMLInputElement)) {
      throw new Error("Element under test is not an input element");
    }
    
    expect(inputElementToBeCleared.value).toBe(defaultInputValue);
    
    await act(() => {
      screen.getByText(startAgainButtonText).click();
    });
    
    expect(inputElementToBeCleared.value).toBe("");
  });
  
  it("Should call startScriptObjectAgain when called", async () => {
    render(
      <StartAgainProvider>
        <TestComponent />
      </StartAgainProvider>
    );

    await act(() => {
      screen.getByText(startAgainButtonText).click();
    });
    
    expect(startScriptObjectAgain).toHaveBeenCalled();
  })
});

