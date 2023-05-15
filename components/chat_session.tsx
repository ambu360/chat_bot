import { 
  useState,
  useEffect,
  useCallback,
  Dispatch,
  SetStateAction
   } from "react";
import { MessageType,ConversationType } from "./HomePage";

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
  const [message,setMessage] = useState<MessageType>({role:'',content:''})
  const handleKeyDown = useCallback(
    async (e: React.KeyboardEvent<HTMLInputElement>) => {
    
      if (e.key === "Enter") {
        //setPrompt(value);
        if(!conversation){
          setConversation([{role:'user',content:value}])
        }else{
          setConversation((prevConvo)=>([...prevConvo,{role:'user',content:value}]))
        }
        /*
        if(conversation==[]){
          setConversation([message])
        }else{
            setConversation(prevConvo =>([...prevConvo,message]));
        }
       */
       if(conversation){
        console.log(conversation)
         const response = await fetch('/api/openAi',{
           method:'POST',
           headers:{
             'content-type':'application/json'
           },
           body: JSON.stringify(conversation)
         })
         const data = await response.json()
      
         setValue('')
         setCompletion(data.result.choices[0].message.content)
       }
      }
    },
    [value,message]
  );

  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      setValue(e.target.value);
      //setConversation([{role:'user',content:e.target.value}])
     
    },
    []
  );

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