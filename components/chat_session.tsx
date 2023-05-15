import { 
  useState,
  useEffect,
  useCallback,
  Dispatch,
  SetStateAction
   } from "react";
import { MessageType,ConversationType } from "./HomePage";
import useSWR from 'swr'

interface ChatSessionProps {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  prompt: string;
  setPrompt:Dispatch<SetStateAction<string>>;
  completion: string;
  setCompletion: Dispatch<SetStateAction<string>>;
  conversation:MessageType[]
  setConversation:Dispatch<SetStateAction<MessageType[]>>
}


const ChatSession: React.FC<ChatSessionProps> = ({
  value,
  setValue,
  prompt,
  setPrompt,
  completion,
  setCompletion,
  conversation,
  setConversation
}) => {

  const fetchOpenAiResponse = async (conversation) =>{
    const response = await fetch('/api/openAi',{
      method:'POST',
      headers:{
        'content-type':'application/json'
      },
      body: conversation
    })
    const data = await response.json()
    return(data.result.choices[0].message.content)
  }
  const handleKeyDown = useCallback(
    async (e: React.KeyboardEvent<HTMLInputElement>) => {
    
      if (e.key === "Enter") {
        //setPrompt(value);
        if(!conversation){
          setConversation([{role:'user',content:value}])
        }else{
          setConversation((prevConvo)=>([...prevConvo,{role:'user',content:value}]))
        }
         setValue('')
         try {
          const response = await fetchOpenAiResponse(conversation);
          setCompletion(response);
        } catch (error) {
          console.error(error);
        }
       
      }
    },
    [value]
  );

  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      setValue(e.target.value);
      //setConversation([{role:'user',content:e.target.value}])
     
    },
    [value]
  );

  const { data: openAiCompletion, error } = useSWR(
    conversation ? [ JSON.stringify(conversation)] : null,
    fetchOpenAiResponse
  );

  useEffect(() => {
    if (openAiCompletion) {
      setCompletion(openAiCompletion);
    }
  }, [ openAiCompletion,conversation]);
 
  return (
    <main className=" p-5 fixed bottom-0 w-full">
      <input
        type="text"
        placeholder="enter your prompt"
        value={value}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        className="w-full px-4 py-2 border border-gray-300 rounded-md"
      />
    </main>
  );
};

export default ChatSession;