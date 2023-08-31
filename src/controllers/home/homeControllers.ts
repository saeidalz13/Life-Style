import { Request, Response } from "express"

export const get_home = (req: Request, res: Response): void => {
    res.render("home/index", { title: "Home" });
}

