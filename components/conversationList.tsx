import { MessageType } from "./HomePage";

interface ConversationListTypes {
    coversation:MessageType[]
}
const ConversationList:React.FC<ConversationListTypes> = ({coversation})=>{

    return (
        <main className = 'flex flex-col justify-center items-center '>
            {coversation.map((message:MessageType)=>{
                return (
                    <div className=''>
                        <p>{message.content}</p>
                    </div>
                )
                
            })}
        </main>
    )
}

export default ConversationList;