/* eslint-disable react-hooks/exhaustive-deps */
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase/FirebaseInit";

import NewComment from "./NewComment";

const Comment = ({ postId, currentUser }) => {
  const [comments, setComments] = useState([]);

  const fetchComments = async () => {
    const fetchedComments = [];
    const q = query(collection(db, "posts", `${postId}`, "comments"), orderBy("timestamp"));
    const querySnapshot = await getDocs(q);
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
    <div>
      <div className="comments">
        {comments.map((comment) => (
          <div className="comment" key={comment.id}>
            <Link to={`/user/${comment.data.username}`}>
              <strong>{comment.data.username}</strong>
            </Link>
            {comment.data.body}
          </div>
        ))}
      </div>
      { currentUser &&
            <NewComment
              currentUser={currentUser}
              postId={postId}
              comments={comments}
              setComments={setComments}
            />
          }
    </div>
  );
};

export default Comment;

