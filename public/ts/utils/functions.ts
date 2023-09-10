export const setDisplayElement = (
    elements: Array<HTMLButtonElement>,
    value: string
  ): void => {
    elements.forEach((element) => {
      element.style["display"] = value;
    });
  };


export  const check_sum_budget = (
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

export const modifyCreatedInputs = (
    inputElements: Array<HTMLInputElement>,
    placeholders: Array<string>
  ): void => {
    let i = 0;
    inputElements.forEach((inputElement) => {
      inputElement.className = "form-control";
      inputElement.placeholder = placeholders[i];
      i++;
    });
    return;
  }

export const gatherDayPlanInfo = (inputDivs: NodeListOf<HTMLDivElement>): TDayPlan => {
  let dayPlanMoves: any = []
  inputDivs.forEach((inputDiv) => {
      const inputElements = inputDiv.querySelectorAll("input")!;
      let infoValues = {title: "", set: 0, rep: 0}
      let j = 0
      inputElements.forEach(inputElement => {
          if (j === 0) {
              infoValues["title"] = inputElement.value
          } else if (j === 1) {
              infoValues["set"] = +inputElement.value
          } else {
              infoValues["rep"] = +inputElement.value
          }
          j++;
      });
      dayPlanMoves.push(infoValues)
  })

  return dayPlanMoves
} 
  

type TDayPlan = {
  move: string;
  set: number;
  rep: number
}