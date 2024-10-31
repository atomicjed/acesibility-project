import {ScriptProvider, useScript} from "../../../app/lib/context/script.context.tsx";
import {act, render, screen} from "@testing-library/react";
import {CustomEvents} from "../../../app/lib/enums/custom-events.enum.ts";

interface MockSpeechSynthesis extends SpeechSynthesis {
  cancel: jest.Mock;
  speak: jest.Mock;
  onvoiceschanged: (() => void) | null;
  paused: boolean;
  pending: boolean;
  speaking: boolean;
  getVoices: jest.Mock;
  pause: jest.Mock;
  resume: jest.Mock;
  addEventListener: jest.Mock;
  removeEventListener: jest.Mock;
  dispatchEvent: jest.Mock;
}

beforeAll(() => {
  const mockSpeechSynthesis: MockSpeechSynthesis = {
    cancel: jest.fn(),
    speak: jest.fn(),
    onvoiceschanged: null,
    paused: false,
    pending: false,
    speaking: false,
    getVoices: jest.fn().mockReturnValue([]),
    pause: jest.fn(),
    resume: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  };

  Object.defineProperty(window, 'speechSynthesis', {
    value: mockSpeechSynthesis,
    writable: false, 
  });
});

const mockScriptArray = [
  { text: "Mock Text Script 1", textId: 1 },
  { text: "Mock Text Script 2", textId: 2 },
  { text: "Mock Text Script 3", textId: 3 },
  { text: "Mock Text Script 4", textId: 4 },
];

const readTextMock = jest.fn();
jest.mock("../../../app/lib/context/accessibility.context.tsx", () => ({
  useSpeech: () => ({
    readText: readTextMock,
    highlightFocussedDiv: jest.fn(),
    removeHighlightOnDiv: jest.fn(),
    script: mockScriptArray,
  }),
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

jest.mock("../../../app/lib/context/action.context.tsx", () => ({
  useAction: () => ({
    handleSpeechPromptedAction: jest.fn(),
  }),
}));

jest.mock("../../../app/lib/context/input.context.tsx", () => ({
  useInput: () => ({
    updateInputStage: jest.fn(),
  }),
}));

const previousButtonText = "Previous";
const readScriptButtonText = "Read script";
const startScriptAgainButtonText = "Start script again";
const textId = "textId";

function TestComponent() {
  const { handleReadScript, currentScriptObject, goToPreviousScriptObject, startScriptObjectAgain } = useScript();

  return (
    <div>
      <div data-testid={textId}>{currentScriptObject?.textId}</div>
      <button onClick={async () => await goToPreviousScriptObject()}>{previousButtonText}</button>
      <button onClick={async () => await handleReadScript()}>{readScriptButtonText}</button>
      <button onClick={async () => await startScriptObjectAgain()}>{startScriptAgainButtonText}</button>
    </div>
  )
}

describe("handleReadScript", () => {
  it("should read the next script object when the nextClicked event is dispatched", async () => {
    render(
      <ScriptProvider>
        <TestComponent />
      </ScriptProvider>
    );
    
    const readScriptButton = screen.getByText(readScriptButtonText);
    await act(async () => {
      readScriptButton.click();
    });

    let textIdElement = screen.getByTestId(textId);
    expect(textIdElement.textContent).toBe("1");
    
    await act(async () => {
      window.dispatchEvent(new Event(CustomEvents.NextClicked));
    });
    
    textIdElement = screen.getByTestId(textId);
    expect(textIdElement.textContent).toBe("2");

    await act(async () => {
      window.dispatchEvent(new Event(CustomEvents.NextClicked));
    });

    textIdElement = screen.getByTestId(textId);
    expect(textIdElement.textContent).toBe("3");
  });
  
  it("should cancel the script when the cancelClicked event is dispatched", async () => {
    render(
      <ScriptProvider>
        <TestComponent />
      </ScriptProvider>
    );

    const readScriptButton = screen.getByText(readScriptButtonText);
    await act(async () => {
      readScriptButton.click();
    });

    expect(screen.getByTestId(textId).textContent).toBe("1");

    await act(async () => {
      window.dispatchEvent(new Event(CustomEvents.CancelClicked));
    });

    expect(screen.getByTestId(textId).textContent).toBe("");
  });
});

describe("goToPreviousScriptObject", () => {
  it("should cancel the current handleReadScript", async () => {
    const { cancel } = window.speechSynthesis as MockSpeechSynthesis;
    render(
      <ScriptProvider>
        <TestComponent />
      </ScriptProvider>
    );

    const readScriptButton = screen.getByText(readScriptButtonText);
    await act(async () => {
      readScriptButton.click();
    });

    const previousScriptButton = screen.getByText(previousButtonText);
    await act(async () => {
      previousScriptButton.click();
    });

    expect(cancel).toHaveBeenCalled();
    expect(mockStopListening).toHaveBeenCalled();
  });
  
  it("if current script object is the first script object, should replay the current script object", async () => {
    render(
      <ScriptProvider>
        <TestComponent />
      </ScriptProvider>
    );

    const readScriptButton = screen.getByText(readScriptButtonText);
    await act(async () => {
      readScriptButton.click();
    });

    expect(screen.getByTestId(textId).textContent).toBe("1");

    let previousButton = screen.getByText(previousButtonText);
    await act(async () => {
      previousButton.click();
    });

    expect(screen.getByTestId(textId).textContent).toBe("1");
  });
  
  it("should set the current script object to the previous script object", async () => {
    render(
      <ScriptProvider>
        <TestComponent />
      </ScriptProvider>
    );

    await act(async () => {
      screen.getByText(readScriptButtonText).click();
    });

    await act(async () => {
      window.dispatchEvent(new Event(CustomEvents.NextClicked));
    });

    expect(screen.getByTestId(textId).textContent).toBe("2");

    await act(async () => {
      window.dispatchEvent(new Event(CustomEvents.NextClicked));
    });

    expect(screen.getByTestId(textId).textContent).toBe("3");

    let previousButton = screen.getByText(previousButtonText);
    await act(async () => {
      previousButton.click();
    });

    expect(screen.getByTestId(textId).textContent).toBe("2");
  });
});

describe("startScriptAgain", () => {
  it("should cancel the current handleReadScript", async () => {
    const { cancel } = window.speechSynthesis as MockSpeechSynthesis;
    render(
      <ScriptProvider>
        <TestComponent />
      </ScriptProvider>
    );

    await act(async () => {
      screen.getByText(readScriptButtonText).click();
    });

    await act(async () => {
      screen.getByText(startScriptAgainButtonText).click();
    });

    expect(cancel).toHaveBeenCalled();
    expect(mockStopListening).toHaveBeenCalled();
  });
  
  it("should jump to the same script object", async () => {
    render(
      <ScriptProvider>
        <TestComponent />
      </ScriptProvider>
    );

    await act(async () => {
      screen.getByText(readScriptButtonText).click();
    });

    await act(async () => {
      window.dispatchEvent(new Event(CustomEvents.NextClicked));
    });

    expect(screen.getByTestId(textId).textContent).toBe("2");

    await act(async () => {
      window.dispatchEvent(new Event(CustomEvents.NextClicked));
    });

    expect(screen.getByTestId(textId).textContent).toBe("3");
    
    await act(async () => {
      screen.getByText(startScriptAgainButtonText).click();
    });
    
    expect(screen.getByTestId(textId).textContent).toBe("3");
  });
})