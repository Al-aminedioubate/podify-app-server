import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

import { CreateUser, VerifyEmailRequest } from "#/@types/user";
import User from "#/models/user";
import { generateToken } from "#/utils/helper";
import {
  sendForgetPasswordLink,
  sendPassResetSuccessEmail,
  sendVerificationMail,
} from "#/utils/mail";
import EmailVerificationToken from "#/models/emailVerificationToken";
import PasswordResetToken from "#/models/passwordResetToken";
import { isValidObjectId } from "mongoose";
import crypto from "crypto";
import { JWT_SECRET, PASSWORD_RESET_LINK } from "#/utils/variables";
import { urlencoded } from "body-parser";

//creation de l'utilisateur
export const create: RequestHandler = async (req: CreateUser, res) => {
  const { email, password, name } = req.body;

  const user = await User.create({ name, email, password });

  // send verification email
  const token = generateToken();

  //creation of token
  await EmailVerificationToken.create({
    owner: user._id,
    token: token,
  });

  sendVerificationMail(token, { name, email, userId: user._id.toString() });

  res.status(201).json({ user: { id: user._id, name, email } });
};

//Verification d'email
export const verifyEmail: RequestHandler = async (
  req: VerifyEmailRequest,
  res
) => {
  const { token, userId } = req.body;

  const verificationToken = await EmailVerificationToken.findOne({
    owner: userId,
  });

  if (!verificationToken)
    return res.status(403).json({ error: "Invalid token!" });

  const matched = await verificationToken.compareToken(token);
  if (matched) return res.status(403).json({ error: "Invalid token!!" });

  await User.findByIdAndUpdate(userId, {
    verified: true,
  });

  await EmailVerificationToken.findByIdAndDelete(verificationToken._id);

  res.json({ message: "Your email is verified." });
};

//verification de id et password de user
export const sendReverificationToken: RequestHandler = async (req, res) => {
  const { userId } = req.body;

  if (!isValidObjectId(userId))
    return res.status(403).json({ error: "Invalid request!" }); //verifions l'id de user est valide

  const user = await User.findById(userId); //finding if the user exist in our DB before sending him new token
  if (!user) return res.status(403).json({ error: "Invalide request!" });

  //deleting the previous token if there's any
  await EmailVerificationToken.findOneAndDelete({
    owner: userId,
  });

  //generate new token
  const token = generateToken();

  //store the token in DB.
  EmailVerificationToken.create({
    owner: userId,
    token,
  });

  //send new verification email
  sendVerificationMail(token, {
    name: user?.name,
    email: user?.email,
    userId: user?._id.toString(),
  });

  res.json({ message: "Please check your email!" });
};

//forget passwork reset Link
export const generateForgetPasswordLink: RequestHandler = async (req, res) => {
  const { email } = req.body;

  //verifying if the user exist
  const user = await User.findOne({ email });
  if (!user) return res.status(403).json({ error: "Account not found!" });

  //Removing previous token before generating new one.
  await PasswordResetToken.findOneAndDelete({
    owner: user._id,
  });

  //let generate the link if the user exist (token)
  const token = crypto.randomBytes(36).toString("hex");

  PasswordResetToken.create({
    owner: user._id,
    token,
  });

  const resetLink = `${PASSWORD_RESET_LINK}?token=${token}&userId=${user._id}`;

  sendForgetPasswordLink({ email: user.email, link: resetLink });

  res.json({ message: "Check your registered email" });
};

//Validating the password reset link if it's expired or no
export const grantValid: RequestHandler = async (req, res) => {
  res.json({ valid: true });
};

//Updating password From
export const updatePassword: RequestHandler = async (req, res) => {
  const { password, userId } = req.body;

  const user = await User.findById(userId);
  if (!user) return res.status(403).json({ error: "Unauthorized access!" });

  const matched = await user.comparePassword(password);
  if (matched)
    return res
      .status(422)
      .json({ error: "The new password must be different!" });

  user.password = password;
  await user.save();

  await PasswordResetToken.findOneAndDelete({ owner: user._id });

  //send the success email
  try {
    await sendPassResetSuccessEmail(user.name, user.email);
  } catch (error) {
    console.log("error on sending mail", error);
  }
  res.json({ message: "Password resets successfully." });
};

export const signIn: RequestHandler = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    email: email,
  });

  if (!user)
    return res.status(403).json({ error: "Email / Password is mismatch!" });

  //compare password
  const matched = await user.comparePassword(password);
  if (!matched)
    return res.status(403).json({ error: "Email / Password mismatch!" });

  //generate the token for later use. By using jsonwebtoken
  const token = jwt.sign({ userId: user._id }, JWT_SECRET);
  user.tokens.push(token); //we store those token in our DB because they're not expirable.

  await user.save();

  res.json({
    profile: {
      id: user._id,
      name: user.name,
      email: user.email,
      verified: user.verified,
      avatar: user.avatar?.url,
      followers: user.followers.length,
      followings: user.followings.length,
    },
    token,
  });
};
