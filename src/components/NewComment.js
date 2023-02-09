import React, { useState } from "react";
import { db } from "../firebase/FirebaseInit";
import { addDoc, serverTimestamp, collection } from "firebase/firestore";


const NewComment = ({ currentUser, postId }) => {
  const [newComment, setNewComment] = useState('');

  const submitComment = async () => {
    if (newComment === "") { return };
    await addDoc(collection(db, "posts", `${postId}`, "comments"), {
      timestamp: serverTimestamp(),
      username: currentUser.displayName, 
      body: newComment,
    });
    setNewComment('');
    console.log('comment posted to db')
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
      </label>
      <button className="comment-submit" onClick={() => submitComment()}>Post Comment</button>
    </div>
  );
};

export default NewComment;