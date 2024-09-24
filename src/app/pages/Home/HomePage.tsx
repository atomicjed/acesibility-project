import {useEffect, useState} from "react";
import {UserActionType} from "../../lib/enums/action-type.enum.ts";
import {useSpeech} from "../../lib/context/accessibility.context.tsx";

export default function HomePage() {
  const [isAccessibleColourway, setIsAccessibleColourway] = useState<boolean>(false);
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
        text: 'Speech recognition can improve experience for a range of disabilities including: mobility disabilities like arthritis, temporary disabilities slash injuries, situational disabilities like holding a baby, or even when you are multi tasking, for example cooking a meal.',
        focussedDiv: 'third'
      },
      {
        text: 'Click the change background button; or say change background; to change to a more accessible colourway',
        focussedDiv: 'go-accessible-div',
        userAction: {
          userActionType: UserActionType.Button,
          targetPhrase: 'change background',
          elementId: 'accessible-button'
        },
      },
      {
        text: 'At Atomic Media, we out care the competition by delivering products that make a difference!',
        focussedDiv: 'fourth'
      }
    ]);
  }, []);
  
  function changeBackground() {
    setIsAccessibleColourway(true);
  }
  
  return (
    <div id={'container'} className={`${isAccessibleColourway ? 'bg-black' : 'bg-gray-500'} text-white h-[100vh] w-full flex flex-col items-center`}>
      <div className={'w-[90%] lg:w-[40%] flex flex-col items-center text-center'}>
        <h1 id={'first'} className={'py-6 lg:py-10 text-4xl font-black'}>
          ATOMIC MEDIA: UX FOR EVERYONE
        </h1>
        <div id={'second'} className={'py-6 lg:py-10'}>
          15% of the world's population, live with some form of disability.
        </div>
        <div id={'third'} className={'py-6 lg:py-10'}>
          Speech recognition can improve experience for a range of disabilities including: mobility disabilities like
          arthritis, temporary disabilities/injuries, situational disabilities like holding a baby, or even when you are
          multi tasking, e.g. cooking a meal.
        </div>
        <div id={'go-accessible-div'}>
          <button id={'accessible-button'} onClick={changeBackground}
                  className={'p-4 rounded-2xl bg-white text-black'}>Change Background
          </button>
        </div>
        <div id={'fourth'} className={'py-6 lg:py-10'}>
          At Atomic Media, we out care the competition by delivering products that make a difference!
        </div>
      </div>
    </div>
  );
}