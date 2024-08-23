import {InputHTMLAttributes} from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    className: string;
}

export default function Input({ className, ...props }: InputProps) {
    return (
        <input className={'px-6 py-4 rounded-lg border-2 border-solid border-white text-white bg-black'} {...props} />
    )
}