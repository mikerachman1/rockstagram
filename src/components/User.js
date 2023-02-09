import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase/FirebaseInit";

import Post from "./Post";

const User = ({ currentUser }) => {
  const { username } = useParams();
  
  const [description, setDescription] = useState("");
  const [avatar, setAvatar] = useState("");
  const [followers, setFollowers] = useState([]);
  const [posts, setPosts] = useState([]);
  
  const [badUser, setBadUser] = useState(false);

  const fetchUserPosts = async () => {
    const postsRef = collection(db, "posts");
    const q = query(postsRef, where("username", "==", `${username}` ));
    const querySnapshot = await getDocs(q);
    const fetchedPosts = [];
    querySnapshot.forEach((doc) => {
      const postObj = { id: doc.id, data: doc.data() };
      fetchedPosts.push(postObj);
    });
    setPosts(fetchedPosts);
  };

  const fetchUserData = async () => {
    const userRef = doc(db, "users", `${username}`);
    const docSnap = await getDoc(userRef);

    if(docSnap.exists()) {
      const userData = docSnap.data();
      setDescription(userData.description);
      setAvatar(userData.avatar);
      setFollowers(userData.followers);
      // console.log(userData);
      fetchUserPosts();
    } else {
      console.log('error user doesnt exist in database');
      setBadUser(true);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [])

  return (
    <div>
      { badUser ? 
        <h1>This user doesn't exist in the database</h1>
      :
        <div>
          { avatar ? 
            <img src={avatar} alt="avatar" />
          :
            <p className="post-avatar">{username.charAt(0)}</p>
          }
          <h1>{username}</h1>
          <h3>{description}</h3>
          <button>Follow</button>
          <h3>{followers.length} Followers</h3>
          <div className='timeline'>
            {posts.map((post) => (
              <Post
                key={post.id}
                postId={post.id}
                currentUser={currentUser}
                username={post.data.username}
                caption={post.data.caption}
                imageUrl={post.data.imageUrl}
                likes={post.data.likes}
              />
            ))}
          </div>
        </div>
      }
    </div>
  );
};

export default User;