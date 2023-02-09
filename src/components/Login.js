import React from "react";

const Login = ({ setOpenLogin, email, setEmail, password, setPassword, login }) => {
  return (
    <div>
      <div className="overlay" onClick={() => setOpenLogin(false)}></div>
      <div className="popup">
        <center>
          <h1>Rockstagram</h1>
        </center>
        <form className='app-form'>
          <label htmlFor="email">
            <input
              id="email"
              placeholder='Email'
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label htmlFor="password">
            <input
              id="password"
              placeholder='Password'
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <button type='submit' onClick={(e) => login(e)}>Log in</button>
        </form>
      </div>
    </div>
  );
};

export default Login;