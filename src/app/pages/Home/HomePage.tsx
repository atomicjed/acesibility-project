import { useSpeech } from "../../lib/context/speech.context.tsx";
import { useEffect } from "react";
import { Button } from "../../components/Button.tsx";

export default function HomePage() {
  const { updatePageScript } = useSpeech();

  useEffect(() => {
    updatePageScript([
      {
        text: 'Atomic Media, user experience for everyone. Find out how Atomic Media are changing the accessibility game for the better!',
        focussedDiv: 'first'
      },
      {
        text: '15% of the world\'s population, live with some form of disability.',
        focussedDiv: 'second'
      },
      {
        text: 'Speech recognition can improve experience for a range of disabilities including: mobility disabilities like arthritis, temporary disabilities slash injuries, situational disabilities like holding a baby or even when you are multi tasking, for example cooking a meal.',
        focussedDiv: 'third'
      },
      {
        text: 'Click the go accessible button; or say go accessible; to change to a more accessible colourway',
        focussedDiv: 'go-accessible-div',
        targetPhrase: {
          phrase: 'go accessible',
          buttonToClickId: 'accessible-button'
        }
      }
    ]);
  }, []);
  
  function changeColourway() {
    const container = document.getElementById('container');
    container.style.backgroundColor = 'black';
    container.style.color = 'white';
  }
  
  return (
    <div id={'container'} className={'bg-gray-500 text-white h-[100vh] w-full flex flex-col items-center'}>
      <div className={'w-[40%] flex flex-col items-center text-center'}>
        <h1 id={'first'} className={'py-10 text-4xl font-black'}>
          ATOMIC MEDIA: UX FOR EVERYONE
        </h1>
        <div id={'second'} className={'py-10'}>
          15% of the world's population, live with some form of disability.
        </div>
        <div id={'third'} className={'py-10'}>
          Speech recognition can improve experience for a range of disabilities including: mobility disabilities like
          arthritis, temporary disabilities/injuries, situational disabilities like holding a baby, or even when you are
          multi tasking, e.g. cooking a meal.
        </div>
        <div id={'go-accessible-div'}>
          <button id={'accessible-button'} onClick={changeColourway} className={'p-4 rounded-2xl bg-white text-black'}>Go Accessible</button>
        </div>
      </div>
    </div>
  );
}