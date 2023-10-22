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
    window.location.href = "./login.html";
  });

  const token = localStorage.getItem("token");
  const loggedUserId = localStorage.getItem("loggedUserId");
  if (!token || !loggedUserId) {
    cleanLocalStorage();
    window.location.href = "./login.html";
    alert("No se ha iniciado sesión.");
  }

  const userList = document.getElementById("user-list");

  localStorage.setItem("selectedUserId", localStorage.getItem("loggedUserId"));

  // Realizar una solicitud al servidor para obtener la lista de registros.
  fetch(`${API_URL}/users`, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  })
    .then((response) => response.json())
    .then((users) => {
      if (users.message) {
        alert(users.message);
        window.location.href = "../index.html";
      } else {
        users.forEach((user) => {
          const row = document.createElement("tr");
          row.innerHTML = `
                  <td>${user.username}</td>
                  <td>${user.email}</td>
                  <td>
                      <button onclick="deleteUser('${user._id}')">Eliminar Usuario</button>
                      <button onclick="viewUser('${user._id}')">Ver Usuario</button>
                      <button onclick="viewProfile('${user._id}')">Ver Perfil</button>
  
                  </td>
              `;
          userList.appendChild(row);
        });
      }
    })
    .catch((error) =>
      console.error("Error al obtener la lista de registros:", error)
    );
});

function deleteUser(selectedUserId) {
  if (confirm("¿Estás seguro de que quieres eliminar este registro?")) {
    fetch(`${API_URL}/users/${selectedUserId}`, {
      method: "DELETE",
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        window.location.reload();
        alert(data.message);
      })
      .catch((error) => {
        console.error("Error al eliminar el registro:", error);
        alert("Error al eliminar el registro.");
      });
  }
}

function viewUser(selectedUserId) {
  localStorage.setItem("selectedUserId", selectedUserId);
  window.location.href = "./user.html";
}

function viewProfile(selectedUserId) {
  localStorage.setItem("selectedUserId", selectedUserId);
  window.location.href = "./profile.html";
}
