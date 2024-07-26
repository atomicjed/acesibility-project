import { Children } from "react";

export function Button({ onClick, children }) {
  return (
    <button onClick={onClick} className={'p-4 bg-black rounded-2xl text-white'}>{children}</button>
  )
}