import passwordResetToken from "#/models/passwordResetToken";
import { RequestHandler } from "express";

//Validating the password reset link if it's expired or no
export const isValidPassResetToken: RequestHandler = async (req, res, next) => {
    const { token, userId } = req.body;
  
    const resetToken = await passwordResetToken.findOne({owner: userId});
    if(!resetToken) return res.status(403).json({error: "Unauthorized access, invalid token"})      // because the token will expire in an hour.
  
    const matched = await resetToken.compareToken(token);
    if(!matched) return res.status(403).json({error: " Unauthorized access, invalid token!"});
  
    next();
}