import passwordResetToken from "#/models/passwordResetToken";
import { JWT_SECRET } from "#/utils/variables";
import { RequestHandler } from "express";
import { JwtPayload, verify } from "jsonwebtoken";
import User from "#/models/user";

//Validating the password reset link if it's expired or no
export const isValidPassResetToken: RequestHandler = async (req, res, next) => {
  const { token, userId } = req.body;

  const resetToken = await passwordResetToken.findOne({ owner: userId });
  if (!resetToken)
    return res
      .status(403)
      .json({ error: "Unauthorized access, invalid token" }); // because the token will expire in an hour.

  const matched = await resetToken.compareToken(token);
  if (!matched)
    return res
      .status(403)
      .json({ error: " Unauthorized access, invalid token!" });

  next();
};


export const mustAuth: RequestHandler = async (req, res, next) => {
  const { authorization } = req.headers;
  const token = authorization?.split("Bearer")[1];

  console.log("token value " + token);

  if (!token)
    return res.status(403).json({ error: "Unauthorized request! best" });

  const payload = verify(token, JWT_SECRET) as JwtPayload;
  const id = payload.userId;


  const user = await User.findOne({ _id: id, tokens: token });
  if (!user) return res.status(403).json({ error: "Unauthorized request!" });

  req.user = {
    id: user._id,
    name: user.name,
    email: user.email,
    verified: user.verified,
    avatar: user.avatar?.url,
    followers: user.followers.length,
    followings: user.followings.length,
  };

  req.token = token;

  next();
};

export const isVerified: RequestHandler = (req, res, next) =>{
  if(!req.user.verified) return res.status(403).json({error: "Please verify your email account!"});

  next();
}
