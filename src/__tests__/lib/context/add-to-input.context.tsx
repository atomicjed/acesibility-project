import {AddToInputProvider, useAddToInput} from "../../../app/lib/context/add-to-input.context.tsx";
import {act, render, screen} from "@testing-library/react";
import {useState} from "react";
import {CustomEvents} from "../../../app/lib/enums/custom-events.enum.ts";

const mockReadText = jest.fn();
jest.mock("../../../app/lib/context/accessibility.context.tsx", () => ({
  useSpeech: () => ({
    readText: mockReadText,
  })
}));

const mockStopListening = jest.fn();
jest.mock("../../../app/lib/context/speech-recognition.context.tsx", () => ({
  useSpeechRecognitionContext: () => ({
    stopListening: mockStopListening,
    startListening: jest.fn(),
    recognisedSpeech: "",
    updateListeningFor: jest.fn(),
  }),
}));

const statusElementId = "status-element-id";
const handleAddToInputButtonId = "handle-add-to-input-button-id";
const loadingMessage = "loading";
const completedMessage = "completed";

const mockUpdateInputStage = jest.fn();

function TestComponent() {
  const [status, setStatus] = useState<string>("");
  const { handleAddToInput } = useAddToInput();
  
  async function handleClick() {
    setStatus(loadingMessage);
    await handleAddToInput(mockUpdateInputStage);
    setStatus(completedMessage);
  }
  
  return (
    <div>
      <div data-testid={handleAddToInputButtonId} onClick={handleClick}></div>
      <p data-testid={statusElementId}>{status}</p>
    </div>
  )
}

describe("handleAddToInput", () => {
  it("Should call updateInputStage", async () => {
    // ARRANGE
    render(
      <AddToInputProvider>
        <TestComponent />
      </AddToInputProvider>
    );
    
    // ACT
    await act(async () => {
      screen.getByTestId(handleAddToInputButtonId).click();
    });
    
    // ASSERT
    expect(mockUpdateInputStage).toHaveBeenCalled();
  });
  
  it ("Should complete when the addToInputCompleted event is dispatched", async () => {
    // ARRANGE
    render(
      <AddToInputProvider>
        <TestComponent />
      </AddToInputProvider>
    );
    
    await act(async () => {
      screen.getByTestId(handleAddToInputButtonId).click();
    });
    
    expect(screen.getByTestId(statusElementId).textContent).toBe(loadingMessage);
    
    // ACT
    await act(async () => {
      window.dispatchEvent(new Event(CustomEvents.AddToInputCompleted));
    });
    
    // ASSERT
    expect(screen.getByTestId(statusElementId).textContent).toBe(completedMessage);
  });
  
  it("Should call read text", async () => {
    // ARRANGE
    render(
      <AddToInputProvider>
        <TestComponent />
      </AddToInputProvider>
    );

    // ACT
    await act(async () => {
      screen.getByTestId(handleAddToInputButtonId).click();
    });

    // ASSERT
    expect(mockReadText).toHaveBeenCalled();
  });
})