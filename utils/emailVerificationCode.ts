import User from "../models/userModel";

export const generatEmailVerificationCode = async () => {
  let isCodeUnique = false;
  let emailVerificationCode;

  while (!isCodeUnique) {
    emailVerificationCode = Math.floor(1000 + Math.random() * 9000);

    const userExistWithCode = await User.findOne({ emailVerificationCode });

    if (!userExistWithCode) {
      isCodeUnique = true;
    } 
  }
  return emailVerificationCode;
};
