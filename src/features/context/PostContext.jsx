import React, { createContext, useContext, useState } from "react";
import { firestore } from "@/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  arrayRemove,
  doc,
  updateDoc,
  arrayUnion,
  deleteDoc,
  onSnapshot,
  getDoc,
  increment,
} from "firebase/firestore";
import axios from "axios";
import { useAuth } from "@features/context/AuthContext";

const PostContext = createContext();

export const usePost = () => {
  return useContext(PostContext);
};

export const PostProvider = ({ children }) => {
  const { user, loading } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [error, setError] = useState(null);
  const [caption, setCaption] = useState("");

  const CLOUDINARY_URL = import.meta.env.VITE_CLOUDINARY_URL;

  const addLike = async (postId, userId) => {
    try {
      const postRef = doc(firestore, "posts", postId);
      await updateDoc(postRef, {
        likes: arrayUnion(userId),
        likeCount: increment(1),
      });
    } catch (error) {
      console.error("Error adding like:", error);
      throw error;
    }
  };

  const addLikeForComment = async (postId, commentId, userId) => {
    try {
      const commentRef = doc(firestore, "posts", postId, "comments", commentId);
      await updateDoc(commentRef, {
        likedBy: arrayUnion(userId),
        likeCount: increment(1),
      });
    } catch (error) {
      console.error("Error adding like to comment:", error);
      throw error;
    }
  };

  const removeLikeForComment = async (postId, commentId, userId) => {
    try {
      const commentRef = doc(firestore, "posts", postId, "comments", commentId);
      await updateDoc(commentRef, {
        likedBy: arrayRemove(userId),
        likeCount: increment(-1),
      });
    } catch (error) {
      console.error("Error removing like from comment:", error);
      throw error;
    }
  };

  const removeLike = async (postId, userId) => {
    try {
      const postRef = doc(firestore, "posts", postId);
      await updateDoc(postRef, {
        likes: arrayRemove(userId),
        likeCount: increment(-1),
      });
    } catch (error) {
      console.error("Error removing like:", error);
      throw error;
    }
  };

  const getLikes = async (postId) => {
    try {
      const postRef = doc(firestore, "posts", postId);
      const postDoc = await getDoc(postRef);
      if (postDoc.exists()) {
        return postDoc.data().likes || [];
      }
      return [];
    } catch (error) {
      console.error("Error getting likes:", error);
      throw error;
    }
  };

  const addComment = async (postId, commentObject) => {
    const commentRef = collection(firestore, "posts", postId, "comments");
    await addDoc(commentRef, commentObject);
  };

  const deleteComment = async (postId, commentId) => {
    const commentRef = doc(firestore, "posts", postId, "comments", commentId);
    await deleteDoc(commentRef);
  };

  const deletePost = async (postId) => {
    try {
      await deleteDoc(doc(firestore, "posts", postId));
    } catch (error) {
      console.error("Error deleting post:", error);
      throw error;
    }
  };

  // Upload image to Cloudinary
  const uploadImage = async (file) => {
    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "uploading_image");

      const response = await axios.post(CLOUDINARY_URL, formData);
      const data = response.data;

      if (!data.secure_url) {
        throw new Error(data.error?.message || "Image upload failed");
      }

      // Add post to Firestore
      await addDoc(collection(firestore, "posts"), {
        caption,
        imageUrl: data.secure_url,
        userId: user.uid,
        userAvatar: user.profilePic || "",
        timestamp: serverTimestamp(),
      });

      setUploadedImageUrl(data.secure_url);
    } catch (err) {
      setError(`Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  // Post context value
  const value = {
    uploading,
    uploadedImageUrl,
    error,
    caption,
    setCaption,
    uploadImage,
    addLike,
    addComment,
    removeLike,
    deletePost,
    deleteComment,
    getLikes,
    loading,
    addLikeForComment,
    removeLikeForComment,
  };

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
};
