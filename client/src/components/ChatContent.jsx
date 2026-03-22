import ChatHeader from './ChatHeader';
import { useEffect, useRef } from 'react';
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';
import NoChatHistoryPlaceholder from './NoChatHistoryPlaceholder';
import { getMediaUrl } from "../lib/media";
import MessageInput from './MessageInput';
const ChatContent = () => {
  const {
    selectedUser,
    getMessagesByUserId,
    subscribeToMessages,
    unsubscribeFromMessages,
    messages,
    isMessagesLoading,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(()=>{
     if(selectedUser) {
      getMessagesByUserId(selectedUser._id);
      subscribeToMessages();
     }

     return () => {
      unsubscribeFromMessages();
     };
  },[selectedUser, getMessagesByUserId, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!selectedUser) {
    return null;
  }

  return (
    <>
    <ChatHeader/>
      <div className="flex-1 px-6 overflow-y-auto py-8">
        {isMessagesLoading ? (
          <div className="max-w-3xl mx-auto text-sm text-slate-400">Loading messages...</div>
        ) : messages.length > 0 ? (
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`chat ${String(msg.senderId) === String(authUser?._id) ? "chat-end" : "chat-start"}`}
              >
                <div
                  className={`chat-bubble relative ${
                    String(msg.senderId) === String(authUser?._id)
                      ? "bg-cyan-600 text-white"
                      : "bg-slate-800 text-slate-200"
                  }`}
                >
                  {msg.image && (
                    <img src={getMediaUrl(msg.image.url)} alt="Shared" className="rounded-lg h-48 object-cover" />
                  )}
                  {msg.text && <p className="mt-2">{msg.text}</p>}
                  <p className="text-xs mt-1 opacity-75 flex items-center gap-1">
                    {new Date(msg.createdAt).toLocaleTimeString(undefined, {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messageEndRef} />
          </div>
        ) : (
          <NoChatHistoryPlaceholder name={selectedUser.fullName} />
        )}
      </div>
      <MessageInput/>
    </>
  )
}

export default ChatContent
