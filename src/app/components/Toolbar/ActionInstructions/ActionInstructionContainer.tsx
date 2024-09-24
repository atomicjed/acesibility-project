import {ReactNode} from "react";

interface ActionInstructionContainerProps {
  children: ReactNode;
}

export function ActionInstructionContainer({children}: ActionInstructionContainerProps) {
  return (
    <div className={`bg-white border-b border-b-solid border-b-black py-4 flex items-center justify-center`}>
      {children}
    </div>
  )
}