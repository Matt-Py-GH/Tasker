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
      return data.username;  // Devuelve el username
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
  ulIncompletas.innerHTML = "";
  ulCompletas.innerHTML = "";
  
  if (!tareas || tareas.length === 0) {
    ulIncompletas.innerHTML = "<li>No tienes tareas aún.</li>";
    return;
  }
  
  tareas.forEach(tarea => {
    const li = document.createElement("li");
    li.addEventListener("click", () => {
      const cardTask = document.getElementById("card-task");
      cardTask.classList.toggle("card-none", false)});
    li.innerText = tarea.nombre
    if(tarea.estado == "Completada"){
      ulCompletas.appendChild(li);
    }
    else{
      ulIncompletas.appendChild(li)
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
    alert("El nombre de la tarea es obligatorio.");
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
    alert("Hubo un error al agregar la tarea.");
  });
}


function DeleteTask(){

}

