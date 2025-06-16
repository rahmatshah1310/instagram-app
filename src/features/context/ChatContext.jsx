// filepath: e:\Instagram\src\context\ChatContext.jsx
import React, { createContext, useState, useEffect, useRef, useContext } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, doc, updateDoc, getDocs, serverTimestamp } from "firebase/firestore";
import { firestore } from "@/firebase";
import { formatTime } from "@/services/formateTime";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const messagesEndRef = useRef(null);
  const currentUserId = 'user1'; // Should come from auth system

  useEffect(() => {
    const q = query(collection(firestore, 'conversations'), orderBy('lastMessage.timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          user: {
            id: data.participants.find(id => id !== currentUserId),
            name: data.user?.name || 'Unknown',
            avatar: data.user?.avatar || 'https://via.placeholder.com/40',
            isOnline: data.user?.isOnline || false
          },
          unreadCount: data.unread?.[currentUserId] || 0
        };
      });
      setConversations(fetched);
      setIsLoadingConversations(false);
    });
    return () => unsubscribe();
  }, [currentUserId]);

  // Fetch messages and mark as read on open
  useEffect(() => {
    if (activeConversation?.id) {
      setIsLoadingMessages(true);
      const q = query(collection(firestore, 'conversations', activeConversation.id, 'messages'), orderBy('timestamp', 'asc'));
      const unsubscribe = onSnapshot(q, async (snapshot) => {
        const fetchedMessages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMessages(fetchedMessages);
        setIsLoadingMessages(false);
        await markMessagesAsRead(activeConversation.id);
      });
      return () => unsubscribe();
    } else {
      setMessages([]);
    }
  }, [activeConversation]);

  // Scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    if (!text.trim() || !activeConversation) return;
    const timestamp = new Date();

    const messageData = {
      text,
      senderId: currentUserId,
      timestamp,
      type: 'text'
    };

    const messagesRef = collection(firestore, 'conversations', activeConversation.id, 'messages');
    await addDoc(messagesRef, messageData);

    const conversationRef = doc(firestore, 'conversations', activeConversation.id);
    const updatedUnread = { ...activeConversation.unread };

    activeConversation.participants.forEach(id => {
      if (id !== currentUserId) {
        updatedUnread[id] = (updatedUnread[id] || 0) + 1;
      }
    });

    await updateDoc(conversationRef, {
      lastMessage: messageData,
      unread: updatedUnread
    });
  };

  const markMessagesAsRead = async (conversationId) => {
    if (!conversationId) return;
    const conversationRef = doc(firestore, 'conversations', conversationId);
    try {
      const conv = conversations.find(c => c.id === conversationId);
      if (conv?.unread?.[currentUserId] > 0) {
        await updateDoc(conversationRef, {
          [`unread.${currentUserId}`]: 0,
          [`lastSeen.${currentUserId}`]: serverTimestamp()
        });
      }
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

 

  const contextValue = {
    conversations,
    activeConversation,
    setActiveConversation,
    messages,
    sendMessage,
    currentUserId,
    isLoadingConversations,
    isLoadingMessages,
    messagesEndRef,
    formatTime
  };

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);