import React from "react";

const Header = () => {

  return (
    <header>
      <div className="header-wrapper">
        <h1>Rockstagram</h1>
        <button>Logout</button>
        <button>Log in</button>
        <button>Sign up</button>
      </div>
    </header>
  );
}

export default Header;