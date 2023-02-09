import React, { useEffect, useState } from "react";
import "../styles/Post.css"
import Comment from "./Comment";
import NewComment from "./NewComment";
import heart from "./images/heart.svg";
import heartFilled from "./images/heart-filled.svg"
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/FirebaseInit";
import { Link } from "react-router-dom";


const Post = ({ username, caption, imageUrl, postId, currentUser, likes }) => {
  const [likedByUser, setLikedByUser] = useState(false);
  const [likeCount, setLikeCount] = useState(likes.length);

  const likePost = async () => {
    const postRef = doc(db, "posts", `${postId}`);
    await updateDoc(postRef, {
      likes: [...likes, currentUser.displayName]
    });
    setLikedByUser(true);
    setLikeCount(likeCount + 1);
  };

  const unlikePost = async () => {
    const filteredLikes = likes.filter(like => like !== currentUser.displayName);
    const postRef = doc(db, "posts", `${postId}`);
    await updateDoc(postRef, {
      likes: filteredLikes
    });
    setLikedByUser(false);
    setLikeCount(likeCount - 1);
  };

  useEffect(() => {
    if (!currentUser) { return };
    if (likes.includes(`${currentUser.displayName}`)) {setLikedByUser(true)}
    console.log('like check run')
  }, [])

  return (
    <div className="post">
      <div className="post-header">
        <p className="post-avatar">{username.charAt(0)}</p>
        <Link to={`/user/${username}`}>
          <h3>{username}</h3>
        </Link>
      </div>
      <img className="post-image" src={imageUrl} alt="post" />
      { currentUser && 
        <div className="like-container">
          { likedByUser ? 
            <img className="heart" src={heartFilled} alt="heart" onClick={() => unlikePost()} />
          :
            <img className="heart" src={heart} alt="heart" onClick={() => likePost()} />
          }
          { likeCount > 1 && 
            <h4 className="like-count">{likeCount} likes</h4>
          }
        </div>
      }
      <h4 className="post-text">
        <strong>{username}</strong> {caption}
        <Comment postId={postId} />
        { currentUser && 
          <NewComment 
            currentUser={currentUser} 
            postId={postId} 
          /> 
        }
      </h4>
    </div>
  );
};

export default Post;