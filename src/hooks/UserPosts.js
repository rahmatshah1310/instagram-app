// <--------------------------- Post Related Hooks ------------------------------>
// src/hooks/useUserPosts.js
import { useEffect, useState } from "react";
import { fetchUserPosts } from "@/services/postService";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { firestore } from "@/firebase";

export const UserPosts = (userId) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getPosts = async () => {
      try {
        if (userId) {
          const userPosts = await fetchUserPosts(userId);
          setPosts(userPosts);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getPosts();
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    const postsRef = collection(firestore, 'posts');
    const q = query(postsRef, where('userId', '==', userId));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        likes: doc.data().likes || [],
        likeCount: (doc.data().likes || []).length
      }));
      setPosts(postsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  return { posts, loading, error };
};
