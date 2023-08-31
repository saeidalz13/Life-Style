import { Router } from "express";
import { checkUserAuthenticated } from "../../middlewares/auth/authMiddlewares.js";
import {
  get_finance,
  get_create_new_budget,
  get_show_budgets,
  post_create_new_budget,
  delete_show_budgets

} from "../../controllers/finance/budgetControllers.js";

import {
  get_submit_expenses,
  post_submit_expenses,
  get_show_expenses
} from "../../controllers/finance/expenseControllers.js";

const router = Router();

router.get("/finance/show-budgets/:id", checkUserAuthenticated, get_show_budgets);
router.delete("/finance/show-budgets/:id", delete_show_budgets)
router.get("/finance/show-budgets/:id/:expenseType", checkUserAuthenticated, get_show_expenses)

router.get("/finance", checkUserAuthenticated, get_finance);
router.get("/finance/create-budget", checkUserAuthenticated, get_create_new_budget);
router.post("/finance/create-budget", post_create_new_budget);

// Expenses
router.get("/finance/submit-expenses/:id", checkUserAuthenticated, get_submit_expenses);
router.post("/finance/submit-expenses/:id", post_submit_expenses);

export default router;
