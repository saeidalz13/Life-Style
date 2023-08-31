const inputFields = document.querySelectorAll("input");

if (inputFields !== null) {
  inputFields.forEach((field) => {
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

const form_signup = document.querySelector("form");

if (form_signup !== null) {
  form_signup.addEventListener("keyup", () => {
    const password = form_signup.password.value;
    const confirmPassword = form_signup.confirm_password.value;

    const passwordError = document.querySelector(".password_error");
    const confirmPasswordError = document.querySelector(
      ".confirm_password_error"
    );

    if (passwordError) {
      if (password.length == 0) {
        passwordError.textContent = "";
      } else if (password.length < 10) {
        passwordError.textContent = "Minimum 10 Characters";
      } else {
        passwordError.textContent = "";
      }
    }
    if (confirmPasswordError) {
      if (password !== confirmPassword && confirmPassword.length !== 0) {
        confirmPasswordError.textContent = "MUST match the password";
      } else {
        confirmPasswordError.textContent = "";
      }
    }
  });

  form_signup.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = form_signup.email.value
    const password = form_signup.password.value
    const confirmPassword = form_signup.confirm_password.value
    
    const signupError: HTMLElement = document.querySelector("#signup_error")!

    if (password === confirmPassword) {
      try {
        const result = await fetch("/signup", {
          method: "POST",
          body: JSON.stringify({
            email:email,
            password:password
          }),
          headers: { "Content-Type": "application/json" }
        })

        const data = await result.json()

        if (data.user) {
          location.assign("/")

        } else if (data.errors) {
          if (signupError) {
            signupError.style.display = "block"
            signupError.textContent = data.errors.email
          }
        }

      } catch (error) {
        console.log(error)
        if (signupError) {
          signupError.style.display = "block"
          signupError.textContent = "Something went wrong; Please try again later!"

          setTimeout(() => {
            signupError.style.display = "none"
            signupError.textContent = ""
          }, 5000)
        }
      }
    } else {
        if (signupError) {
          signupError.style.display = "block"
          signupError.textContent = "Passwords MUST match!"
      }
      setTimeout(() => {
        signupError.style.display = "none"
        signupError.textContent = ""
      }, 5000)
    } 
  });
}
