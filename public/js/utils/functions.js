export const setDisplayElement = (elements, value) => {
    elements.forEach((element) => {
        element.style["display"] = value;
    });
};
export const check_sum_budget = (sum_budget, income, element) => {
    const difference = sum_budget - income;
    if (difference > 0) {
        element.style.display = "block";
        element.textContent = `Your budget is more than your income! (Deficit: $${difference})`;
    }
    else if (difference < 0) {
        element.style.display = "block";
        element.textContent = `Your income is more than your budget! (Surplus: $${difference})`;
    }
    else {
        return true;
    }
    setTimeout(() => {
        element.style.display = "none";
    }, 5000);
    return false;
};
export const modifyCreatedInputs = (inputElements, placeholders) => {
    let i = 0;
    inputElements.forEach((inputElement) => {
        inputElement.className = "form-control";
        inputElement.placeholder = placeholders[i];
        i++;
    });
    return;
};
export const gatherDayPlanInfo = (inputDivs) => {
    let dayPlanMoves = [];
    inputDivs.forEach((inputDiv) => {
        const inputElements = inputDiv.querySelectorAll("input");
        let infoValues = { title: "", set: 0, rep: 0 };
        let j = 0;
        inputElements.forEach(inputElement => {
            if (j === 0) {
                infoValues["title"] = inputElement.value;
            }
            else if (j === 1) {
                infoValues["set"] = +inputElement.value;
            }
            else {
                infoValues["rep"] = +inputElement.value;
            }
            j++;
        });
        dayPlanMoves.push(infoValues);
    });
    return dayPlanMoves;
};
//# sourceMappingURL=functions.js.map