import {act, render, screen} from "@testing-library/react";
import {useState} from "react";
import {CustomEvents} from "../../../app/lib/enums/custom-events.enum.ts";
import {CapitaliseWordProvider, useCapitaliseWord} from "../../../app/lib/context/capitalise-word.context.tsx";

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
const handleFindWordToCapitaliseButtonId = "handle-capitalise-word-button-id";
const loadingMessage = "loading";
const completedMessage = "completed";

const handleCapitaliseWordButtonId = "handleCapitaliseWordButtonId";
const capitaliseWordStatusElementId = "capitaliseWordStatusElementId";

const mockUpdateInputStage = jest.fn();
const mockUpdateInputStageCapitaliseWord = jest.fn();

function TestComponent() {
  const [status, setStatus] = useState<string>("");
  const [capitalisedWordStatus, setCapitalisedWordStatus] = useState<string>("");
  const { handleFindWordToCapitalise, handleCapitaliseWord } = useCapitaliseWord();

  async function handleClick() {
    setStatus(loadingMessage);
    await handleFindWordToCapitalise(mockUpdateInputStage);
    setStatus(completedMessage);
  }
  
  async function onCapitaliseWord() {
    setCapitalisedWordStatus(loadingMessage);
    await handleCapitaliseWord(2, "word", mockUpdateInputStageCapitaliseWord);
    setCapitalisedWordStatus(completedMessage);
  }

  return (
    <div>
      <div data-testid={handleFindWordToCapitaliseButtonId} onClick={handleClick}></div>
      <p data-testid={statusElementId}>{status}</p>

      <div data-testid={handleCapitaliseWordButtonId} onClick={onCapitaliseWord}></div>
      <p data-testid={capitaliseWordStatusElementId}>{capitalisedWordStatus}</p>
    </div>
  )
}

describe("handleCapitaliseWord", () => {
  it("Should call updateInputStage", async () => {
    // ARRANGE
    render(
      <CapitaliseWordProvider>
        <TestComponent />
      </CapitaliseWordProvider>
    );

    // ACT
    await act(async () => {
      screen.getByTestId(handleFindWordToCapitaliseButtonId).click();
    });
    
    // ASSERT
    expect(mockUpdateInputStage).toHaveBeenCalled();
  });

  it ("Should complete when the recognisedWordToCapitalise event is dispatched", async () => {
    // ARRANGE
    render(
      <CapitaliseWordProvider>
        <TestComponent />
      </CapitaliseWordProvider>
    );

    await act(async () => {
      screen.getByTestId(handleFindWordToCapitaliseButtonId).click();
    });

    expect(screen.getByTestId(statusElementId).textContent).toBe(loadingMessage);

    // ACT
    await act(async () => {
      window.dispatchEvent(new Event(CustomEvents.FoundWordToCapitalise));
    });

    // ASSERT
    expect(screen.getByTestId(statusElementId).textContent).toBe(completedMessage);
  });

  it("Should call read text", async () => {
    // ARRANGE
    render(
      <CapitaliseWordProvider>
        <TestComponent />
      </CapitaliseWordProvider>
    );

    // ACT
    await act(async () => {
      screen.getByTestId(handleFindWordToCapitaliseButtonId).click();
    });

    // ASSERT
    expect(mockReadText).toHaveBeenCalled();
  });
});

describe("handleCapitaliseWord", () => {
  it("Should call updateInputStage", async () => {
    // ARRANGE
    render(
      <CapitaliseWordProvider>
        <TestComponent />
      </CapitaliseWordProvider>
    );

    // ACT
    await act(async () => {
      screen.getByTestId(handleCapitaliseWordButtonId).click();
    });

    // ASSERT
    expect(mockUpdateInputStageCapitaliseWord).toHaveBeenCalled();
  });
  
  it("Should complete when CapitalisedWord Event has been dispatched", async () => {
    // ARRANGE
    render(
      <CapitaliseWordProvider>
        <TestComponent />
      </CapitaliseWordProvider>
    );
    
    await act(async () => {
      screen.getByTestId(handleCapitaliseWordButtonId).click();
    });
    
    expect(screen.getByTestId(capitaliseWordStatusElementId).textContent).toBe(loadingMessage);
    
    // ACT
    await act(async () => {
      window.dispatchEvent(new Event(CustomEvents.CapitalisedWord));
    });
    
    // ASSERT
    expect(screen.getByTestId(capitaliseWordStatusElementId).textContent).toBe(completedMessage);
  })
});