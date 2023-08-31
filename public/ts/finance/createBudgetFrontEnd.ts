const check_sum_budget = (
  sum_budget: number,
  income: number,
  element: HTMLDivElement
): boolean => {
  const difference = sum_budget - income;
  if (difference > 0) {
    element.style.display = "block";
    element.textContent = `Your budget is more than your income! (Deficit: $${difference})`;
  } else if (difference < 0) {
    element.style.display = "block";
    element.textContent = `Your income is more than your budget! (Surplus: $${difference})`;
  } else {
    return true;
  }
  setTimeout(() => {
    element.style.display = "none";
  }, 5000);
  return false;
};

const inputFieldsCreateBudget = document.querySelectorAll("input");

if (inputFieldsCreateBudget !== null) {
  inputFieldsCreateBudget.forEach((field) => {
    field.addEventListener("focus", () => {
      field.style.backgroundColor = "#FFE6A4";
    });

    field.addEventListener("blur", () => {
      field.style.backgroundColor = "";
    });
  });
} else {
  console.log("Input field coloring failed!");
}

const formCreateBudget: HTMLFormElement | null = document.querySelector("form");

if (formCreateBudget) {
  formCreateBudget.addEventListener("submit", async (event) => {
    event.preventDefault();

    const create_budget_error: HTMLDivElement | null = document.querySelector(
      "#create_budget_error"
    );

    let anyFieldEmpty = false;
    inputFieldsCreateBudget.forEach((input) => {
      input.style.backgroundColor = "";
      if (input.value.length === 0) {
        anyFieldEmpty = true;
        input.style.backgroundColor = "#FFCCCC";
      }
    });

    if (anyFieldEmpty && create_budget_error) {
      create_budget_error.style.display = "block";
      create_budget_error.textContent =
        "Fill in all the fields before submission!";

      setTimeout(() => {
        create_budget_error.style.display = "none";
      }, 5000);
    }

    const startDate: string = formCreateBudget.start_date.value;
    const endDate: string = formCreateBudget.end_date.value;
    const income: number = +formCreateBudget.income.value;
    const savings: number = +formCreateBudget.savings.value;
    const capital: number = +formCreateBudget.capital.value;
    const entertainment: number = +formCreateBudget.entertainment.value;
    const eatout: number = +formCreateBudget.eatout.value;

    const sum_budget = savings + capital + entertainment + eatout;

    if (create_budget_error) {
      const valid_budget = check_sum_budget(
        sum_budget,
        income,
        create_budget_error
      );
      if (valid_budget) {
        try {
          const result = await fetch("/finance/create-budget", {
            method: "POST",
            body: JSON.stringify({
              startDate: startDate,
              endDate: endDate,
              income: income,
              savings: savings,
              capital: capital,
              entertainment: entertainment,
              eatout: eatout,
            }),
            headers: { "Content-Type": "application/json" },
          });

          const data = await result.json();

          if (data.errors) {
            create_budget_error.style.display = "block";
            create_budget_error.textContent = data.errors.msg;

            setTimeout(() => {
              create_budget_error.style.display = "none";
              create_budget_error.textContent = ""
            }, 5000);
          }

          if (data.success) {
            const create_budget_success: HTMLDivElement | null =
              document.querySelector("#create_budget_success");

            if (create_budget_success) {
              inputFieldsCreateBudget.forEach((input) => {
                create_budget_success.textContent = data.success.msg;
                create_budget_success.style.display = "block";
                input.value = "";
              });

              setTimeout(() => {
                create_budget_success.style.display = "none";
                create_budget_success.textContent = ""
              }, 5000);
            }
          }
        } catch (err) {
          console.log(err);
        }
      }
    }
  });
}

