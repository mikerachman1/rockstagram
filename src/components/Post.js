/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState } from "react";
import "../styles/Post.css"
import Comment from "./Comment";
import NewComment from "./NewComment";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase/FirebaseInit";
import { Link } from "react-router-dom";

import trash from "./images/trash.svg"
import heart from "./images/heart.svg";
import heartFilled from "./images/heart-filled.svg"


const Post = ({ username, caption, imageUrl, postId, currentUser, likes, deletePost, currentUserAvatar }) => {
  const [likedByUser, setLikedByUser] = useState(false);
  const [likeCount, setLikeCount] = useState(likes.length);
  const [avatar, setAvatar] = useState(null);


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

  const fetchAvatar = async () => {
    const userRef = doc(db, "users", `${username}`);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      const userData = docSnap.data();
      if (userData.avatar) { setAvatar(userData.avatar) };
    };
  };

  useEffect(() => {
    fetchAvatar();
    if (!currentUser) { return };
    if (likes.includes(`${currentUser.displayName}`)) {setLikedByUser(true)}
    console.log('like check run')
  }, [currentUserAvatar])

  return (
    <div className="post">
      <div className="post-header">
        <div className="header-name">
          { avatar ?
            <img src={avatar} alt="avatar" className="avatar" />
          :
            <p className="post-avatar">{username.charAt(0)}</p>
          }
          <Link to={`/user/${username}`}>
            <h3>{username}</h3>
          </Link>
        </div>
        { currentUser && 
          <div>
          { username === currentUser.displayName &&
            <img
              src={trash}
              alt="delete-post"
              className="trash"
              onClick={() => deletePost(postId)}
            />
          }
        </div>
      }
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