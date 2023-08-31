import sqlite3, { Database } from "sqlite3";
import { Request, Response } from "express";
import {
  dbExpensesPath,
  createExpensesTables,
  insertExpensesCommands,
  INewExpenseToInsert,
  ExpenseType,
  sqlCommandsReadExpenses,
} from "../../utils/finance/financeConstants.js";
import { fetchedUser } from "../../utils/auth/authConstants.js";
import {
  HTTPCodes,
  secretKey,
  stringOrVoid,
  decodedTokenStringified,
} from "../../globalConstants.js";
import jwt from "jsonwebtoken";
import Budget from "../../models/budgets.js";
import User from "../../models/users.js";

type TExpenseType = "capital" | "entertainment" | "eatout";

const extract_token = (req: Request): stringOrVoid => {
  const token = req.cookies.jwt;
  if (!token) {
    console.log("Fetching the token failed, redirecting to login page");
    return;
  }
  return token;
};

const connection_to_finance_db = (): Promise<Database> => {
  return new Promise((resolve, reject) => {
    const dbExpenses = new sqlite3.Database(
      dbExpensesPath,
      sqlite3.OPEN_READWRITE,
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(dbExpenses);
        }
      }
    );
  });
};

const create_expenses_table = async (): Promise<string | void> => {
  try {
    const dbExpenses = await connection_to_finance_db();

    return new Promise((resolve, reject) => {
      if (createExpensesTables) {
        createExpensesTables.forEach((table) => {
          dbExpenses.run(table, (err) => {
            if (err) {
              console.log("Creating expenses table failed!");
              reject(err as Error);
            }
            resolve("Expenses table created successfully!");
          });
        });
      }
    });
  } catch (error) {
    console.log(error);
    return;
  }
};

const add_expenses = (
  dbExpenses: sqlite3.Database,
  newExpense: INewExpenseToInsert
) => {
  return new Promise((resolve, reject) => {
    let sqlCommand: string;
    const expenseType = newExpense["expenseType"];
    if (expenseType === ExpenseType.capital) {
      sqlCommand = insertExpensesCommands.capital;
    } else if (expenseType === ExpenseType.entertainment) {
      sqlCommand = insertExpensesCommands.entertainment;
    } else if (expenseType === ExpenseType.eatout) {
      sqlCommand = insertExpensesCommands.eatout;
    } else {
      console.log("Invalid type of expense");
      reject(new Error(`Adding ${expenseType} expenses failed`));
      return;
    }
    const values = [
      newExpense["email"],
      newExpense["budgetID"],
      newExpense["amount"],
      newExpense["description"],
    ];
    dbExpenses.run(sqlCommand, values, (err) => {
      if (err) {
        console.log("Adding capital expenses failed", err);
        reject(new Error(`Adding ${expenseType} expenses failed`));
      }

      const success = { msg: `${expenseType} expenses were added!` };
      resolve(success);
    });
  });
};

const deduct_expenses_from_balance = async (
  _id: string,
  newExpense: INewExpenseToInsert
) => {
  const expenseType = newExpense["expenseType"];
  const budget = await Budget.findById(_id);
  if (!budget) {
    const result = { error: "Budget was not found for the user" };
    return result;
  }
  const filter = { _id: _id };
  let update: object;
  if (expenseType === ExpenseType.capital) {
    const newValue = budget.capitalBalance - newExpense["amount"];
    update = { capitalBalance: newValue };
  } else if (expenseType === ExpenseType.entertainment) {
    const newValue = budget.entertainmentBalance - newExpense["amount"];
    update = { entertainmentBalance: newValue };
  } else if (expenseType === ExpenseType.eatout) {
    const newValue = budget.eatoutBalance - newExpense["amount"];
    update = { eatoutBalance: newValue };
  } else {
    const result = { error: "Invalid type of expense" };
    return result;
  }

  try {
    let updatedBudget = await Budget.findOneAndUpdate(filter, update);
    updatedBudget = await Budget.findOne(filter);
    const result = { success: updatedBudget };
    return result;
  } catch (error) {
    const result = { error: error };
    return result;
  }
};

export const post_submit_expenses = async (req: Request, res: Response) => {
  const _id = req.params.id;
  const newExpense = req.body;
  const token = extract_token(req);

  if (newExpense && token && secretKey && _id) {
    try {
      const created = await create_expenses_table();
      console.log(created);

      jwt.verify(
        token,
        secretKey,
        async (
          err: jwt.VerifyErrors | null,
          decodedToken: decodedTokenStringified | any
        ) => {
          if (err) {
            console.log(err);
            res.status(HTTPCodes.BadRequest).redirect("/login");
          }

          if ("userID" in decodedToken) {
            const userID = decodedToken["userID"];

            try {
              const user: fetchedUser | null = await User.findById(userID);

              if (!user) {
                res.status(HTTPCodes.BadRequest).redirect("/login");
              } else {
                newExpense["email"] = user["email"];
                newExpense["budgetID"] = _id;
                const dbExpenses = await connection_to_finance_db();

                try {
                  const success: any = await add_expenses(
                    dbExpenses,
                    newExpense
                  );
                  const result = await deduct_expenses_from_balance(
                    _id,
                    newExpense
                  );

                  if ("success" in result && success) {
                    success.updatedBudget = result.success;
                    res.status(HTTPCodes.Created).json({ success });
                  } else {
                    const errors = {
                      msg: "Balance was not updated in the budget",
                    };
                    res.status(HTTPCodes.Created).json({ errors });
                  }
                } catch (error) {
                  const errors = { msg: (error as Error).message };
                  console.log({ errors });
                  res.status(HTTPCodes.BadRequest).json({ errors });
                }
              }
            } catch (error) {
              console.log(error);
            }
          }
        }
      );
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log("Fetching newExpense or token failed");
    return;
  }
};

export const get_submit_expenses = async (
  req: Request,
  res: Response
): Promise<void> => {
  const _id = req.params.id;

  const budget = await Budget.findById(_id);
  if (budget) {
    console.log(budget);
    try {
      res.status(HTTPCodes.Accepted).render("finance/submitExpenses", {
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
};


export const get_show_expenses = async (req: Request, res: Response) => {
  const expenseType = req.params.expenseType as TExpenseType;
  const _id = req.params.id;
  const token = extract_token(req);

  if (_id && expenseType && token && secretKey) {
    jwt.verify(
      token,
      secretKey,
      async (err, decodedToken: decodedTokenStringified | any) => {
        if (err) {
          return res.status(HTTPCodes.BadRequest).redirect("/login");
        }

        if ("userID" in decodedToken) {
          const userID = decodedToken["userID"];
          
          try {
            const user: fetchedUser | null = await User.findById(userID);
            const dbExpenses = await connection_to_finance_db();

            if (user) {
              console.log(user.email, _id)
              dbExpenses.all(sqlCommandsReadExpenses[expenseType], [user.email ,_id], (err, rows) => {
                if (err) {
                  console.log(`Error in fetching ${expenseType}`)
                }
                
                console.log(rows)
                return res.status(HTTPCodes.Accepted).render("finance/showExpenses", {
                  title: "Show Expenses",
                  expenses: rows,
                  expenseType: expenseType
                });
              });
            }

          } catch (error) {
            console.log(error);
          }
        }
      }
    );
  }
};
