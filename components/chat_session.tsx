import { 
  useState,
  useEffect,
  useCallback,
  Dispatch,
  SetStateAction
   } from "react";

interface ChatSessionProps {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  prompt: string;
  setPrompt:Dispatch<SetStateAction<string>>;
  completion: string;
  setCompletion: Dispatch<SetStateAction<string>>;
}
const ChatSession: React.FC<ChatSessionProps> = ({
  value,
  setValue,
  prompt,
  setPrompt,
  completion,
  setCompletion,
}) => {
  const handleKeyDown = useCallback(
    async (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        setPrompt(value);
        const response = await fetch('/api/openAi',{
          method:'POST',
          headers:{
            'content-type':'application/json'
          },
          body:JSON.stringify({text:value})
        })
        const data = await response.json()
        setValue('')
        console.log(data.result)
        setCompletion(data.result.choices[0].text)
      }
    },
    [value]
  );

  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      setValue(e.target.value);
      
    },
    []
  );

  return (
    <main>
      <input
        type="text"
        placeholder="enter your prompt"
        value={value}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
      />
    </main>
  );
};

export default ChatSession;