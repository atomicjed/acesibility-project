
import { Button } from "../Button.tsx";
import logo from "../../../assets/atomic-logo.svg";
import {useSpeech} from "../../lib/context/accessibility.context.tsx";

interface INavbarProps {
  toolbarIsVisible: boolean;
}

export default function Navbar({ toolbarIsVisible }: INavbarProps) {
  const { toggleToolbar } = useSpeech();
  return (
    <div className={'flex bg-gray-800 justify-between items-center py-4 px-4 lg:px-12 text-black sticky top-0 z-[900]'}>
      <img src={logo} className={'h-[50px]'} alt={'Atomic Media logo'} />
      <Button variant={'light'} onClick={toggleToolbar}>{!toolbarIsVisible ? 'Enable' : 'Disable'} Accessibility Mode</Button>
    </div>
  )
}