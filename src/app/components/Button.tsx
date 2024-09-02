import {ButtonHTMLAttributes, ReactNode} from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'light' | 'dark';
  children?: ReactNode; 
}

export function Button({ variant, children, ...props }: ButtonProps) {
  return (
    <button 
        className={`p-3 sm:p-4 rounded-2xl ${variant === 'light' ? 'bg-white text-black' : 'bg-black text-white'}`}
        {...props}
    >{children}</button>
  )
}