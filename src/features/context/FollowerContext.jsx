import React, { createContext, useContext } from "react";
import { auth, firestore } from "@/firebase";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  increment,
} from "firebase/firestore";
import { useAuth } from "./AuthContext";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { user } = useAuth();
  const followUser = async (targetUserId) => {
    const currentRef = doc(firestore, "users", user.uid);
    const targetRef = doc(firestore, "users", targetUserId);

    await updateDoc(currentRef, {
      following: arrayUnion(targetUserId),
      followingCount: increment(1),
    });

    await updateDoc(targetRef, {
      followers: arrayUnion(user.uid),
      followerCount: increment(1),
    });
  };

  const unfollowUser = async (targetUserId) => {
    const currentRef = doc(firestore, "users", user.uid);
    const targetRef = doc(firestore, "users", targetUserId);

    await updateDoc(currentRef, {
      following: arrayRemove(targetUserId),
      followingCount: increment(-1),
    });

    await updateDoc(targetRef, {
      followers: arrayRemove(user.uid),
      followerCount: increment(-1),
    });
  };

  return (
    <UserContext.Provider value={{ user, followUser, unfollowUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
