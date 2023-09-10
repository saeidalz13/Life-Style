import { modifyCreatedInputs, gatherDayPlanInfo } from "../utils/functions.js";

const design_plan_template: HTMLTemplateElement = document.querySelector(
  "#design_plan_template"
)!;

const daysButton: NodeListOf<HTMLButtonElement> = document.querySelectorAll(
  ".btn.btn-success.design-day-num"
)!;

const design_plan_form: HTMLFormElement =
  document.querySelector("#design_plan_form")!;

const design_plan_container: HTMLDivElement = document.querySelector(
  "#design_plan_container"
)!;

const desing_plan_btns_div: HTMLDivElement = document.querySelector(
  "#desing_plan_btns_div"
)!;

const submit_design_plan: HTMLButtonElement = document.querySelector(
  "#submit_design_plan"
)!;
const add_move: HTMLButtonElement = document.querySelector("#add_move")!;

daysButton.forEach((daybtn) => {
  daybtn.addEventListener("click", () => {
    daybtn.style.backgroundColor = "goldenrod";
    const dayBtnText = daybtn.innerText;
    const dayNum = +dayBtnText[dayBtnText.length - 1];

    daysButton.forEach((btn) => {
      if (+btn.innerText[btn.innerText.length - 1] !== dayNum) {
        btn.style.backgroundColor = "";
      }
    });

    design_plan_form.style.display = "block";
    desing_plan_btns_div.style.display = "block";
    const legend = design_plan_form.querySelector("legend")!;
    legend.innerText = `Day ${dayNum} Moves`;

    add_move.addEventListener("click", () => {
      const inputDiv = document.createElement("div");
      inputDiv.className = "input-group";

      const inputMove = document.createElement("input");
      const inputSet = document.createElement("input");
      const inputRep = document.createElement("input");
      modifyCreatedInputs(
        [inputMove, inputSet, inputRep],
        ["Enter move", "set", "rep"]
      );
      inputDiv.appendChild(inputMove);
      inputDiv.appendChild(inputSet);
      inputDiv.appendChild(inputRep);

      design_plan_form.appendChild(inputDiv);


    });
  });
});

submit_design_plan.addEventListener("click", async () => {
  const inputDivs: NodeListOf<HTMLDivElement> =
    document.querySelectorAll(".input-group");
  let dayPlanMoves = gatherDayPlanInfo(inputDivs);
  console.log(dayPlanMoves);

  // Extract day number
  const legend = design_plan_form.querySelector("legend")!;
  const day = +legend.innerText.split(" ")[1]

  let path = window.location.pathname;
  let parts = path.split("/");
  let planID = parts[parts.length - 1];

  const result = await fetch(`/fitness/design-plan/${planID}`, {
    method: "POST",
    body: JSON.stringify({
      planID: planID,
      day: day,
      dayPlanMoves: dayPlanMoves
    }),
    headers: { "Content-Type": "application/json" }
  });

  const data = await result.json()
});