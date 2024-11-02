const signUpBtn = document.getElementById("sign-up-btn");
const signInBtn = document.getElementById("sign-in-btn");
const container = document.querySelector(".container");
const signupForm = document.getElementById("signup-form");
const loginForm = document.getElementById("login-form");

signUpBtn.addEventListener("click", () => {
  container.classList.add("sign-up-mode");
});

signInBtn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
});

// Handle Sign Up
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("signup-email").value;
  const username = document.getElementById("signup-username").value;
  const phone = document.getElementById("signup-phone").value;
  const password = document.getElementById("signup-password").value;

  fetch("/signup/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": getCSRFToken(),
    },
    body: JSON.stringify({ email, username, phone, password }),
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((data) => {
          throw new Error(
            data.error || "Error during sign up. Please try again."
          );
        });
      }
      return response.json();
    })
    .then((data) => {
      if (data.success) {
        alert("Sign up successful! You can now log in.");
        signupForm.reset();
      } else {
        throw new Error(
          data.error || "Error during sign up. Please try again."
        );
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert(error.message);
    });
});

// Handle Login
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;

  fetch("/login/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": getCSRFToken(),
    },
    body: JSON.stringify({ username, password }),
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((data) => {
          throw new Error(
            data.error || "Error during login. Please try again."
          );
        });
      }
      return response.json();
    })
    .then((data) => {
      if (data.success) {
        localStorage.setItem("name", username);
        localStorage.setItem("done", "true");
        window.location.href = "/query/";
      } else {
        throw new Error(
          data.error || "Invalid username or password. Please try again."
        );
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert(error.message);
    });
});

// Function to retrieve CSRF token from cookies (necessary for Django)
function getCSRFToken() {
  let csrfToken = null;
  const cookies = document.cookie.split(";");
  cookies.forEach((cookie) => {
    const [name, value] = cookie.trim().split("=");
    if (name === "csrftoken") csrfToken = value;
  });
  return csrfToken;
}
