import React, { useState } from "react";
import Button from "@/components/common/Button";
import InputField from "@/components/common/InputField";
import { Mic, ImageIcon, Smile, Heart, Send } from "lucide-react";

const ChatInput = ({ onSend }) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage("");
    }
  };

  return (
    <div className="px-4 py-3 bg-black">
      <div className="flex items-center w-full bg-gray-800 rounded-full px-4 py-2">
        {/* Smile Icon */}
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-400 hover:text-white"
        >
          <Smile className="h-6 w-6" />
        </Button>

        {/* Input Field */}
        <div className="flex-1 px-2">
          <InputField
            placeholder="Message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full bg-transparent border-none text-white placeholder-gray-400 focus:ring-0 focus:outline-none"
          />
        </div>

        <div className="flex gap-4 pr-4">
          {message.trim() ? (
            <Button
              variant="ghost"
              size="icon"
              className="text-blue-500 hover:text-blue-600"
              onClick={handleSend}
            >
              <Send className="h-6 w-6" />
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-white"
              >
                <Mic className="h-6 w-6" />
              </Button>
              {/* Image Icon */}
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-white"
              >
                <ImageIcon className="h-6 w-6" />
              </Button>
              {/* Heart Icon */}
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-white"
              >
                <Heart className="h-6 w-6" />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
