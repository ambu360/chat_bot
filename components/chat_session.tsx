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
  const response = await fetch("/api/openAi", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(conversation),
  });
  const data = await response.json();
  console.log(data)
  return data.result.choices[0].message.content;
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
          setConversation([{ role: "user", content: value }]);
        } else {
          setConversation((prevConvo) => [
            ...prevConvo,
            { role: "user", content: value },
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
  useEffect(() => {
    if (openAiCompletion) {
      setCompletion(openAiCompletion);
    }
  }, [openAiCompletion, conversation]);

  //add message to conversation when ever completeion gets updated
  useEffect(() => {
    if (openAiCompletion) {
      setConversation((prevConvo) => [
        ...prevConvo,
        { role: "system", content: openAiCompletion },
      ]);
    }
  }, [openAiCompletion]);
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
