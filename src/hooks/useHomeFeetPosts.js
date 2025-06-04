import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
} from "firebase/firestore";
import { firestore } from "@/firebase";

export const useHomeFeedPosts = (uid) => {
  const [followingUsers, setFollowingUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeed = async () => {
      if (!uid) return;

      setLoading(true);

      try {
        const userDoc = await getDoc(doc(firestore, "users", uid));
        const following = userDoc.data()?.following || [];


        // Fetch following user info
        const userPromises = following.map(async (userId) => {
          const userSnap = await getDoc(doc(firestore, "users", userId));
          return { id: userSnap.id, ...userSnap.data() };
        });

        const users = await Promise.all(userPromises);
        setFollowingUsers(users);

        // Fetch posts from followed users
        const postPromises = following.map(async (userId) => {
          const postsQuery = query(
            collection(firestore, "posts"),
            where("userId", "==", userId)
          );
          const snapshot = await getDocs(postsQuery);
          const userPosts = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          return userPosts;
        });

        const allPostsNested = await Promise.all(postPromises);
        const allPosts = allPostsNested.flat();
        setPosts(allPosts);
      } catch (error) {
        console.error("Error fetching home feed:", error);
      }

      setLoading(false);
    };

    fetchFeed();
  }, [uid]);

  return { followingUsers, posts, loading };
};
