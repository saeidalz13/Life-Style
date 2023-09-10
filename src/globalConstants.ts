import path from "path";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();
export const secretKey = process.env.secretKey;



export const MongoErrorCodes = {
  duplicateCode: 11000,
}

export const bootstrapPath = path.join(
  "node_modules",
  "bootstrap",
  "dist",
  "css"
);

export const HTTPCodes = {
  OK: 200,
  Created: 201,
  Accepted: 202,
  NoContent: 204,
  BadRequest: 400,
  Forbidden: 403,
  NotFound: 404,
  InternalServerError: 500,
  BadGateway: 502
};

export type stringOrVoid = string | void;

export type signUpError = {
  code: number;
  keyPattern: string;
  message: string;
};

export type createBudgetError = {
  message: string;
  index: number;
  code: number;
  keyPattern: object;
  keyValue: object;
}

export type decodedTokenStringified = {
    userID: string;
    iat: number;
    exp: number;
}

export type TDecodedToken = string | jwt.JwtPayload | undefined | decodedTokenStringified
export type TDecodedError = jwt.VerifyErrors | null