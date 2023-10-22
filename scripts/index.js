const API_URL = "http://localhost:3000/api/v1";

function cleanLocalStorage() {
  localStorage.removeItem("token");
  localStorage.removeItem("loggedUserId");
  localStorage.removeItem("selectedUserId");
}

document.addEventListener("DOMContentLoaded", function () {
  const logoutButton = document.getElementById("logout-button");
  logoutButton.addEventListener("click", function (e) {
    e.preventDefault();
    cleanLocalStorage();
    window.location.href = "./pages/login.html";
  });

  const token = localStorage.getItem("token");
  const loggedUserId = localStorage.getItem("loggedUserId");
  if (!token || !loggedUserId) {
    cleanLocalStorage();
    window.location.href = "./pages/login.html";
    alert("No se ha iniciado sesión.");
  }

  localStorage.setItem("selectedUserId", localStorage.getItem("loggedUserId"));

  // Verificar si el token está presente y realizar una solicitud al servidor para obtener los datos del usuario logueado.
  fetch(`${API_URL}/users/${loggedUserId}`, {
    method: "GET",
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.username && data.email) {
        const userInfo = document.getElementById("user-info");
        userInfo.innerHTML = `Usuario: ${data.username}, Correo Electrónico: ${data.email}`;
      } else {
        cleanLocalStorage();
        window.location.href = "./pages/login.html";
        alert("Error al obtener los datos del usuario.");
      }
    })
    .catch((error) => {
      cleanLocalStorage();
      window.location.href = "./pages/login.html";
      alert("Error al obtener los datos del usuario: ", error.message);
    });
});
