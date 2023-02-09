import { collection, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase/FirebaseInit";

import '../styles/User.css'

import Post from "./Post";
import EditProfile from "./EditProfile";

const User = ({ currentUser }) => {
  const { username } = useParams(); 
  
  const [description, setDescription] = useState("");
  const [avatar, setAvatar] = useState("");
  const [followers, setFollowers] = useState([]);
  const [followersCount, setFollowersCount] = useState(0);
  const [posts, setPosts] = useState([]);
  
  const [badUser, setBadUser] = useState(false);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [openEditProfile, setOpenEditProfile] = useState(false);

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
      setFollowersCount(userData.followers.length);
      // console.log(userData);
      fetchUserPosts();
    } else {
      console.log('error user doesnt exist in database');
      setBadUser(true);
    }
  };

  const followUser = async () => {
    const userRef = doc(db, "users", `${username}`);
    await updateDoc(userRef, {
      followers: [...followers, currentUser.displayName]
    });
    setFollowers([...followers, currentUser.displayName]);
    setFollowersCount(followersCount + 1);
  };

  const unfollowUser = async () => {
    const filteredFollowers = followers.filter((user) => user !== currentUser.displayName);
    const userRef = doc(db, "users", `${username}`);
    await updateDoc(userRef, {
      followers: filteredFollowers
    });
    setFollowers(filteredFollowers);
    setFollowersCount(followersCount - 1);
  };

  useEffect(() => {
    fetchUserData();
    if (currentUser) {
      if (username === currentUser.displayName) { setIsCurrentUser(true) }
    }
  }, [])

  return (
    <div>
      { openEditProfile && 
        <EditProfile currentUser={currentUser} setOpenEditProfile={setOpenEditProfile}/>
      }
      { badUser ? 
        <h1>This user doesn't exist in the database</h1>
      :
        <div>
          <div className="profile">
            { isCurrentUser && 
              <button onClick={() => setOpenEditProfile(true)}>Edit Profile</button>
            }
            <div className="avatar-and-name">
              { avatar ?
                <img src={avatar} alt="avatar" className="avatar"/>
              :
                <p className="post-avatar">{username.charAt(0)}</p>
              }
              <h1>{username}</h1>
            </div>
            <h3>{description}</h3>
            { currentUser && currentUser.displayName !== username &&
              <div>
                { followers.includes(currentUser.displayName) ?
                  <button onClick={() => unfollowUser()}>Unfollow</button>
                :
                  <button onClick={() => followUser()}>Follow</button>
                }
              </div>
            }
            <h3>{followersCount} Followers</h3>
          </div>             
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