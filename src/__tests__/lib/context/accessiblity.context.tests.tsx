import {act, render, screen} from "@testing-library/react";
import {AccessibilityProvider, useSpeech} from "../../../app/lib/context/accessibility.context.tsx";
import {
  getHighlightedDivWrapperId
} from "../../../app/lib/utils/accessibility-context.utils/highlight-focussed-div.utils.ts";

jest.mock("../../../app/lib/utils/accessibility-context.utils/highlight-focussed-div.utils.ts", () => ({
  getHighlightedDivWrapperId: jest.fn((divId) => `${divId}-wrapper`)
}));

const mockSpeechSynthesis = {
  speak: jest.fn(),
  cancel: jest.fn(),
  speaking: false,
  getVoices: jest.fn().mockReturnValue([]),
  onvoiceschanged: null,
};

beforeAll(() => {
  Object.defineProperty(window, "speechSynthesis", {
    value: mockSpeechSynthesis,
    writable: true,
  });
});

const divToHighlightContainerId = "div-to-highlight-container";
const divToHighlightId = "div-to-highlight";
const highlightedDivWrapperId = getHighlightedDivWrapperId(divToHighlightId);
const highlightDivButtonId = "highlight-div-button";
const removeHighlightButtonId = "remove-highlight-button";

function TestComponent() {
  const { highlightFocussedDiv, removeHighlightOnDiv } = useSpeech();
  return (
    <div>
      <div id={divToHighlightContainerId}>
        <div id={divToHighlightId}></div>
      </div>
      <button data-testid={highlightDivButtonId} onClick={() => highlightFocussedDiv(divToHighlightId)}>Highlight Div</button>
      <button data-testid={removeHighlightButtonId} onClick={() => removeHighlightOnDiv(divToHighlightId)}>Remove Highlight</button>
    </div>
  )
}

describe("removeHighlightOnDiv", () => {
  it("should not remove a div if highlighted wrapper isn't found", () => {
    render(
      <AccessibilityProvider>
        <TestComponent />
      </AccessibilityProvider>
    );
    
    act(() => {
      screen.getByTestId(removeHighlightButtonId).click();
    });
    
    expect(document.getElementById(divToHighlightContainerId)).toBeTruthy();
  });
  
  it("should add the highlighted wrapper around the specified div", () => {
    render(
      <AccessibilityProvider>
        <TestComponent />
      </AccessibilityProvider>
    );

    act(() => {
      screen.getByTestId(highlightDivButtonId).click();
    });
    
    act(() => {
      screen.getByTestId(removeHighlightButtonId).click();
    });
    
    expect(document.getElementById(highlightedDivWrapperId)).toBeFalsy();
  });
});

describe("highlightFocussedDiv", () => {
  it("should wrap focussed div in a highlighted wrapper", () => {
    render(
      <AccessibilityProvider>
        <TestComponent />
      </AccessibilityProvider>
    );
    
    act(() => {
      screen.getByTestId(highlightDivButtonId).click();
    });

    expect(document.getElementById(highlightedDivWrapperId)).toBeTruthy();
  });
})