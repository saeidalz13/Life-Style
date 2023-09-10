import {
  HTTPCodes,
  secretKey,
  createBudgetError,
  MongoErrorCodes,
  decodedTokenStringified,
  stringOrVoid,
} from "../../globalConstants.js";
import jwt from "jsonwebtoken";
import Budget from "../../models/budgets.js";
import { Request, Response } from "express";

const handleErrorsCreateBudget = (err: createBudgetError): object | void => {
  const errors = { msg: "" };
  if (err.code === MongoErrorCodes.duplicateCode) {
    errors["msg"] = "Budget for this date period already exists!";
    return errors;
  }
  return;
};

// const extract_token = (req: Request, res: Response): string => {
//   const token = req.cookies.jwt;
//   if (!token) {
//     console.log("Fetching the token failed, redirecting to login page");
//     res.status(HTTPCodes.BadRequest).redirect("/login");
//   }
//   return token;
// };

const extract_token = (req: Request, res: Response): stringOrVoid => {
  const token = req.cookies.jwt;
  if (!token) {
    console.log("Fetching the token failed, redirecting to login page");
    return;
  }
  return token;
};

export const get_finance = (req: Request, res: Response): void => {
  const token = extract_token(req, res);

  if (token && secretKey) {
    jwt.verify(
      token,
      secretKey,
      async (
        err: jwt.VerifyErrors | null,
        decodedToken: decodedTokenStringified | any
      ) => {
        if (err) {
          console.log("Retrieving PayLoad failed!");
          return;
        }
        if ("userID" in decodedToken) {
          const userID = decodedToken["userID"];
          try {
            const budgets = await Budget.find({ author: userID });

            res.render("finance/index", { title: "Finance", budgets: budgets });
          } catch (error) {
            console.log(error);
            res
              .status(HTTPCodes.InternalServerError)
              .send("Internal Server Error 500");
          }
        }
      }
    );
  } else {
    res.status(HTTPCodes.BadRequest).redirect("/login");
  }
};

export const get_create_new_budget = (req: Request, res: Response): void => {
  try {
    res.render("finance/createBudget", { title: "Create Budget" });
  } catch (error) {
    res.status(HTTPCodes.InternalServerError).send("Internal Server Error 500");
  }
};

export const post_create_new_budget = (req: Request, res: Response) => {
  const newBudgetReq = req.body;
  const token = extract_token(req, res);

  if (token && secretKey) {
    jwt.verify(
      token,
      secretKey,
      async (err, decodedToken: decodedTokenStringified | any) => {
        if (err) {
          console.log("Authentication failed; rerouting to login");
          res.status(HTTPCodes.BadRequest).redirect("/login");
        } else {
          if ("userID" in decodedToken) {
            const userID = decodedToken["userID"];
            try {
              newBudgetReq["author"] = userID;
              const newBudget = await Budget.create(newBudgetReq);

              if (newBudget) {
                const success = { msg: "" };
                const budgetID = newBudget.budgetID;
                success[
                  "msg"
                ] = `Budget created successfully - ID: ${budgetID}`;
                res.status(HTTPCodes.Created).json({ success });
              }
            } catch (error) {
              const errors = handleErrorsCreateBudget(
                error as createBudgetError
              );
              res.status(HTTPCodes.BadRequest).json({ errors });
            }
          }
        }
      }
    );
  }
};

export const get_show_budgets = async (req: Request, res: Response) => {
  const _id = req.params.id;

  if (_id) {
    const budget = await Budget.findById(_id);
    if (budget) {
      // console.log(budget);
      try {
        res.status(HTTPCodes.Accepted).render("finance/showBudgets", {
          title: "Submit Expenses",
          budget: budget,
        });
      } catch (error) {
        res.status(HTTPCodes.InternalServerError).send("Internal Server Error");
      }
    } else {
      console.log("budget was not found");
      res.status(HTTPCodes.InternalServerError).send("Internal Server Error");
    }
  }
};

export const delete_show_budgets = async (req: Request, res: Response) => {
  const _id = req.params.id;

  if (_id) {
    try {
      const deletedBudget = await Budget.findByIdAndDelete(_id);

      console.log(deletedBudget);
      if (!deletedBudget) {
        const errors = { msg: "Budget Not Found!" };
        return res.status(HTTPCodes.NotFound).json({ errors });
      }

      const success = { msg: "Budget Was Deleted Successfully!" };
      return res.status(HTTPCodes.OK).json({ success });
    } catch (error) {
      console.log(error);
      const errors = { msg: "Something went wrong!" };
      return res.status(HTTPCodes.InternalServerError).json({ errors });
    }
  }
};

// if (token && secretKey) {
//   jwt.verify(
//     token,
//     secretKey,
//     async (
//       err: jwt.VerifyErrors | null,
//       decodedToken: decodedTokenStringified | any
//     ) => {
//       if (err) {
//         console.log("Authentication failed; rerouting to login");
//         res.status(HTTPCodes.BadRequest).redirect("/login");
//       } else {
//         if ("userID" in decodedToken) {
//           const userID = decodedToken["userID"];

//           try {
//             const budgets = await Budget.find({ author: userID });

//             res.status(HTTPCodes.OK).render("finance/showBudgets", {
//               title: "Show Budgets",
//               budgets: budgets,
//             });
//           } catch (error) {
//             console.log("Fetching budgets failed", error);
//           }
//         }
//       }
//     }
//   );
// }

//   if (!token) {
//     console.log("Token missing!");
//     return res.status(HTTPCodes.BadGateway).redirect("/login");
//   } else if (token && secretKey) {
//     const token = extract_token(req, res);
//     console.log(decodedToken)

//     if (!decodedToken) {
//       return;
//     }

//     if ("userID" in decodedToken) {
//       try {
//         const budgets = await Budget.findById({
//           author: decodedToken["userID"],
//         })
//           .populate("author")
//           .exec();

//         console.log(budgets);
//         // return
//         // res.status(HTTPCodes.OK).render("finance/showBudgets", {
//         //   title: "Show Budgets",
//         //   budgets: budgets,
//         // });
//       } catch (error) {
//         console.log("Fetching budgets failed:", error);
//       }
//     }
//   }

//   console.log("Redirecting to main finance page due to error!");
//   res.status(HTTPCodes.BadGateway).redirect("/finance");
// };
