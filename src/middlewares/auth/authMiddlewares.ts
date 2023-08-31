import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import User from "../../models/users.js";
import {
  stringOrVoid,
  decodedTokenStringified,
  secretKey,
} from "../../globalConstants.js";
dotenv.config();

export const checkUserAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.cookies.jwt;
  if (!token) {
    res.redirect("/login");
  }
  if (secretKey) {
    jwt.verify(
      token,
      secretKey,
      (err: jwt.VerifyErrors | null, decodedToken: any) => {
        if (err) {
          console.log(err);
          res.redirect("/login");
        }
        // if (decodedToken) console.log("Decoded token:", decodedToken);
        next();
      }
    );
  } else {
    console.log("Retrieving secret key failed!");
  }
};

export const checkUserOrGuest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.jwt;

  if (token && secretKey) {
    jwt.verify(
      token,
      secretKey,
      async (
        err: JsonWebTokenError | null,
        decodedToken: decodedTokenStringified | any
      ) => {
        if (err) {
          res.locals.user = "Guest";
          next();
        }

        if ("userID" in decodedToken) {
          const userID = decodedToken["userID"];
          const user = await User.findById(userID);
          if (user) {
            res.locals.user = user;
            next();
          } else {
            console.log(`No user with this token!`);
            next();
          }
        } else {
          console.log(`Stringifying the token failed!`);
          next();
        }
      }
    );
  } else {
    res.locals.user = "Guest";
    next();
  }
};
