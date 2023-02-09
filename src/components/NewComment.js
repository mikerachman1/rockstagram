import React, { useState } from "react";
import { db } from "../firebase/FirebaseInit";
import { addDoc, serverTimestamp, collection } from "firebase/firestore";


const NewComment = ({ currentUser, postId }) => {
  const [newComment, setNewComment] = useState('');
  const [showForm, setShowForm] = useState(false);

  const submitComment = async () => {
    if (newComment === "") { return };
    await addDoc(collection(db, "posts", `${postId}`, "comments"), {
      timestamp: serverTimestamp(),
      username: currentUser.displayName, 
      body: newComment,
    });
    setNewComment('');
    setShowForm(false);
    console.log('comment posted to db')
  };

  return (
    <div>
      { showForm ? 
        <div className="comment-form">
          <label htmlFor="comment"></label>
          <input
            type="text"
            name="comment"
            id="comment"
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button className="comment-submit" onClick={() => submitComment()}>Post Comment</button>
        </div>
      :
        <button className="comment-form" onClick={() => setShowForm(true)}>Add Comment</button>
      }
    </div>
  );
};

export default NewComment;