import {useSpeech} from "../lib/context/accessibility.context.tsx";

export default function TestPage() {
  const {updatePageScript} = useSpeech();
  return (
    <div>Test Page</div>
  )
}