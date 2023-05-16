import { MessageType } from "./HomePage";
import {AiOutlineUser} from 'react-icons/ai'
import {BiBot} from 'react-icons/bi'
import ReactMarkdown from 'react-markdown';
import {useRef,useEffect,RefObject} from 'react'

interface ConversationListTypes {
    conversation:MessageType[]
}
const ConversationList:React.FC<ConversationListTypes> = ({conversation})=>{
    const divRef:RefObject<HTMLDivElement | null> = useRef(null);
    useEffect(() => {
        divRef.current?.scrollIntoView({ behavior: 'smooth' });
      });
    
    return (
        <main className = 'flex flex-col justify-center items-center w-screen'>
            {conversation.map((message:MessageType)=>{
                const bg = message.role ==='user'?'bg-stone-50':'bg-stone-200'
                
                return (
                    <div ref = {divRef} key={message.content} className={`grid grid-cols-4 items-center w-screen justify-center p-5  ${bg}`} >
                        <p className="text-xl col-span-1 self-start justify-self-end m-2">{message.role === 'user'?<AiOutlineUser/>:<BiBot/>} </p>
                        <ReactMarkdown  className="text-lg col-span-3 m-2 w-3/4">{message.content}</ReactMarkdown>
                       
                    </div>
                )
                
            })}
        </main>
    )
}

export default ConversationList;