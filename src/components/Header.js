import React from "react";

const Header = ({ user, signOut, setOpenSignup, setOpenLogin }) => {

  return (
    <header>
      <div className="header-wrapper">
        <h1>Rockstagram</h1>
        {user ? (
          <button onClick={() => signOut}>Logout</button>
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