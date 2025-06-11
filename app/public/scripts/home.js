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
      return null;  // O lo que prefieras para manejar el error
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
    ul.innerHTML = "<li>No tienes tareas aún.</li>";
    return;
  }
  console.log(tareas.length)
  
tareas.forEach(tarea => {
  const li = document.createElement("li");
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
