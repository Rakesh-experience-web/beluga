import { XIcon } from 'lucide-react'
import React from 'react'
import { useEffect } from 'react'
import { useChatStore } from '../store/useChatStore';
import { getMediaUrl } from "../lib/media";
const ChatHeader = () => {
    const {selectedUser, setSelectedUser} = useChatStore() ;
    
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") setSelectedUser(null);
    };

    window.addEventListener("keydown", handleEscKey);

    // cleanup function
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [setSelectedUser]);

  if (!selectedUser) {
    return null;
  }

  return (
     <div
      className="flex justify-between items-center bg-slate-800/50 border-b
   border-slate-700/50 max-h-[84px] px-6 flex-1"
    >
      <div>
          <img src={getMediaUrl(selectedUser.profilePic) || "/avatar.png"} alt={selectedUser.fullName} className="size-12 rounded-full" />
          <h3 className="text-slate-200 font-medium">{selectedUser.fullName}</h3>
      </div>
      <div>
          <XIcon className="cursor-pointer" onClick={() => setSelectedUser(null)} />
      </div>
    </div>
  )
}

export default ChatHeader;
