import React, { useState } from "react";

const NewComment = ({ currentUser, postId }) => {
  const [newComment, setNewComment] = useState('');

  const submitComment = () => {
    // post newComment to database as dependent of postId
  };

  return (
    <div className="comment-form">
      <label htmlFor="comment">
        <input
          type="text"
          name="comment"
          id="comment"
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button onClick={() => submitComment()}>Post Comment</button>
      </label>
    </div>
  );
};

export default NewComment;