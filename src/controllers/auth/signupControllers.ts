import User from "../../models/users.js";
import jwt from "jsonwebtoken";
import { Response, Request } from "express";
import { maxAgeJwt, maxAgeCookies } from "../../utils/auth/authConstants.js";

import {
  HTTPCodes,
  stringOrVoid,
  signUpError,
  secretKey,
  MongoErrorCodes,
} from "../../globalConstants.js";

const createTokenJWT = (userID: object): stringOrVoid => {
  if (secretKey) {
    return jwt.sign({ userID }, secretKey, { expiresIn: maxAgeJwt });
  }
  console.log("Failed to create JWT");
  return;
};

const handleSignupError = (err: signUpError): object | void => {
  const errors = { email: "", password: "" };
  if (err && "message" in err && "keyPattern" in err && "code" in err) {
    if (err.code === MongoErrorCodes.duplicateCode) {
      if (Object.keys(err.keyPattern)[0] === "email") {
        errors["email"] = "This username already exists!";
      }
      return errors;
    }
  }
  console.log("Error handling for signup_post failed");
  return;
};

export const get_signup = (req: Request, res: Response): void => {
  res.render("auth/signup", { title: "Sign Up" });
};

export const post_signup = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userInputInfo = req.body;
  try {
    const newUser = await User.create(userInputInfo);
    const token = createTokenJWT(newUser._id);

    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAgeCookies });
    res.status(HTTPCodes.Created).json({ user: newUser._id });
  } catch (error) {
    const errors = handleSignupError(error as signUpError);
    res.status(HTTPCodes.BadRequest).json({ errors });
  }
};
