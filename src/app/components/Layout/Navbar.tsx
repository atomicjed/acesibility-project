import { useSpeech } from "../../lib/context/speech.context.tsx";
import { Button } from "../../components/Button.tsx";

interface INavbarProps {
  toolbarIsVisible: boolean;
}

export default function Navbar({ toolbarIsVisible }: INavbarProps) {
  const { toggleToolbar } = useSpeech();
  return (
    <div className={'flex justify-between items-center py-2 text-black'}>
      <Button onClick={toggleToolbar}>{!toolbarIsVisible ? 'Enable' : 'Disable'} Accessibility Mode</Button>
    </div>
  )
}