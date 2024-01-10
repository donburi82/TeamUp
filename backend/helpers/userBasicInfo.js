const isStrongPassword = (password) => {
  const strongPasswordRegex =
    /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*]{8,16}$/;
  const isStrong = strongPasswordRegex.test(password);
  return isStrong;
};

module.exports = { isStrongPassword };
