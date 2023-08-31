import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const dbExpensesPath = path.join(__dirname, "..","..", "..", "databases", "expenses.db")

const insertIntoCapitalTable = `INSERT OR IGNORE INTO capital (email, budgetID, amount, description) VALUES (?, ?, ?, ?)`
const insertIntoEntertainmentTable = `INSERT OR IGNORE INTO entertainment (email, budgetID, amount, description) VALUES (?, ?, ?, ?)`
const insertIntoEatoutTable = `INSERT OR IGNORE INTO eatout (email, budgetID, amount, description) VALUES (?, ?, ?, ?)`

export const insertExpensesCommands = {
    capital: insertIntoCapitalTable,
    entertainment: insertIntoEntertainmentTable,
    eatout: insertIntoEatoutTable
}

const createEatoutTable = `CREATE TABLE IF NOT EXISTS eatout (
	email TEXT,
	budgetID TEXT,
	amount REAL,
	description TEXT
)` 

const createEntertainmentTable = `CREATE TABLE IF NOT EXISTS entertainment (
	email TEXT,
	budgetID TEXT,
	amount REAL,
	description TEXT
)` 

const createCapitalTable = `CREATE TABLE IF NOT EXISTS capital (
	email TEXT,
	budgetID TEXT,
	amount REAL,
	description TEXT
)` 


export const sqlCommandsReadExpenses = {
	capital: `SELECT * FROM capital WHERE email = ? AND budgetID = ?`,
	entertainment: `SELECT * FROM entertainment WHERE email = ? AND budgetID = ?`,
	eatout: `SELECT * FROM eatout WHERE email = ? AND budgetID = ?`
}

export const createExpensesTables = [
    createCapitalTable,
    createEntertainmentTable,
    createEatoutTable
]


export interface INewExpenseToInsert {
    email: string;
    budgetID: string;
    expenseType: string;
    amount: number;
    description: string;
}

export interface IBudget {
    author: string,
    startDate: Date;
    endDate: Date;
    income: number;
    savings: number;
    capital: number;
    entertainment: number;
    eatout: number;
    budgetID: string;
    capitalBalance: number;
    entertainmentBalance: number;
    eatoutBalance: number
  
  }

export const ExpenseType = {
    capital: "capital",
    entertainment: "entertainment",
    eatout: "eatout"
}