import React from 'react'
import { useChatStore } from '../store/useChatStore';
import ActiveTabSwitch from '../components/ActiveTabSwitch';
import BorderAnimated from '../components/BorderAnimated';
import ProfileHeader from '../components/ProfileHeader';
import ChatList from '../components/ChatList';
import ContactList from '../components/ContactList';
import NoConversationSelected from '../components/NoConversationSelected';
import ChatContent from '../components/ChatContent';
const  ChatPage = () => {
  const {activeTab, selectedUser} = useChatStore() ;
  return (
       <div className="relative w-full max-w-6xl md:h-[90-vh] h-[90vh]">
      <BorderAnimated>
        {/* LEFT SIDE */}
        <div className="w-80 bg-slate-800/50 backdrop-blur-sm flex flex-col">
          <ProfileHeader />
          <ActiveTabSwitch />

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {activeTab === "chats" ? <ChatList /> : <ContactList />}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex-1 flex flex-col bg-slate-900/50 backdrop-blur-sm">
          {selectedUser ? <ChatContent /> : <NoConversationSelected/>}
        </div>
      </BorderAnimated>
    </div>
  )
}

export default  ChatPage;
