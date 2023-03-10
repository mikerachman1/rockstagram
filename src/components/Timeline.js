import React from "react";
import Post from "./Post";

const Timeline = ({ posts, currentUser, deletePost, currentUserAvatar }) => {

  return (
    <div>
      { !currentUser && 
        <div className='notice'>
          <h3>Log in or Sign up to add, like, and comment on Posts</h3>
        </div>
      }
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
            deletePost={deletePost}
            
            currentUserAvatar={currentUserAvatar}
          />
        ))}
      </div>
    </div>
  );
};

export default Timeline;