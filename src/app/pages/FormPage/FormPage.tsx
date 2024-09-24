import Input from "../../components/Input.tsx";
import {useEffect} from "react";
import {UserActionType} from "../../lib/enums/action-type.enum.ts";
import {useSpeech} from "../../lib/context/accessibility.context.tsx";

export default function FormPage() {
  const { updatePageScript } = useSpeech();

  useEffect(() => {
    updatePageScript([
      {
        text: 'Fill out this form to win a prize!',
        focussedDiv: 'form-header'
      },
      {
        text: 'What is your full name?',
        focussedDiv: 'fullNameInput',
        userAction: {
          userActionType: UserActionType.Input,
          elementId: 'fullNameInput'
        },
      },
      {
        text: 'What is your email?',
        focussedDiv: 'emailInput',
        userAction: {
          userActionType: UserActionType.Input,
          elementId: 'emailInput'
        },
      },
      {
        text: 'Thank you for completing this form!'
      },
    ]);
  }, []);
      
    return (
        <div className={'bg-black w-full h-screen text-white flex flex-col items-center'}>
            <h2 id={'form-header'} className={'font-bold italic text-4xl py-8 mt-8'}>
                Fill out this form to win a prize
            </h2>
          
            <form onSubmit={() => alert('Prize has been won')} className={'w-[50%] mt-8 flex flex-col gap-6'}>
                <Input id={'fullNameInput'} className={'w-full'} placeholder={'Full Name'} />
                <Input id={'emailInput'} className={'w-full'} placeholder={'Email'} />
            </form>
        </div>
    )
}