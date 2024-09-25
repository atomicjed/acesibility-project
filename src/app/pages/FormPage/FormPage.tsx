import Input from "../../components/Input.tsx";
import {useEffect, useState} from "react";
import {UserActionType} from "../../lib/enums/action-type.enum.ts";
import {useSpeech} from "../../lib/context/accessibility.context.tsx";
import {Button} from "../../components/Button.tsx";
import "./FormPage.css";

export default function FormPage() {
  const [prize, setPrize] = useState<string | null>(null);
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
        text: 'Click the submit button or say submit to submit this form',
        focussedDiv: 'submitButton',
        userAction: {
          userActionType: UserActionType.Button,
          elementId: 'submitButton',
          targetPhrase: 'submit'
        },
      },
      {
        text: 'Well done, you have won a 50% discount at Fat Hippo, what a day!'
      }
    ]);
  }, []);
  
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPrize('You have won a 50% discount at Fat Hippo!');
  }
      
    return (
        <div className={'bg-black w-full h-screen text-white flex flex-col items-center'}>
            <h2 id={'form-header'} className={'font-bold italic text-4xl py-8 mt-8'}>
                Fill out this form to win a prize
            </h2>
          
            <form onSubmit={handleSubmit} className={'w-[50%] mt-8 flex flex-col gap-6'}>
              <Input id={'fullNameInput'} className={'w-full'} placeholder={'Full Name'} />
              <Input type={'email'} id={'emailInput'} className={'w-full'} placeholder={'Email'} />
              <Button id={'submitButton'} type={'submit'} variant={'light'}>Submit</Button>
            </form>

          {prize && (
            <div className={'animate-pop bg-white w-[60%] h-[60%] flex justify-center items-center text-black flex-col gap-8 absolute origin-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'}>
              <h2 className={'font-bold italic text-3xl'}>Well done!</h2>
              <h4 className={'text-xl'}>{prize}</h4>
            </div>
          )}
        </div>
    )
}