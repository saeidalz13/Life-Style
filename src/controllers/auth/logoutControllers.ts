import { HTTPCodes } from "../../globalConstants.js";
import { Response, Request } from "express";

export const get_logout = (req: Request, res: Response) => {
  res.status(HTTPCodes.OK).clearCookie("jwt");
  res.redirect("/");
};
