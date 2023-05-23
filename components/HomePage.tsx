import { useState, useEffect, useCallback } from "react";
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
export type ConversationListType = { id: string, title: string, conversation: ConversationType[] };

export default function HomePage({ session }) {
  const supabase = useSupabaseClient();
  const user = useUser();
  const [username, SetUsername] = useState();

  //const [showIntroModal, SetShowIntroModal] = useState<boolean>(true);
  const [value, setValue] = useState<string>("");
  const [conversation, setConversation] = useState<ConversationType>();
  const [conversationsList, setConversationsList] = useState<ConversationListType[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string>('')
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

  //update conversationsationList
  useEffect(() => {
    if (currentConversationId) {
      updateConversationsList(currentConversationId);
    }
  }, [conversation, currentConversationId]);
  //add current conversation to conversationList
  const updateConversationsList = useCallback((id: string) => {
    console.log('update ran')
    console.log('conversation')
    if (conversation) {
      if (conversationsList.length === 0) {
        setConversationsList([{ id: id, title: `New chat`, conversation: conversation }])
      } else {
        const updatedConversations = conversationsList.map((prevConvo: ConversationListType) => {
          if (prevConvo.id === id) {
            return { ...prevConvo, conversation: conversation }
          } else {
            return { ...prevConvo }
          }
        }) as ConversationListType[];
        if (!updatedConversations.find((prevConvo) => prevConvo.id === id)) {
          updatedConversations.push({ id: id, title: `New chat`, conversation: conversation });
        }
        setConversationsList(updatedConversations);
      }
    }
  }, [conversation, currentConversationId, conversationsList])
  // to create conversation
  const createNewConversation = () => {
    if (!conversation) {
      const newConvoId = nanoid()
      setConversation([{ id: nanoid(), role: 'user', content: value }])
      setCurrentConversationId(newConvoId)
    }
  }

  //set converation to undefined allowing new item to be added to conversationList
  const handleNewChat = () => {
    setConversation(undefined)
  }

  //sidebar conversationlist handle to set current conversation based on respective button
  const handleConversationChange = (id: string) => {
    conversationsList.map((prevConvo: ConversationListType) => prevConvo.id === id ? setConversation(prevConvo.conversation) : null)
    setCurrentConversationId(id)
  }

  const handleSignOut = () => {
    supabase.auth.signOut();
  };

  return (
    <main className="flex justify-center ">
      <Sidebar
        conversationsList={conversationsList}
        handleNewChat={handleNewChat}
        handleSignOut={handleSignOut}
        handleConversationChange={handleConversationChange}
        currentConversationId={currentConversationId}
      />
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
        createNewConversation={createNewConversation}
      />
    </main>
  );
}
