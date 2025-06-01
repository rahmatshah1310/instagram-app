import { useState, useEffect } from 'react';
import { useAuth } from '@features/context/AuthContext';

export const useFollow = (targetUserId) => {
  const { user, followUser, unfollowUser } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user && targetUserId) {
      setIsFollowing(user.following?.includes(targetUserId));
    }
  }, [user, targetUserId]);

  const handleFollow = async () => {
    if (!user || !targetUserId) return;
    
    setIsLoading(true);
    try {
      if (isFollowing) {
        await unfollowUser(targetUserId);
      } else {
        await followUser(targetUserId);
      }
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('Error toggling follow:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isFollowing,
    isLoading,
    handleFollow
  };
};