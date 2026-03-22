import {useState}from 'react'
import  {useChatStore} from "../store/useChatStore" ;
import { useRef } from 'react';
import { ImageIcon, SendIcon, XIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';
const MessageInput = () => {
   const {sendMessage, isSendingMessage} = useChatStore() ;
   const [text, setText] = useState("");
   const fileInputRef = useRef(null) ;
   const[imagePreview, setImagePreview] = useState(null) ;
   const [imageFile, setImageFile] = useState(null);
   const handleSendMessage = async (e)=>{
    e.preventDefault();
    if(!text.trim() && !imagePreview)return ;
    const message={
          text,
          imageFile,
          imagePreview,
    };
    const sent = await sendMessage(message);
    if (sent) {
      setText("");
      setImagePreview(null);
      setImageFile(null);
      if(fileInputRef.current) fileInputRef.current.value = null ;
    }
   }
   
   const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
    };
    const handleRemoveImage = () => {
        setImagePreview(null);
        setImageFile(null);
        if(fileInputRef.current) fileInputRef.current.value = null ;
    }
  
  return (
    <div className="p-4 border-t border-slate-700/50">
      {imagePreview && (
        <div className="max-w-3xl mx-auto mb-3 flex items-center">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-slate-700"
            />
            <button
              onClick={handleRemoveImage}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-slate-200 hover:bg-slate-700"
              type="button"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto flex space-x-4">
        <input
          type="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
          }}
          className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-lg py-2 px-4"
          placeholder="Type your message..."
        />

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isSendingMessage}
          className={`bg-slate-800/50 text-slate-400 hover:text-slate-200 rounded-lg px-4 transition-colors ${
            imagePreview ? "text-cyan-500" : ""
          }`}
        >
          <ImageIcon className="w-5 h-5" />
        </button>
        <button
          type="submit"
          disabled={(!text.trim() && !imagePreview) || isSendingMessage}
          className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-lg px-4 py-2 font-medium hover:from-cyan-600 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <SendIcon className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}

export default MessageInput;
