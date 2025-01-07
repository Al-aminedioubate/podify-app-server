import { RequestHandler } from "express";

import { CreateUser, VerifyEmailRequest } from "#/@types/user";
import User from "#/models/user";
import { generateToken } from "#/utils/helper";
import { sendVerificationMail } from "#/utils/mail";
import EmailVerificationToken from "#/models/emailVerificationToken";
import emailVerificationToken from "#/models/emailVerificationToken";
import PasswordResetToken from "#/models/emailVerificationToken";
import { isValidObjectId } from "mongoose";
import crypto from "crypto";
import { PASSWORD_RESET_LINK } from "#/utils/variables";

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
export const verifyEmail: RequestHandler = async (req: VerifyEmailRequest, res) => {
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
export const sendReverificationToken:RequestHandler = async (req , res) =>{
    const {userId} = req.body;

    if(!isValidObjectId(userId)) return res.status(403).json({error: "Invalid request!"});   //verifions l'id de user est valide

    const user = await User.findById(userId);  //finding if the user exist in our DB before sending him new token
    if(!user) return res.status(403).json({error:"Invalide request!"});

    //deleting the previous token if there's any
    await emailVerificationToken.findOneAndDelete({
        owner: userId
    })

    //generate new token
    const token = generateToken();

    //store the token in DB.
    emailVerificationToken.create({
        owner: userId,
        token
    })

    //send new verification email
    sendVerificationMail(token, {
        name: user?.name,
        email: user?.email,
        userId: user?._id.toString()
    })

    res.json({message: "Please check your email!"})
};

//Generating forget password link
export const generateForgetPasswordLink: RequestHandler = async (req, res) =>{

  const {email} = req.body;

  //verify if the user exists
  const user = await User.findOne({email});
  if(!user) return res.status(404).json({error: "Account not found!"});

 const token = crypto.randomBytes(36).toString('hex');     //generating token for password reset randomly

  PasswordResetToken.create({
    owner: user._id,
    token
  })

  const resetLink = `${PASSWORD_RESET_LINK}?token=${token}&userId=${user._id}`;           //generating the link to reset password.
  
  res.json({resetLink});    

};
