import { useSpeech } from "../../lib/context/speech.context.tsx";
import { Button } from "../Button.tsx";

interface INavbarProps {
  toolbarIsVisible: boolean;
}

export default function Navbar({ toolbarIsVisible }: INavbarProps) {
  const { toggleToolbar } = useSpeech();
  return (
    <div className={'flex bg-gray-800 justify-between items-center py-4 px-12 text-black'}>
      <img src={"src/assets/atomic-logo.svg"} className={'h-[50px]'} alt={'Atomic Media logo'} />
      <Button onClick={toggleToolbar}>{!toolbarIsVisible ? 'Enable' : 'Disable'} Accessibility Mode</Button>
    </div>
  )
}