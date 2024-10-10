import {useNavigate} from "react-router-dom";
import {useSpeech} from "../../lib/context/accessibility.context.tsx";
import {useEffect} from "react";
import {UserActionType} from "../../lib/enums/action-type.enum.ts";
import FatHippo from '../../../assets/fat-hippo.jpg';

export default function FatHippoScandal() {
  const navigate = useNavigate();const { updatePageScript } = useSpeech();

  useEffect(() => {
    updatePageScript([
      {
        text: 'OUTRAGE ACROSS THE COUNTRY!',
        focussedDiv: 'fat-hippo-first'
      },
      {
        text: 'Following periods of sustained demand, burger restaurant Fat Hippo has completely run out of burgers!',
        focussedDiv: 'fat-hippo-second'
      },
      {
        text: 'This has left web developers across the country stranded, all dreading to ask the question, do we try somewhere new? It has to be said, not many places will put up with their relentless rounds of shit face.',
        focussedDiv: 'fat-hippo-third'
      },
      {
        text: 'That\'s all for this news letter, updates on its return will be announced at 5:30 this afternoon.',
        focussedDiv: 'fat-hippo-fourth'
      },
      {
        text: 'Click the go to form page button or say go to form page to go to the form page',
        focussedDiv: 'go-to-form',
        userAction: {
          userActionType: UserActionType.Button,
          targetPhrase: 'go to form page',
          elementId: 'go-to-form-button'
        },
      }
    ]);
  }, []);
  
  return (
    <div id={'fat-hippo-container'} className={`text-white bg-gray-500 h-[100vh] w-full flex gap-16 lg:gap-24 justify-center`}>
      <div className={'w-[90%] lg:w-[38%] flex flex-col items-center text-center'}>
        <h1 id={'fat-hippo-first'} className={'py-6 lg:py-10 text-4xl lg:text-5xl font-black italic'}>
          OUTRAGE ACROSS THE COUNTRY!
        </h1>
        <div id={'fat-hippo-second'} className={'py-6 lg:py-10'}>
          Following periods of sustained demand, burger restaurant Fat Hippo has completely run out of burgers!
        </div>
        <div id={'fat-hippo-third'} className={'py-6 lg:py-10'}>
          This has left web developers across the country stranded, all dreading to ask the question, do we try
          somewhere new? It has to be said, not many places will put up with their relentless rounds of shit face.
        </div>
        <div id={'fat-hippo-fourth'} className={'py-6 lg:py-10'}>
          That's all for this news letter, updates on its return will be announced at 5:30 this afternoon.
        </div>
        <div id={'go-to-form'}>
          <button id={'go-to-form-button'} onClick={() => navigate('/form-page')} className={'p-4 rounded-2xl bg-white text-black'}>
            Go to form page
          </button>
        </div>
      </div>
      <img src={FatHippo} alt={'Fat Hippo Restaurant'} className={'object-cover h-[60%] w-[30%] sticky top-[120px] rounded-sm'} />
    </div>
  )
}