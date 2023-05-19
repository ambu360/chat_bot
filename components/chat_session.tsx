import {
  useState,
  useEffect,
  useCallback,
  Dispatch,
  SetStateAction,
} from "react";
import {nanoid} from 'nanoid'
import { MessageType, ConversationType } from "./HomePage";
import useSWR from "swr";

//typedefinations for props required by the comopnent
interface ChatSessionProps {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  prompt: string;
  setPrompt: Dispatch<SetStateAction<string>>;
  completion: string;
  setCompletion: Dispatch<SetStateAction<string>>;
  conversation: MessageType[] | undefined;
  setConversation: Dispatch<SetStateAction<MessageType[]>>;
}

//fetcher function for SWR
//gets current conversation and sends it as a string to api/openAi and returns the openai completion
const fetchOpenAiResponse = async (conversation: MessageType[]) => {
  
  const conversation_post_req = conversation.map(convo => {
    return {
      role:convo.role,
      content:convo.content
    }
  })
  const response = await fetch("/api/openAi", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(conversation_post_req),
  });
  const data = await response.json();
  //console.log(data)
  const cleaned_data = {id:data.result.id, content:data.result.choices[0].message.content}
  console.log(cleaned_data)
  return cleaned_data;
};

const ChatSession: React.FC<ChatSessionProps> = ({
  value,
  setValue,
  prompt,
  setPrompt,
  completion,
  setCompletion,
  conversation,
  setConversation,
}) => {
  //on enter appends the the current value to the conversation array.
  //re-renders whenever value is updated
  const handleKeyDown = useCallback(
    async (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        //setPrompt(value);
        if (!conversation) {
          setConversation([{ id:nanoid(),role: "user", content: value }]);
        } else {
          setConversation((prevConvo) => [
            ...prevConvo,
            { id:nanoid(),role: "user", content: value },
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
  const { data: openAiCompletion, error } = useSWR(
    conversation && conversation[conversation.length - 1].role != "system"
      ? conversation
      : null,
    fetchOpenAiResponse
  );

  //updates the completeion(openAi message respone) when ever userswr returnsn a response
 /* useEffect(() => {
    if (openAiCompletion) {
      setCompletion(openAiCompletion);
    }
  }, [openAiCompletion, conversation]);
*/
  //add message to conversation when ever completeion gets updated
  useEffect(() => {
    if (openAiCompletion) {

      setConversation((prevConvo) => [
        ...prevConvo,
        { id:openAiCompletion.id,role: "system", content: openAiCompletion.content },
      ]);
      console.log('open ai useeffect')
    }
  }, [openAiCompletion,conversation]);
  return (
    <main className=" flex fixed items-center justify-center bottom-0 w-3/4   mb-5 ">
      <input
        type="text"
        placeholder="enter your prompt"
        value={value}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        className="w-full  px-4 py-2 border  ml-48 border-slate-700 rounded-md text-center focus:border-slate-900  "
      />
    </main>
  );
};

export default ChatSession;
