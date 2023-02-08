import React from "react";
import "../styles/Post.css"
import Comment from "./Comment";
import NewComment from "./NewComment";

const Post = ({ username, caption, imageUrl, postId, currentUser }) => {
  return (
    <div className="post">
      <div className="post-header">
        <p className="post-avatar">{username.charAt(0)}</p>
        <h3>{username}</h3>
      </div>
      <img className="post-image" src={imageUrl} alt="post" />
      <h4 className="post-text">
        <strong>{username}</strong> {caption}
        <div className="comments">
          <Comment postId={postId} />
          { currentUser && 
            <NewComment 
              currentUser={currentUser} 
              postId={postId} 
            /> 
          }
        </div>
      </h4>
    </div>
  );
};

export default Post;