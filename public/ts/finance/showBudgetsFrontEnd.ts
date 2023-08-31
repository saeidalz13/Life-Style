const delete_budget_showBudgets: HTMLButtonElement | null =
  document.querySelector("#delete_budget_showBudgets");
const delete_budget_error: HTMLDivElement | null = document.querySelector(
  "#delete_budget_error"
);
const delete_budget_success: HTMLDivElement | null = document.querySelector(
  "#delete_budget_success"
);

if (delete_budget_showBudgets) {
  delete_budget_showBudgets.addEventListener("click", async () => {
    let path = window.location.pathname;
    let parts = path.split("/");
    let budget_id = parts[parts.length - 1];

    if (delete_budget_success && delete_budget_error) {
      const result = await fetch(`/finance/show-budgets/${budget_id}`, {
        method: "DELETE",
      });
      const data = await result.json();

      if (data.success) {
        delete_budget_success.style.display = "block";
        delete_budget_success.textContent = data.success.msg;

        location.assign("/finance");
      }

      if (data.errors) {
        delete_budget_error.style.display = "block";
        delete_budget_error.textContent = data.errors.msg;

        setTimeout(() => {
          delete_budget_error.style.display = "none";
          delete_budget_error.textContent = "";
        }, 5000);
      }
    }
  });
}
