/* eslint-disable react-hooks/exhaustive-deps */
import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase/FirebaseInit";

const Comment = ({ postId }) => {
  const [comments, setComments] = useState([]);

  const fetchComments = async () => {
    const fetchedComments = [];
    const querySnapshot = await getDocs(collection(db, "posts", `${postId}`, "comments"));
    querySnapshot.forEach((doc) => {
      const commentObj = { id: doc.id, data: doc.data() };
      fetchedComments.push(commentObj);
    });
    setComments(fetchedComments);
    console.log('Comments FETCHED')
  };

  useEffect(() => {
    fetchComments();
    console.log('Comments MOUNTED')
  }, [])

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

