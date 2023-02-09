import React from "react";

const Signup = ({ setOpenSignup,
                  username,
                  setUsername,
                  email,
                  setEmail,
                  password,
                  setPassword,
                  signUp
                }) => {
  return (
    <div>
      <div className="overlay" onClick={() => setOpenSignup(false)}></div>
      <div className="popup">
        <center>
          <h1>Rockstagram</h1>
        </center>
        <form className='app-form'>
          <label htmlFor="username"></label>
          <input
            id="username"
            placeholder='Username'
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label htmlFor="email"></label>
          <input
            id="email"
            placeholder='Email'
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="password"></label>
          <input
            id=""
            placeholder='Password'
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type='submit' onClick={(e) => signUp(e)}>Sign up</button>
        </form>
      </div>
    </div>
  );
};

export default Signup;