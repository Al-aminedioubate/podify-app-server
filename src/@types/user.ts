import { Request } from "express";

export interface CreateUser extends Request {
  body: {
    name: string;
    email: string;
    password: string;
  };
}

export interface VerifyEmailRequest extends Request {
  body: {
    userId: string;
    token: string;
  };
}

declare global {
  namespace Express {
    interface Request {
      user: {
        id: any;
        name: string;
        email: string;
        verified: Boolean;
        avatar?: string;
        followers: number;
        followings: number;
      };
      token: string;
    }
  }
}
