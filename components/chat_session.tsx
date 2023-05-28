import {
  useState,
  useEffect,
  useCallback,
  Dispatch,
  SetStateAction,
} from "react";
import { MessageType, ConversationType } from "./HomePage";
import useSWR from "swr";

//typedefinations for props required by the comopnent
interface ChatSessionProps {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  conversation: ConversationType ;
  setConversation: Dispatch<SetStateAction<ConversationType>>;
  createNewConversation: () => void;
  generateId:() => string 
}

//fetcher function for SWR
//gets current conversation and sends it as a string to api/openAi and returns the openai completion
const fetchOpenAiResponse = async (conversation: ConversationType) => {
  const conversation_post_req = conversation.map((convo: MessageType) => {
    return {
      role: convo.role,
      content: convo.content,
    };
  });
  const response = await fetch("/api/openAi", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(conversation_post_req),
  });
  const data = await response.json();
  //console.log(data)
  const cleaned_data = {
    id: data.result.id,
    content: data.result.choices[0].message.content,
  };
  console.log(cleaned_data);
  return cleaned_data;
};

const ChatSession: React.FC<ChatSessionProps> = ({
  value,
  setValue,
  conversation,
  setConversation,
  createNewConversation,
  generateId
}) => {
  const [showAnimation, setShowAnimation] = useState<string>("");
  //on enter appends the the current value to the conversation array.
  //re-renders whenever value is updated
  const handleKeyDown = useCallback(
    async (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        //setPrompt(value);
        if (conversation.length == 0) {
          console.log('new convo')
          createNewConversation()
        } else {
          setConversation((prevConvo: ConversationType) => [
            ...prevConvo,
            { id: generateId(), role: "user", content: value },
          ]);
        }
        setValue("");

      }
    },
    [value]
  );

  //updates value based on each keystroke input from the user
  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      setValue(e.target.value);
    },
    [value]
  );

  //fetch the data if conversation is not null and the last message in the conversation is not sent by the system
  const {
    data: openAiCompletion,
    isLoading,
    error,
  } = useSWR(
    conversation.length !=0 && conversation[conversation.length - 1].role != "system"
      ? conversation
      : null,
    fetchOpenAiResponse
  );

  //useffect to handle input gradient animation based on isLoading
  useEffect(() => {
    if (isLoading) {
      setShowAnimation("animate-gradient-x");
    } else {
      setShowAnimation("");
    }
  }, [isLoading]);

  //add message to conversation when ever completeion gets updated
  useEffect(() => {
    if (openAiCompletion) {
      setConversation((prevConvo: ConversationType) => [
        ...prevConvo,
        {
          id: openAiCompletion.id,
          role: "system",
          content: openAiCompletion.content,
        },
      ]);
    }
  }, [openAiCompletion, conversation]);
  
  return (
    <main className=" flex fixed items-center justify-center bottom-0 w-3/4   mb-5 ">
      <input
        type="text"
        placeholder={isLoading ? "Generating response..." : "Enter your prompt"}
        disabled={isLoading ? true : false}
        value={value}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        className={`
        w-full  
        bg-gradient-to-r  
        from-stone-50
        to-slate-400
        via-slate-200
        ${showAnimation}
        placeholder-black
        px-4 py-2 border  
        ml-48 border-black 
        rounded-md 
        text-center 
        focus:border-slate-900  `}
      />
    </main>
  );
};

export default ChatSession;
