import { Response, Request } from "express";
import User from "../../models/users.js";
import jwt from "jsonwebtoken";
import {
  loginMsgs,
  UserLoginInfo,
} from "../../utils/auth/usersModelConstants.js";
import { HTTPCodes, secretKey, stringOrVoid } from "../../globalConstants.js";
import {
  maxAgeJwt,
  fetchedUser,
  maxAgeCookies,
} from "../../utils/auth/authConstants.js";

const createTokenJWT = (userID: string): stringOrVoid => {
  if (secretKey) {
    return jwt.sign({ userID }, secretKey, { expiresIn: maxAgeJwt });
  }
  console.log("Failed to create JWT");
  return;
};

export const get_login = (req: Request, res: Response) => {
  res.render("auth/login", { title: "Login" });
};

export const post_login = async (req: Request, res: Response) => {
  const userLoginInfo = req.body as UserLoginInfo;
  if (userLoginInfo) {
    try {
      const user: fetchedUser = await User.login(userLoginInfo);

      const token = createTokenJWT(user._id);
      res.cookie("jwt", token, { httpOnly: true, maxAge: maxAgeCookies });

      res.status(HTTPCodes.Accepted).json({ user });
    } catch (error) {
      const errors = { email: loginMsgs.invEmail, password: loginMsgs.invPass };
      res.status(HTTPCodes.BadRequest).json({ errors });
    }
  }
};
