import { MessageType, ConversationType } from "./HomePage";
import { AiOutlineUser } from "react-icons/ai";
import { BiBot } from "react-icons/bi";
import ReactMarkdown from "react-markdown";
import { useRef, useEffect, RefObject } from "react";

interface ConversationListTypes {
  conversation: ConversationType;
}
const ConversationList: React.FC<ConversationListTypes> = ({
  conversation,
}) => {
  const divRef: RefObject<HTMLDivElement> = useRef(null);
  useEffect(() => {
    divRef.current?.scrollIntoView({ behavior: "smooth" });
  });

  return (
    <main className="flex flex-col justify-center items-center w-full h-fit mb-14 mt-2.5">
      {conversation.map((message: MessageType) => {
        const bg = message.role === "user" ? "bg-stone-50" : "bg-stone-200";

        return (
          <div
            ref={divRef}
            key={message.id}
            className={`grid grid-cols-4 items-center w-full justify-center p-5  ${bg}`}
          >
            <p className="text-xl col-span-1 self-start justify-self-end decoration-slate-700 text-3xl m-2">
              {message.role === "user" ? <AiOutlineUser /> : <BiBot />}
            </p>

            <ReactMarkdown className="text-lg col-span-3 m-2 w-3/4">
              {message.content}
            </ReactMarkdown>
          </div>
        );
      })}
    </main>
  );
};

export default ConversationList;
