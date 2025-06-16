import React from "react";
import { User, Search } from "lucide-react";

const ConversationItem = ({ conversations, selectedChat, setSelectedChat }) => {
  return (
    <div className="w-80 border-r border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Messages</h2>
          <button className="p-2 hover:bg-gray-800 rounded-full transition-colors">
            <Search className="h-5 w-5" />
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search messages"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex-1">
        {conversations?.map((conversation) => (
          <div
            key={conversation.id}
            onClick={() => setSelectedChat(conversation.id)}
            className={`p-4 hover:bg-gray-800 cursor-pointer transition-colors ${
              selectedChat === conversation.id ? "bg-gray-800" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div
                  className={`w-12 h-12 rounded-full ${conversation.avatar} flex items-center justify-center`}
                >
                  <User className="h-6 w-6" />
                </div>
                {conversation.online && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-black rounded-full" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-medium truncate">
                    {conversation.name}
                  </span>
                  <span className="text-xs text-gray-400">
                    {conversation.time}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-400 truncate">
                    {conversation.lastMessage}
                  </p>
                  {conversation.unread > 0 && (
                    <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold">
                        {conversation.unread}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConversationItem;
