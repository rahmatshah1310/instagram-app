import React, { useEffect, useRef, useState } from "react";
import { ICONS } from "@/assets/icons";
import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import { useAuth } from "@/features/context/AuthContext";
import { usePost } from "@/features/context/PostContext";
import {
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { firestore } from "@/firebase";
import { Skeleton } from "@/components/ui/skeleton";
import { PostSkeleton } from "@/components/skeletons/PostSkeleton";

const CommentLikesFooter = ({ post, replyTo, setReplyTo }) => {
  const { user } = useAuth();
  const { addLike, removeLike, addComment } = usePost();
  const inputRef = useRef();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comment, setComment] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);
  const [loadingLikes, setLoadingLikes] = useState(false);

  // <---------------------------------------- Loading if Post is not Available ----------------------------------------->
  if (!post) {
    return <div className="text-white">No Post Available.</div>;
  }

  // <---------------------------------------- Fetch All The Comments ----------------------------------------->
  useEffect(() => {
    if (!post?.id) return;
    setLoadingComments(true);
    const unsubscribe = onSnapshot(
      collection(firestore, "posts", post.id, "comments"),
      (snapshot) => {
        setComment(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        setLoadingComments(false);
      }
    );
    return () => unsubscribe();
  }, [post?.id]);

  useEffect(() => {
    if (replyTo) {
      setCommentText(replyTo);
      inputRef.current.focus();
    }
  }, [replyTo]);

  useEffect(() => {
    if (!post?.id || !user?.uid) return;

    setLoadingLikes(true);
    const postRef = doc(firestore, "posts", post.id);

    const unsubscribe = onSnapshot(postRef, (doc) => {
      if (doc.exists()) {
        const postData = doc.data();
        const likes = postData.likes || [];
        setIsLiked(likes.includes(user.uid));
        setLikeCount(likes.length);
      }
      setLoadingLikes(false);
    });
    return () => unsubscribe();
  }, [!post?.id]);

  // <---------------------------------------- Add and Remove Links to the post ----------------------------------------->
  const handleLike = async () => {
    if (isLiked) {
      await removeLike(post.id, user?.uid);
    } else {
      await addLike(post.id, user?.uid);
    }
    setIsLiked(!isLiked);
  };

  const handleFocusInput = () => {
    inputRef.current.focus();
  };

  // <---------------------------------------- Add Comments ----------------------------------------->
  const handleComment = async () => {
    if (!commentText.trim()) return;
    const commentObject = {
      userId: user?.uid,
      text: commentText,
      createdAt: serverTimestamp(),
      username: user?.username,
      profilePic: user?.profilePic,
    };
    await addComment(post?.id, commentObject);
    setCommentText("");
    setReplyTo("");
  };

  return (
    <div className="bg-black border-t border-gray-700 p-4">
      {/* Actions */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <Button
            onClick={handleLike}
            className={`text-gray-400 ${
              isLiked ? "text-red-500 hover:text-red-600" : ""
            }`}
          >
            {isLiked ? ICONS.heartFilled : ICONS.ciHeart}
          </Button>
          <Button
            onClick={handleFocusInput}
            className="text-gray-400 hover:text-white"
          >
            {ICONS.commentIcon}
          </Button>
          <Button className="text-gray-400 hover:text-white">
            {ICONS.shareIcon}
          </Button>
        </div>
        <Button className="text-gray-400 hover:text-white">
          {ICONS.bookMark}
        </Button>
      </div>

      {/* Like count section - New */}
      <div className="h-4 pl-1">
        {likeCount > 0 ? (
          <p className="font-semibold text-xs  text-white">
            {likeCount} {likeCount === 1 ? "like" : "likes"}
          </p>
        ) : (
          <p className="text-gray-400 text-xs">Be the first to like this</p>
        )}
      </div>

      {/* <---------------------------------------- Input for Adding Comments -----------------------------------------> */}
      <div className="flex items-center gap-3">
        <input
          ref={inputRef}
          type="text"
          placeholder="Add a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className="flex-1 text-white p-2 rounded-lg outline-none"
        />
        <Button
          className="text-blue-500 font-bold"
          onClick={handleComment}
          disabled={!commentText.trim()}
        >
          Post
        </Button>
      </div>
    </div>
  );
};

export default CommentLikesFooter;
