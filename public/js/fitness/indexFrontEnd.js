import { setDisplayElement } from "../utils/functions.js";
import { fadeGray } from "../utils/constants.js";
const edit_fitplan_btn = document.querySelector("#edit_fitplan_btn");
const create_fitplan_btn = document.querySelector("#create_fitplan_btn");
const show_fitplan_btn = document.querySelector("#show_fitplan_btn");
const create_fitplan_template = document.querySelector("#create_fitplan_template");
const show_plan_template = document.querySelector("#show_plan_template");
if (create_fitplan_btn && show_fitplan_btn) {
    create_fitplan_btn.addEventListener("click", () => {
        setDisplayElement([create_fitplan_btn, show_fitplan_btn, edit_fitplan_btn], "none");
        // Getting all the elements inside the template and append it to the body
        const clone = document.importNode(create_fitplan_template.content, true);
        document.body.append(clone);
        const create_fitplan_form = document.querySelector("#create_fitplan_form");
        if (create_fitplan_form) {
            create_fitplan_form.addEventListener("submit", async (event) => {
                event.preventDefault();
                const title = create_fitplan_form.planTitle.value;
                const days = +create_fitplan_form.days.value;
                const result = await fetch("/fitness", {
                    method: "POST",
                    body: JSON.stringify({
                        title: title,
                        days: days,
                    }),
                    headers: { "Content-Type": "application/json" },
                });
                const data = await result.json();
                console.log(data);
                if (data.success) {
                    console.log(data.success.id);
                    const success_expense_message = document.querySelector("div.alert.alert-success.success-submit");
                    if (success_expense_message) {
                        success_expense_message.style.display = "block";
                        success_expense_message.textContent = "Plan created! Redirecting to design page...";
                        setTimeout(() => {
                            location.assign(`/fitness/design-plan/${data.success.id}`);
                        }, 2000);
                    }
                }
                if (data.errors) {
                    const error_expense_message = document.querySelector("div.alert.alert-danger.error-submit");
                    if (error_expense_message) {
                        error_expense_message.style.display = "block";
                        error_expense_message.textContent = data.errors.msg;
                        setTimeout(() => {
                            error_expense_message.style.display = "none";
                            error_expense_message.textContent = "";
                        }, 5000);
                    }
                }
            });
        }
    });
    // Showing all the plans
    show_fitplan_btn.addEventListener("click", () => {
        const clone = document.importNode(show_plan_template.content, true);
        document.body.style.backgroundColor = fadeGray;
        document.body.append(clone);
        setDisplayElement([create_fitplan_btn, show_fitplan_btn, edit_fitplan_btn], "none");
    });
}
//# sourceMappingURL=indexFrontEnd.js.map