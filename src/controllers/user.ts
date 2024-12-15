import { CreateUser } from "#/@types/user";
import { RequestHandler } from "express";
import User from "#/models/user";
import { generateToken } from "#/utils/helper";
import { sendVerificationMail } from "#/utils/mail";

export const create: RequestHandler = async (req: CreateUser, res) =>{
    const {email, password, name } = req.body;

    const user = await User.create({ name, email, password });

    //send verification email
    const token = generateToken();
    sendVerificationMail(token, {name, email, userId: user._id.toString()})

    res.status(201).json({ user: {id: user._id, name, email} });        //we dont want to send the full user so sending only id, name & email.
};