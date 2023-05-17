import { useState, useEffect } from "react";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import ChatSession from "./chat_session";
import ConversationList from './conversationList'

export interface MessageType {
  id:string
  role: string;
  content: string;
}
export interface ConversationType {
  messages: MessageType[];
}
export default function HomePage({ session }) {
  const supabase = useSupabaseClient();
  const user = useUser();
  const [username, SetUsername] = useState();
  const [loading, setLoading] = useState(false);
  const [showIntroModal,SetShowIntroModal] = useState<boolean>(true)
  const [value, setValue] = useState<string>("");
  const [prompt, setPrompt] = useState<string>("");
  const [completion, setCompletion] = useState<string>("");
  const [conversation, setConversation] = useState<MessageType[]>();
  useEffect(() => {
    getUserProfile();
  });

  async function getUserProfile() {
    try {
      setLoading(true);

      let { data, error, status } = await supabase
        .from("profiles")
        .select("username, website,avatar_url")
        .eq("id", user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }
      if (data) {
        SetUsername(data.username);
      }
    } catch (error) {
      console.log(error);
    }
  }
  //add 
  return (
    <main className="flex justify-center items-center">
      {!conversation && 
      <div className="flex justify-center flex-col items-center p-5 ">
        <div className="">
          <h1>CHAT BOT</h1>
        </div>
        <h3>{username}</h3>
        <button onClick={() => supabase.auth.signOut()}>Sign Out</button>
      </div>}
      {conversation && <ConversationList 
          conversation = {conversation}
        />}
      <ChatSession
        value={value}
        setValue={setValue}
        prompt={prompt}
        setPrompt={setPrompt}
        completion={completion}
        setCompletion={setCompletion}
        conversation={conversation}
        setConversation={setConversation}
      />
     
    </main>
  );
}
