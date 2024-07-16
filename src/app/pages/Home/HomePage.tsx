import { useEffect, useState } from "react";
import { useSpeech } from "../../lib/context/speech.context.tsx";

export default function HomePage() {
  const readText = useSpeech();
  
  return (
    <div className={'bg-red-500 text-white h-[100vh] w-full flex justify-center items-center'}>
      <button className={'p-6 bg-white text-red-500 cursor-pointer'} onClick={() => readText('Ay up jackie! How are you today? I\'m glad to see you here!')}>Greet</button>
    </div>
  );
}