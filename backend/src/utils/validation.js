const validator = require("validator");

const validateSignUpData = (data) => {
  const { firstName, lastName, emailId, password } = data;

  if (!firstName || !lastName) {
    throw new Error("Name is not valid");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong password");
  }
};

const validateEditProfileData = (data) => {
  const allowedEditFields = [
    "age",
    "firstName",
    "lastName",
    "gender",
    "photoURL",
    "age",
    "skills",
  ];
  const isEditAllowed = Object.keys(data).every((field) =>
    allowedEditFields.includes(field)
  );
  return isEditAllowed;
};


module.exports = { validateSignUpData, validateEditProfileData };
