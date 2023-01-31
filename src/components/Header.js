import React from "react";

const Header = ({ user, logout, setOpenSignup, setOpenLogin }) => {

  return (
    <header>
      <div className="header-wrapper">
        <h1>Rockstagram</h1>
        {user ? (
          <div className="header-button-wrapper">
            <h3>{user.displayName}</h3>
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