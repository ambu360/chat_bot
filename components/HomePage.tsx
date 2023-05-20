import { useState, useEffect } from "react";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import ChatSession from "./chat_session";
import ConversationList from "./conversationList";
import Sidebar from "@/components/sidebar";
import { nanoid } from "nanoid";

export interface MessageType {
  id: string;
  role: string;
  content: string;
}

export type ConversationType = MessageType[];
export type ConversationListType = ConversationType[];

export default function HomePage({ session }) {
  const supabase = useSupabaseClient();
  const user = useUser();
  const [username, SetUsername] = useState();

  //const [showIntroModal, SetShowIntroModal] = useState<boolean>(true);
  const [value, setValue] = useState<string>("");
  const [conversation, setConversation] = useState<ConversationType>();
  const [conversationsList, setConversationsList] = useState([]);
  useEffect(() => {
    getUserProfile();
  });

  async function getUserProfile() {
    try {
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
  const handleSignOut = () => {
    supabase.auth.signOut();
  };
  
  return (
    <main className="flex justify-center ">
      <Sidebar handleSignOut={handleSignOut} />
      {!conversation && (
        <div className="flex justify-center flex-col items-center pt-5 pb-5 w-full">
          <div className="">
            <h1>CHAT BOT</h1>
          </div>
          <h3>{username}</h3>
          <button onClick={handleSignOut}>Sign Out</button>
        </div>
      )}
      {conversation && <ConversationList conversation={conversation} />}
      <ChatSession
        value={value}
        setValue={setValue}
        conversation={conversation}
        setConversation={setConversation}
      />
    </main>
  );
}
