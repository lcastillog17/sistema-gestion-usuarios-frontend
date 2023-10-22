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

  const userForm = document.getElementById("user-form");

  // Obtiene el ID del usuario que se desea editar (puedes pasarlo como parámetro en la URL o mediante localStorage).
  const selectedUserId = localStorage.getItem("selectedUserId"); // Supongamos que has almacenado el ID previamente.

  if (selectedUserId) {
    // Realizar una solicitud al servidor para obtener los detalles del usuario con el ID proporcionado.
    fetch(`${API_URL}/users/${selectedUserId}`, {
      method: "GET",
      headers: {
        Authorization: token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // Llena los campos del formulario con los datos del usuario.
        document.getElementById("username").value = data.username;
        document.getElementById("email").value = data.email;
        document.getElementById("roles").value = data.roles;
      })
      .catch((error) =>
        console.error("Error al obtener detalles del usuario:", error)
      );
  }

  userForm.addEventListener("submit", function (e) {
    e.preventDefault();
    saveChanges(selectedUserId);
  });
});

function saveChanges(selectedUserId) {
  // Obtener los valores de los campos del formulario.
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const roles = document.getElementById("roles").value.split(",").map((item) => item.trim());

  // Crear un objeto con los datos del formulario.
  const formData = {
    username,
    email,
    password,
    roles,
  };

  const url = selectedUserId ? `${API_URL}/users/${selectedUserId}` : `${API_URL}/users`;
  const method = selectedUserId ? "PUT" : "POST";

  // Realizar una solicitud al servidor para actualizar el usuario.
  fetch(url, {
    method, // Puedes utilizar un método PUT para actualizar el usuario.
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    },
    body: JSON.stringify(formData),
  })
    .then((response) => {
      if (response.ok) {
        alert("Cambios guardados exitosamente.");
        // Puedes redirigir al usuario a la página de visualización de usuarios individuales o a otra página deseada.
      } else {
        alert("Error al guardar los cambios. Inténtalo de nuevo.");
      }
    })
    .catch((error) => console.error("Error al guardar los cambios:", error))
    .finally(() => {
      window.location.href = "../index.html";
    });
}
