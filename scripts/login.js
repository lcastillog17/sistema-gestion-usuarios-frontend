const API_URL = "http://localhost:3000/api/v1";

document.addEventListener("DOMContentLoaded", function () {
  const token = localStorage.getItem("token");
  if (token) {
    window.location.href = "../index.html";
  }

  const loginForm = document.getElementById("login-form");

  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch(`${API_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.token) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("loggedUserId", data.userId);
          localStorage.setItem("selectedUserId", data.userId);
          window.location.href = "../index.html";
        } else {
          alert("Error en el login. Inténtalo de nuevo.");
        }
      });
  });
});
