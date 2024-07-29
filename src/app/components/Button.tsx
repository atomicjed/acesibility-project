import { Children } from "react";

export function Button({ onClick, onMouseUp, onMouseDown, onTouchStart, onTouchEnd, children, variant }) {
  return (
    <button onClick={onClick} onMouseDown={onMouseDown} onMouseUp={onMouseUp} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} className={`p-4 rounded-2xl ${variant === 'light' ? 'bg-white text-black' : 'bg-black text-white'}`}>{children}</button>
  )
}