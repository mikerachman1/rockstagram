/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Link } from "react-router-dom";

const Header = ({ user, logout, setOpenSignup, setOpenLogin, setOpenNewPost, currentUserAvatar }) => {
  return (
    <header>
      <div className="header-wrapper">
        <Link to="/">
          <h1>Rockstagram</h1>
        </Link>
        {user ? (
          <div className="header-button-wrapper">
            <button onClick={() => setOpenNewPost(true)}>Add Post</button>
            { user.displayName &&
              <div className="header-user-container">
                { currentUserAvatar ? 
                  <img src={currentUserAvatar} alt="avatar" className="avatar" />
                :
                  <p className="post-avatar">{user.displayName.charAt(0)}</p>
                }
                <Link to={`/user/${user.displayName}`}>
                  <h3>{user.displayName}</h3>
                </Link>
              </div>}
            <button onClick={() => logout()}>Logout</button>
          </div>
        ) : (
          <div className="header-button-wrapper">
            <button onClick={() => setOpenLogin(true) || setOpenSignup(false)}>
              Log in
            </button>
            <button onClick={() => setOpenSignup(true) || setOpenLogin(false)}>
              Sign up
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;