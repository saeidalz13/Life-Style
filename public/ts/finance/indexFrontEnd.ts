const setDisplayElement = (
  elements: Array<HTMLButtonElement>,
  value: string
): void => {
  elements.forEach((element) => {
    element.style["display"] = value;
  });
};

const submit_expenses_button: HTMLButtonElement | null = document.querySelector(
  "#submit_expenses_button"
);
const show_budgets_button: HTMLButtonElement | null = document.querySelector(
  "#show_budgets_button"
);
const new_budget_button: HTMLButtonElement | null =
  document.querySelector("#new_budget_button");

const select_budget_to_expense: HTMLDivElement | null = document.querySelector(
  "#select_budget_to_expense"
);
const select_budget_to_details: HTMLDivElement | null = document.querySelector(
  "#select_budget_to_details"
);
const submit_expenses_link: HTMLAnchorElement | null = document.querySelector(
  "#submit_expenses_link"
);
const show_budgets_link: HTMLAnchorElement | null =
  document.querySelector("#show_budgets_link");
const _body: HTMLBodyElement | null = document.querySelector("body");
const header_budgets_list_expenses: HTMLUListElement | null =
  document.querySelector("#header_budgets_list_expenses");
const header_budgets_list_details: HTMLUListElement | null =
  document.querySelector("#header_budgets_list_details");

const header_no_budgets_expenses: HTMLUListElement | null =
  document.querySelector("#header_no_budgets_expenses");
const header_no_budgets_details: HTMLUListElement | null =
  document.querySelector("#header_no_budgets_details");

if (submit_expenses_button && show_budgets_button && new_budget_button) {
  submit_expenses_button.addEventListener("click", () => {
    if (select_budget_to_expense && _body) {
      select_budget_to_expense.style.display = "block";
      _body.style.backgroundColor = "rgb(190, 190, 190)";
      setDisplayElement(
        [submit_expenses_button, show_budgets_button, new_budget_button],
        "none"
      );

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
      setDisplayElement(
        [submit_expenses_button, show_budgets_button, new_budget_button],
        "none"
      );

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
