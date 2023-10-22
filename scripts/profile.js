const API_URL = "http://localhost:3000/api/v1";

function cleanLocalStorage() {
  localStorage.removeItem("token");
  localStorage.removeItem("loggedUserId");
  localStorage.removeItem("selectedUserId");
}

async function isExistingProfile(profileId) {
  return await fetch(`${API_URL}/profiles/${profileId}`, {
    method: "GET",
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.user_id) {
        return true;
      } else {
        return false;
      }
    })
    .catch((error) => console.error("Error:", error));
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

  const profileForm = document.getElementById("profile-form");

  // Obtiene el ID del registro que se desea editar (puedes pasarlo como parámetro en la URL o mediante localStorage).
  const selectedUserId = localStorage.getItem("selectedUserId"); // Supongamos que has almacenado el ID previamente.
  document.getElementById("user_id").value = loggedUserId;

  if (selectedUserId) {
    // Realizar una solicitud al servidor para obtener los detalles del registro con el ID proporcionado.
    fetch(`${API_URL}/profiles/${selectedUserId}`, {
      method: "GET",
      headers: {
        Authorization: token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.user_id) {
            document.getElementById("first_name").value = data.first_name;
            document.getElementById("last_name").value = data.last_name;
            document.getElementById("birthdate").value = new Date(data.birthdate).toISOString().split('T')[0];
            document.getElementById("profile_picture").value = data.profile_picture;
        }
      })
      .catch((error) =>
        console.error("Error al obtener detalles del registro:", error)
      );
  }

  profileForm.addEventListener("submit", function (e) {
    e.preventDefault();
    saveChanges(selectedUserId);
  });
});

async function saveChanges(selectedUserId) {
  // Obtener los valores de los campos del formulario.
    const first_name = document.getElementById("first_name").value;
    const last_name = document.getElementById("last_name").value;
    const birthdate = document.getElementById("birthdate").value;
    const profile_picture = document.getElementById("profile_picture").value;

  // Crear un objeto con los datos del formulario.
  const formData = {
    first_name,
    last_name,
    birthdate,
    profile_picture,
  };

  const method = await isExistingProfile(selectedUserId) ? "PUT" : "POST";

  // Realizar una solicitud al servidor para actualizar el registro.
  fetch(`${API_URL}/profiles/${selectedUserId}`, {
    method, // Puedes utilizar un método PUT para actualizar el registro.
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    },
    body: JSON.stringify(formData),
  })
    .then((response) => {
      if (response.ok) {
        alert("Cambios guardados exitosamente.");
        // Puedes redirigir al usuario a la página de visualización de registros individuales o a otra página deseada.
      } else {
        alert("Error al guardar los cambios. Inténtalo de nuevo.");
      }
    })
    .catch((error) => console.error("Error al guardar los cambios:", error))
    .finally(() => {
      window.location.href = "../index.html";
    });
}
