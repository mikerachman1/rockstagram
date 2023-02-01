import React from "react";

const Header = ({ user, logout, setOpenSignup, setOpenLogin }) => {

  return (
    <header>
      <div className="header-wrapper">
        <h1>Rockstagram</h1>
        {user ? (
          <div className="header-button-wrapper">
            <div className="header-user-container">
              <p className="post-avatar">{user.displayName.charAt(0)}</p>
              <h3>{user.displayName}</h3>
            </div>
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