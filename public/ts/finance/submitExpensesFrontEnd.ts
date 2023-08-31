const new_expense_form_expenses: HTMLFormElement | null =
  document.querySelector("#new_expense_form_expenses");
const submit_expenses: HTMLButtonElement | null =
  document.querySelector("#submit_expenses");

const capital_balance_table: HTMLTableElement | null = document.querySelector(
  "#capital_balance_table"
);
const entertainment_balance_table: HTMLTableElement | null =
  document.querySelector("#entertainment_balance_table");
const eatout_balance_table: HTMLTableElement | null = document.querySelector(
  "#eatout_balance_table"
);

// Finding ID from the URL
let path = window.location.pathname;
let parts = path.split("/");
let budget_id = parts[parts.length - 1];

if (new_expense_form_expenses && budget_id && submit_expenses) {
  submit_expenses.addEventListener("click", async (event) => {
    event.preventDefault();
    const success_expense_message: HTMLDivElement | null =
      document.querySelector("div.alert.alert-success.success-submit");
    const error_expense_message: HTMLDivElement | null = document.querySelector(
      "div.alert.alert-danger.error-submit"
    );
    const expenseType = new_expense_form_expenses.expenseType.value;
    const amount = +new_expense_form_expenses.amount.value;
    const description = new_expense_form_expenses.description.value;

    if (
      success_expense_message &&
      error_expense_message &&
      expenseType &&
      amount &&
      description
    ) {
      success_expense_message.style.display = "none";
      success_expense_message.textContent = "";
      error_expense_message.style.display = "none";
      error_expense_message.textContent = "";

      if (amount <= 0) {
        error_expense_message.style.display = "block";
        error_expense_message.textContent =
          "The expense cannot be 0 or negative!";
        setTimeout(() => {
          error_expense_message.style.display = "none";
          error_expense_message.textContent = "";
        }, 5000);
      } else {
        try {
          const result = await fetch(`/finance/submit-expenses/${budget_id}`, {
            method: "POST",
            body: JSON.stringify({
              expenseType: expenseType,
              amount: +amount,
              description: description,
            }),
            headers: { "Content-Type": "application/json" },
          });

          const data = await result.json();

          if (data.success) {
            success_expense_message.style.display = "block";
            success_expense_message.textContent = data.success.msg;

            const updatedBudget = data.success.updatedBudget;
            if (updatedBudget) {
              if (
                capital_balance_table &&
                entertainment_balance_table &&
                eatout_balance_table
              ) {
                capital_balance_table.textContent = `$${updatedBudget.capitalBalance}`;
                entertainment_balance_table.textContent = `$${updatedBudget.entertainmentBalance}`;
                eatout_balance_table.textContent = `$${updatedBudget.eatoutBalance}`;
              }
            }

            setTimeout(() => {
              success_expense_message.style.display = "none";
              success_expense_message.textContent = "";
            }, 5000);

            const all_inputs_expenses: NodeListOf<HTMLInputElement> | null =
              document.querySelectorAll("#new_expense_form_expenses input");
            if (all_inputs_expenses) {
              all_inputs_expenses.forEach((input) => {
                input.value = "";
              });
            }
          }

          if (data.errors) {
            error_expense_message.style.display = "block";
            error_expense_message.textContent = data.errors.msg;

            setTimeout(() => {
              error_expense_message.style.display = "none";
              error_expense_message.textContent = "";
            }, 5000);
          }
        } catch (error) {
          console.log("Posting expenses failed!", error);
        }
      }
    }
  });
}
