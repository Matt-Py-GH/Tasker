let tareaSeleccionada;
let tareasUsuario = [];

async function obtenerUsername() {
    try {
      const response = await fetch('/api/usuario', {
        method: 'GET',
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('No autorizado');
      }
      const data = await response.json();
      return data.username;
    } catch (error) {
      console.error('Error al obtener username:', error);
      return null;
    }
  }

function GetTasksByUser() {
  return fetch("/api/tareas", {
    method: "GET",
    credentials: "include"
  }).then(response => {
    if (!response.ok) {
      throw new Error("No autorizado");
    }
    return response.json();
  });
}
  
  

document.getElementById("logout").addEventListener("click", () =>{
    document.cookie = 'jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    window.location.href = "/"
})

const titleUser = document.getElementById("titulo")
const spanTest = document.getElementById("span")

obtenerUsername().then(username => {
  if (username) {
    titleUser.innerText += " " + username;
  }
  else{
      titleUser.innerText = "Hello there!"
  }
  });


const ulIncompletas = document.getElementById("lista-tareas");
const ulCompletas = document.getElementById("tareas-completadas");

GetTasksByUser().then(tareas => {
  tareasUsuario = tareas;

  ulIncompletas.innerHTML = "";
  ulCompletas.innerHTML = "";

  if (!tareas || tareas.length === 0) {
    ulIncompletas.innerHTML = "<li>No tienes tareas aún.</li>";
    return;
  }

  tareas.forEach(tarea => {
    const li = document.createElement("li");
    
    li.innerText = tarea.nombre;
    li.dataset.id = tarea.id;

    li.addEventListener("click", () => {
      tareaSeleccionada = tarea
      const cardTask = document.getElementById("card-task");
      cardTask.classList.remove("card-none");
      document.getElementById("task-name-edit").value = tarea.nombre
      document.getElementById("task-desc-edit").value = tarea.descripcion
      document.getElementById("task-priority-edit").value = tarea.prioridad
      document.getElementById("task-state-edit").value = tarea.estado
    });

    if (tarea.estado == 2) {
      ulCompletas.appendChild(li);
    } else {
      ulIncompletas.appendChild(li);
    }
  });
}).catch(error => {
  console.error(error);
});



const addTask = document.getElementById("addTask").addEventListener("click", AddTask)

function AddTask() {
  const nombre = document.getElementById("task-name").value;
  const descripcion = document.getElementById("task-desc").value;
  const prioridad = parseInt(document.getElementById("task-priority").value);

  if (!nombre) {
    return;
  }

  fetch("/api/tareas", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      nombre,
      descripcion,
      prioridad
    })
  })
  .then(res => {
    if (!res.ok) throw new Error("Error al agregar tarea.");
    return res.json();
  })
  .then(data => {
    console.log("Tarea agregada:", data);
    window.location.reload();
  })
  .catch(err => {
    console.error(err);
  });
}

document.querySelector(".delete").addEventListener("click", () => {
  if (!tareaSeleccionada) return;

  fetch(`/api/tareas/${tareaSeleccionada.id}`, {  
    method: "DELETE",
    credentials: "include"
  })
    .then(res => {
      if (!res.ok) throw new Error("Error al eliminar tarea.");

      // Eliminar de la lista local
      tareasUsuario = tareasUsuario.filter(t => t.id !== tareaSeleccionada.id);

      // Eliminar del DOM
      const li = document.querySelector(`li[data-id='${tareaSeleccionada.id}']`);
      if (li) {li.remove(); console.log("DELETED")}

      // Ocultar tarjeta
      document.getElementById("card-task").classList.add("card-none");

      // Reset
      tareaSeleccionada = null;
    })
    .catch(err => {
      console.error("Error eliminando tarea:", err);
 
    });
});

document.querySelector(".save").addEventListener("click", () => {
  if (!tareaSeleccionada) return;

  const nuevoNombre = document.getElementById("task-name-edit").value;
  const nuevaDescripcion = document.getElementById("task-desc-edit").value;
  const nuevaPrioridad = parseInt(document.getElementById("task-priority-edit").value);
  const nuevoEstado = parseInt(document.getElementById("task-state-edit").value);

  fetch(`/api/tareas/${tareaSeleccionada.id}`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      nombre: nuevoNombre,
      descripcion: nuevaDescripcion,
      estado:nuevoEstado,
      prioridad: nuevaPrioridad
    })
  })
    .then(res => {
      if (!res.ok) throw new Error("Error al actualizar tarea.");

      // Actualizar tarea localmente
      tareaSeleccionada.nombre = nuevoNombre;
      tareaSeleccionada.descripcion = nuevaDescripcion;
      tareaSeleccionada.prioridad = nuevaPrioridad;
      tareaSeleccionada.estado = nuevoEstado;

      console.log(tareaSeleccionada)

      const li = document.querySelector(`li[data-id='${tareaSeleccionada.id}']`);
      if (li) li.innerText = nuevoNombre;

      window.location.reload()
      tareaSeleccionada = null;
    })
    .catch(err => {
      console.error("Error actualizando tarea:", err);
      alert("No se pudo guardar la tarea.");
    });
});



