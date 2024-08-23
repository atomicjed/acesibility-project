import Input from "../../components/Input.tsx";
import {Button} from "../../components/Button.tsx";

export default function FormPage() {
    function onFocusInput() {
        const nameInput = document.getElementById('fullNameInput');
        if (nameInput) {
            nameInput.focus();   
        }
    }

    function fillInputField(elementId: string, value: string) {
      const nameInput = document.getElementById(elementId);
      if (nameInput && nameInput instanceof HTMLInputElement) {
        nameInput.value = value;
      } else {
        console.log('Input element with id ', elementId, ' could not be found');
      }
    }
      
    function capitaliseInputWord(elementId: string, word: string) {
      const input = document.getElementById(elementId);
      if (input && input instanceof HTMLInputElement) {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        input.value = input.value.replace(regex, () => {
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        });
      } else {
        console.log('Input element with id ', elementId, ' could not be found');
      }
    }
      
    return (
        <div className={'bg-black w-full h-screen text-white flex flex-col items-center'}>
            <h2 className={'font-bold italic text-5xl py-8 mt-8'}>
                Fill out this form to win a prize
            </h2>
            <Button onClick={onFocusInput} variant={'light'}>Focus input</Button>
            <Button onClick={() => fillInputField('fullNameInput', 'jose Mourinho')} variant={'light'}>Fill in Name</Button>
            <Button onClick={() => capitaliseInputWord('fullNameInput', 'jose')} variant={'light'}>Capitals</Button>
          
            <form onSubmit={() => alert('Prize has been won')} className={'w-[50%] mt-8 flex flex-col gap-6'}>
                <Input id={'fullNameInput'} className={'w-full'} placeholder={'Full Name'} />
                <Input className={'w-full'} placeholder={'Email'} />
            </form>
        </div>
    )
}