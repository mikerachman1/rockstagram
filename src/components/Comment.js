import React, { useState } from "react";

const Comment = ({ postId }) => {
  const [comments, setComments] = useState([]);

  const fetchComments = () => {

  };

  return (
    <div className="comments">
      {comments.map((comment) => (
        <div className="comment" key={comment.id}>
          <strong>{comment.data.username}</strong> {comment.data.body}
        </div>
      ))}
    </div>
  );
};

export default Comment;

