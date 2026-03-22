import {create} from "zustand";
import { axiosInstance } from "../lib/axios.js"; 
import {toast} from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

const getErrorMessage = (error, fallbackMessage) =>
  error?.response?.data?.message || fallbackMessage;

export const useChatStore = create((set, get) => ({
    allContacts:[],
    chats:[],
    messages:[],
    activeTab:"chats",
    selectedUser:null,
    isUsersLoading:false,
    isMessagesLoading:false,
    isSendingMessage:false,
    contactsError:null,
    chatsError:null,
    setActiveTab:(tab)=>set({activeTab:tab}),
    setSelectedUser:(selectedUser)=>set((state)=>{
        if (!selectedUser) {
          return {
            selectedUser: null,
            messages: [],
            isMessagesLoading: false,
          };
        }

        if (state.selectedUser?._id === selectedUser._id) {
          return state;
        }

        return {
          selectedUser,
          messages: [],
          isMessagesLoading: true,
        };
    }),
    getAllContacts:async()=>{
        set({isUsersLoading:true, contactsError:null});
        try{
        const response = await axiosInstance.get("/messages/contacts") ; 
        set({allContacts:response.data});
        }
        catch(error){
         const message = getErrorMessage(error, "Failed to load contacts");
         set({contactsError:message, allContacts:[]});
         toast.error(message);
        }
        finally{
          set({isUsersLoading:false});
        }  
    },
    getMyChatPartners:async()=>{
        set({isUsersLoading:true, chatsError:null});
        try{
            const response = await axiosInstance.get("/messages/chats") ; 
            set({chats:response.data});
        }
        catch(error){
            const message = getErrorMessage(error, "Failed to load chats");
            set({chatsError:message, chats:[]});
            toast.error(message);
        }
        finally{
            set({isUsersLoading:false});
        }
    } ,
     getMessagesByUserId:async(id)=>{
        set({isMessagesLoading:true});
       try{
        const response = await axiosInstance.get(`/messages/${id}`);
        set((state) => {
          if (state.selectedUser?._id !== id) {
            return state;
          }

          return {messages:response.data};
        });
       }
     catch(error){
         toast.error(getErrorMessage(error, "Failed to load messages"));
        }
       finally{
        set({isMessagesLoading:false});
       }
     },
     subscribeToMessages: () => {
      const socket = useAuthStore.getState().socket;

      if (!socket) return;

      socket.off("newMessage");
      socket.on("newMessage", (newMessage) => {
        const { selectedUser, messages } = get();

        if (!selectedUser) return;

        const isActiveConversation =
          String(newMessage.senderId) === String(selectedUser._id) ||
          String(newMessage.receiverId) === String(selectedUser._id);

        if (!isActiveConversation) return;
        if (messages.some((message) => message._id === newMessage._id)) return;

        set({ messages: [...messages, newMessage] });
      });
     },
     unsubscribeFromMessages: () => {
      const socket = useAuthStore.getState().socket;
      socket?.off("newMessage");
     },
     sendMessage: async (messageData) => {
    const { selectedUser } = useChatStore.getState();
    const { authUser } = useAuthStore.getState();

    if (!selectedUser || !authUser) {
      toast.error("Select a chat before sending a message");
      return false;
    }

    const tempId = `temp-${Date.now()}`;

    const optimisticMessage = {
      _id: tempId,
      senderId: authUser._id,
      receiverId: selectedUser._id,
      text: messageData.text,
      image: messageData.imagePreview ? { url: messageData.imagePreview } : null,
      createdAt: new Date().toISOString(),
      isOptimistic: true,
    };
    set((state) => ({ messages: [...state.messages, optimisticMessage] }));
    set({ isSendingMessage: true });

    try {
      const formData = new FormData();
      const trimmedText = messageData.text?.trim();

      if (trimmedText) {
        formData.append("text", trimmedText);
      }

      if (messageData.imageFile) {
        formData.append("image", messageData.imageFile);
      }

      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      set((state) => ({
        messages: state.messages.map((message) =>
          message._id === tempId ? res.data : message
        ),
      }));
      return true;
    } catch (error) {
      set((state) => ({
        messages: state.messages.filter((message) => message._id !== tempId),
      }));
      toast.error(getErrorMessage(error, "Something went wrong"));
      return false;
    } finally {
      set({ isSendingMessage: false });
    }
  },

}));
