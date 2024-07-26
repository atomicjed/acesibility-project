import { useSpeech } from "../../lib/context/speech.context.tsx";
import { useEffect } from "react";

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
      }
    ]);
  }, []);
  
  return (
    <div className={'bg-black text-white h-[100vh] w-full flex flex-col items-center'}>
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
      </div>
    </div>
  );
}