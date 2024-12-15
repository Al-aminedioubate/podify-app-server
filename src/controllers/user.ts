import { RequestHandler } from "express";
import nodemailer from "nodemailer";

import { CreateUser } from "#/@types/user";
import User from '#/models/user';
import EmailVerificationToken from "#/models/emailVerificationToken";
import { MAILTRAP_PASS, MAILTRAP_USER } from "#/utils/variables";
import { generateToken } from "#/utils/helper";
import { generateTemplate } from "#/mail/template";

import path from 'path';

export const create: RequestHandler = async (req: CreateUser, res) =>{
    const {email, password, name } = req.body;


    const user = await User.create({ name, email, password });
    //Send email verification
    var transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: MAILTRAP_USER,
          pass: MAILTRAP_PASS
        }
    });
    
    //creation of token 
    const token = generateToken();
    const newToken = await EmailVerificationToken.create({
        owner: user._id,
        token: token,
    });

    //notre message de mailtrap
    const welcomeMessage = `Hi ${name}, welcome to Podify! There are so much thing that we do for verified users. Use the given OTP to verify your email.`;

    //ce code nous permet d'envoyer l'email de verification dans nodemailer.
    transport.sendMail({
        to: user.email,
        from: "auth@myapp.com",
        html: generateTemplate({
            title: "Welcome to Podify",
            message: welcomeMessage,
            logo: "cid:logo",
            banner: "cid:welcome",
            link: "#",
            btnTitle: token
        }),
        attachments:[
            {
                filename: "logo.png",
                path: path.join(__dirname, "../mail/logo.png"),
                cid: "logo",
            },
            {
                filename: "welcome.png",
                path: path.join(__dirname, "../mail/welcome.png"),
                cid: "welcome",
            },
        ]
    });

    res.status(201).json({ user })
};