const emailMessage = (email) => {
  return `The email: ${email} is already registered to a user, please try a different email.`;
};

const usernameMessage = (username) => {
  return `The username: ${username} is already registered to a user, please try a different email.`;
};

const passwordMessage = `Your passwords don't match! Please try again.`;

const originalUserCheck = (email, username, password, confirmPassword) => {
  if (password !== confirmPassword) { return passwordMessage };
  //query db for email and username if exists return messages
};

export { emailMessage, usernameMessage, passwordMessage };