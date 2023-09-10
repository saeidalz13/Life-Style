import { Request, Response } from "express"

export const get_home = (_: Request, res: Response): void => {
    res.render("home/index", { title: "Home" });
}

