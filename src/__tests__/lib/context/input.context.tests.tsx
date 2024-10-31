import {act, render, screen} from "@testing-library/react";
import {InputProvider, useInput} from "../../../app/lib/context/input.context.tsx";
import {ScriptObject} from "../../../app/lib/types/script-object.types.ts";
import {UserActionType} from "../../../app/lib/enums/action-type.enum.ts";
import {InputStage} from "../../../app/lib/enums/InputStage.enum.ts";
import {useEffect, useState} from "react";
import {CustomEvents} from "../../../app/lib/enums/custom-events.enum.ts";
import {InputEditOptions} from "../../../app/lib/enums/input-edit-options.enum.ts";

jest.mock("../../../app/lib/context/accessibility.context.tsx", () => ({
  useSpeech: () => ({
    readText: jest.fn(),
  }),
}));

const useSpeechRecognitionContextMock = jest.fn();
jest.mock("../../../app/lib/context/speech-recognition.context.tsx", () => ({
  useSpeechRecognitionContext: () => useSpeechRecognitionContextMock()
}));

jest.mock("../../../app/lib/context/replace-word.context.tsx", () => ({
  useReplaceWord: () => ({
    handleFindWordToReplace: jest.fn(),
    handleReplaceWordWith: jest.fn(),
    handleReplaceWord: jest.fn(),
    updateWordToReplace: jest.fn(),
  }),
}));

jest.mock("../../../app/lib/context/start-again.context.tsx", () => ({
  useStartAgain: () => ({
    handleStartAgain: jest.fn(),
  }),
}));

const mockHandleAddToInput = jest.fn();
jest.mock("../../../app/lib/context/add-to-input.context.tsx", () => ({
  useAddToInput: () => ({
    handleAddToInput: mockHandleAddToInput,
  }),
}));

const mockHandleFIndWordToCapitalise = jest.fn();
jest.mock("../../../app/lib/context/capitalise-word.context.tsx", () => ({
  useCapitaliseWord: () => ({
    handleFindWordToCapitalise: mockHandleFIndWordToCapitalise
  }),
}));

const mockStartScriptAgain = jest.fn();

const inputStageElementId = "input-stage-element-id";
const testInputId = "test-input-id";
const setInputStageToFillInputButtonId = "set-input-stage-to-fill-input-button-id";
const setInputStageToAddToAnswerButtonId = "set-input-stage-to-add-to-answer-button-id";
const handleRecognisedInputSpeechButtonId = "handle-recognised-input-speech-button-id";
const addedToInputIncompleteMessage = "incomplete";
const addedToInputCompletedMessage = "complete";
const addedToInputStatusElementId = "added-to-input-status-element-id";

const mockCurrentScriptObject: ScriptObject = {
  text: "Mock input action script",
  textId: 1,
  userAction: {
    userActionType: UserActionType.Input,
    elementId: testInputId
  }
}

function TestComponent() {
  const [addedToInputStatus, setAddedToInputStatus] = useState<string>(addedToInputIncompleteMessage);
  const { inputStage, updateInputStage, handleRecognisedInputSpeech } = useInput();

  useEffect(() => {
    function onAddedToInput() {
      setAddedToInputStatus(addedToInputCompletedMessage);
    }
    
    window.addEventListener(CustomEvents.AddToInputCompleted, onAddedToInput);

    return () => {
      window.removeEventListener(CustomEvents.AddToInputCompleted, onAddedToInput);
    };
  }, []);
  
  async function onHandleRecognisedInputSpeech() {
    await handleRecognisedInputSpeech(mockCurrentScriptObject, mockStartScriptAgain);
  }
  
  return (
    <div>
      <button onClick={() => updateInputStage(InputStage.FillInput)} data-testid={setInputStageToFillInputButtonId}>Set input stage to fill input</button>
      <button onClick={() => updateInputStage(InputStage.AddToAnswer)} data-testid={setInputStageToAddToAnswerButtonId}>Set input stage to add to answer</button>
      <div data-testid={handleRecognisedInputSpeechButtonId} onClick={onHandleRecognisedInputSpeech}>Handle recognised input</div>
      <div data-testid={inputStageElementId}>{inputStage}</div>
      <div data-testid={addedToInputStatusElementId}>{addedToInputStatus}</div>
      <input data-testid={testInputId} id={testInputId} />
    </div>
  )
}
describe("handleRecognisedInputSpeech", () => {
  beforeEach(() => {
    jest.resetModules();
    
    useSpeechRecognitionContextMock.mockImplementation(() => ({
      recognisedInputSpeech: "default input",
      interimRecognisedInputSpeech: "default input",
      stopListening: jest.fn(),
      startListening: jest.fn(),
    }));
  });

  it("should set input stage to is this correct when an action completes", async () => {
    // ARRANGE
    render(
      <InputProvider>
        <TestComponent />
      </InputProvider>
    );

    await act(async () => {
      screen.getByTestId(setInputStageToFillInputButtonId).click();
    });

    expect(screen.getByTestId(inputStageElementId).textContent).toBe(InputStage.FillInput);

    // ACT
    await act(async () => {
      screen.getByTestId(handleRecognisedInputSpeechButtonId).click();
    });

    // ASSERT
    expect(screen.getByTestId(inputStageElementId).textContent).toBe(InputStage.IsThisCorrect);
  });

  it("should dispatch add to input complete event when AddToAnswer stage is completed", async () => {
    // ARRANGE
    render(
      <InputProvider>
        <TestComponent />
      </InputProvider>
    );

    await act(async () => {
      screen.getByTestId(setInputStageToAddToAnswerButtonId).click();
    });

    expect(screen.getByTestId(addedToInputStatusElementId).textContent).toBe(addedToInputIncompleteMessage);

    // ACT
    await act(async () => {
      screen.getByTestId(handleRecognisedInputSpeechButtonId).click();
    });

    // ASSERT
    expect(screen.getByTestId(addedToInputStatusElementId).textContent).toBe(addedToInputCompletedMessage);
  });

  it("should call handleAddToInput when prompted", async () => {
    // ARRANGE
    useSpeechRecognitionContextMock.mockImplementation(() => ({
      recognisedInputSpeech: InputEditOptions.AddToAnswer,
      interimRecognisedInputSpeech:InputEditOptions.AddToAnswer,
      stopListening: jest.fn(),
      startListening: jest.fn(),
    }));
    
    render(
      <InputProvider>
        <TestComponent />
      </InputProvider>
    );

    await act(async () => {
      screen.getByTestId(setInputStageToFillInputButtonId).click();
    });

    expect(screen.getByTestId(inputStageElementId).textContent).toBe(InputStage.FillInput);

    await act(async () => {
      screen.getByTestId(handleRecognisedInputSpeechButtonId).click();
    });

    expect(screen.getByTestId(inputStageElementId).textContent).toBe(InputStage.IsThisCorrect);

    await act(async () => {
      window.dispatchEvent(new Event(CustomEvents.IsNotCorrect));
    });

    expect(screen.getByTestId(inputStageElementId).textContent).toBe(InputStage.InputEditOptions);

    await act(async () => {
      screen.getByTestId(handleRecognisedInputSpeechButtonId).click();
    });

    expect(mockHandleAddToInput).toHaveBeenCalled();
  });
  
  it("should call handleFindWordToCapitalise when prompted", async () => {
    // ARRANGE
    useSpeechRecognitionContextMock.mockImplementation(() => ({
      recognisedInputSpeech: InputEditOptions.CapitaliseWord,
      interimRecognisedInputSpeech:InputEditOptions.CapitaliseWord,
      stopListening: jest.fn(),
      startListening: jest.fn(),
    }));
    
    render(
      <InputProvider>
        <TestComponent />
      </InputProvider>
    );

    await act(async () => {
      screen.getByTestId(setInputStageToFillInputButtonId).click();
    });

    expect(screen.getByTestId(inputStageElementId).textContent).toBe(InputStage.FillInput);

    await act(async () => {
      screen.getByTestId(handleRecognisedInputSpeechButtonId).click();
    });

    expect(screen.getByTestId(inputStageElementId).textContent).toBe(InputStage.IsThisCorrect);

    await act(async () => {
      window.dispatchEvent(new Event(CustomEvents.IsNotCorrect));
    });

    expect(screen.getByTestId(inputStageElementId).textContent).toBe(InputStage.InputEditOptions);

    await act(async () => {
      screen.getByTestId(handleRecognisedInputSpeechButtonId).click();
    });

    expect(mockHandleFIndWordToCapitalise).toHaveBeenCalled();
  });
});