/* eslint-disable react-hooks/exhaustive-deps */
import { collection, deleteDoc, doc, getDocs, orderBy, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase/FirebaseInit";

import x from "./images/x.svg"

import NewComment from "./NewComment";

const Comment = ({ postId, currentUser }) => {
  const [comments, setComments] = useState([]);
  const [viewComments, setViewComments] = useState(false);

  const fetchComments = async () => {
    const fetchedComments = [];
    const q = query(collection(db, "posts", `${postId}`, "comments"), orderBy("timestamp"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const commentObj = { id: doc.id, data: doc.data() };
      fetchedComments.push(commentObj);
    });
    setComments(fetchedComments);
  };

  const deleteComment = async (commentId) => {
    const question = "Are you sure you want to delete this comment?";
    // eslint-disable-next-line no-restricted-globals
    const result = confirm(question)
    if (!result) { return };
    await deleteDoc(doc(db, "posts", `${postId}`, "comments", `${commentId}`));
    const filteredComments = comments.filter((comment) => comment.id !== commentId);
    setComments(filteredComments);
  };

  useEffect(() => {
    fetchComments();
  }, [])

  return (
    <div>
      {comments.length > 0 &&
        <div>
          { !viewComments ?
            <div>
              { comments.length === 1 ? 
                <h3 onClick={() => setViewComments(true)} className="view-comments">
                  View {comments.length} comment
                </h3>
              :
                <h3 onClick={() => setViewComments(true)} className="view-comments">
                  View {comments.length} comments
                </h3>
              }
              
            </div>
          :
            <div>
              {viewComments &&
              <div className="comments">
                {comments.map((comment) => (
                  <div className="comment" key={comment.id}>
                    <div>
                      <Link to={`/user/${comment.data.username}`}>
                        <strong>{comment.data.username}</strong>
                      </Link>
                      {comment.data.body}
                    </div>
                    {currentUser &&
                      <div>
                        { comment.data.username === currentUser.displayName &&
                          <img src={x} alt="delete-comment" className="delete-comment" onClick={() => deleteComment(comment.id)}/>
                        }
                      </div>
                    }
                  </div>
                ))}
                <h3 onClick={() => setViewComments(false)} className="close-comments">
                  Close Comments
                </h3>
              </div>
              }
            </div>
          }
        </div>
      }
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

