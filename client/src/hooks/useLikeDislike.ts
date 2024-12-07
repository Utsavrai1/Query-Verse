import { useState, useEffect } from "react";
import axios from "axios";
import { useAuthStore } from "@/zustand/auth";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const useLikeDislike = (
  initialLikes: number,
  initialDislikes: number,
  disabled: boolean,
  likesArray: string[],
  dislikesArray: string[]
) => {
  const [likes, setLikes] = useState<number>(initialLikes);
  const [dislikes, setDislikes] = useState<number>(initialDislikes);
  const [userLiked, setUserLiked] = useState<boolean>(false);
  const [userDisliked, setUserDisliked] = useState<boolean>(false);
  const token = useAuthStore.getState().token;
  const userId = useAuthStore((state) => state.userId);

  useEffect(() => {
    setUserLiked(likesArray.includes(userId || ""));
    setUserDisliked(dislikesArray.includes(userId || ""));
  }, [likesArray, dislikesArray, userId]);

  const handleLike = async (questionId: string) => {
    if (disabled) return;

    const prevLikes = likes;
    const prevDislikes = dislikes;

    try {
      if (userLiked) {
        setLikes((prev) => prev - 1);
      } else {
        setLikes((prev) => prev + 1);
        if (userDisliked) {
          setDislikes((prev) => prev - 1);
        }
      }
      setUserLiked((prev) => !prev);
      setUserDisliked(false);
      await axios.post(
        `${BACKEND_URL}/api/v1/react/like/${questionId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error: any) {
      setLikes(prevLikes);
      setDislikes(prevDislikes);
      console.error(
        "Error liking question:",
        error.response?.data || error.message
      );
    }
  };

  const handleDislike = async (questionId: string) => {
    if (disabled) return;

    const prevLikes = likes;
    const prevDislikes = dislikes;

    try {
      if (userDisliked) {
        setDislikes((prev) => prev - 1);
      } else {
        setDislikes((prev) => prev + 1);
        if (userLiked) {
          setLikes((prev) => prev - 1);
        }
      }
      setUserDisliked((prev) => !prev);
      setUserLiked(false);

      await axios.post(
        `${BACKEND_URL}/api/v1/react/dislike/${questionId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error: any) {
      setLikes(prevLikes);
      setDislikes(prevDislikes);
      console.error(
        "Error disliking question:",
        error.response?.data || error.message
      );
    }
  };

  return {
    likes,
    dislikes,
    handleLike,
    handleDislike,
    userLiked,
    userDisliked,
  };
};

export default useLikeDislike;
