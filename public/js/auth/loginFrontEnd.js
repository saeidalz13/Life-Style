const inputFieldsLogin = document.querySelectorAll("input");
if (inputFieldsLogin !== null) {
    inputFieldsLogin.forEach((field) => {
        field.addEventListener("focus", () => {
            field.style.backgroundColor = "#FFE6A4";
        });
        field.addEventListener("blur", () => {
            field.style.backgroundColor = "";
        });
    });
}
else {
    console.log("Input field coloring failed!");
}
const form_login = document.querySelector("form");
if (form_login) {
    form_login.addEventListener("submit", async (event) => {
        event.preventDefault();
        const email = form_login.email.value;
        const password = form_login.password.value;
        const login_error = document.querySelector("#login_error");
        const setLoginError = (disp, text, element = login_error) => {
            if (element) {
                element.style.display = disp;
                element.textContent = text;
            }
        };
        // const emailError = document.querySelector(".email_error") as HTMLDivElement;
        // const passwordError = document.querySelector(
        //   ".password_error"
        // ) as HTMLDivElement;
        if (login_error) {
            setLoginError("none", "");
            if (!password) {
                setLoginError("none", "Enter password please!");
            }
            else {
                try {
                    const res = await fetch("/login", {
                        method: "POST",
                        body: JSON.stringify({ email: email, password: password }),
                        headers: { "Content-Type": "application/json" },
                    });
                    const data = await res.json();
                    console.log(data);
                    if (data.user) {
                        location.assign("/");
                    }
                    if (data.errors) {
                        if (data.errors.email) {
                            setLoginError("block", data.errors.email);
                            return;
                        }
                        else if (data.errors.password) {
                            setLoginError("block", data.errors.password);
                            return;
                        }
                    }
                }
                catch (err) {
                    console.log(err);
                }
            }
        }
        else {
            console.log("Error DIV element for password and email could not be fetched!");
        }
    });
}
else {
    console.log("Form element could not be fetched!");
}
export {};
//# sourceMappingURL=loginFrontEnd.js.map