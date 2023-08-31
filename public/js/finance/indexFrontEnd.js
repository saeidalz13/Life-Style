"use strict";
const setDisplayElement = (elements, value) => {
    elements.forEach((element) => {
        element.style["display"] = value;
    });
};
const submit_expenses_button = document.querySelector("#submit_expenses_button");
const show_budgets_button = document.querySelector("#show_budgets_button");
const new_budget_button = document.querySelector("#new_budget_button");
const select_budget_to_expense = document.querySelector("#select_budget_to_expense");
const select_budget_to_details = document.querySelector("#select_budget_to_details");
const submit_expenses_link = document.querySelector("#submit_expenses_link");
const show_budgets_link = document.querySelector("#show_budgets_link");
const _body = document.querySelector("body");
const header_budgets_list_expenses = document.querySelector("#header_budgets_list_expenses");
const header_budgets_list_details = document.querySelector("#header_budgets_list_details");
const header_no_budgets_expenses = document.querySelector("#header_no_budgets_expenses");
const header_no_budgets_details = document.querySelector("#header_no_budgets_details");
if (submit_expenses_button && show_budgets_button && new_budget_button) {
    submit_expenses_button.addEventListener("click", () => {
        if (select_budget_to_expense && _body) {
            select_budget_to_expense.style.display = "block";
            _body.style.backgroundColor = "rgb(190, 190, 190)";
            setDisplayElement([submit_expenses_button, show_budgets_button, new_budget_button], "none");
            if (header_no_budgets_expenses) {
                header_no_budgets_expenses.textContent =
                    "No Budgets! Create one to submit expenses";
            }
            if (header_budgets_list_expenses) {
                header_budgets_list_expenses.textContent =
                    "Choose Budget To Submit Expense:\n(Hint: Start Date to End Date)";
            }
        }
    });
    show_budgets_button.addEventListener("click", () => {
        if (select_budget_to_details && _body) {
            select_budget_to_details.style.display = "block";
            _body.style.backgroundColor = "rgb(190, 190, 190)";
            setDisplayElement([submit_expenses_button, show_budgets_button, new_budget_button], "none");
            if (header_no_budgets_details) {
                header_no_budgets_details.textContent = "No Budgets To Show Details";
            }
            if (header_budgets_list_details) {
                header_budgets_list_details.textContent =
                    "Choose ID To Show Budget Details:\n(Hint: Start Date to End Date)";
            }
        }
    });
}
//# sourceMappingURL=indexFrontEnd.js.map