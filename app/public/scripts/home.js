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
  

document.getElementById("logout").addEventListener("click", () =>{
    document.cookie = 'jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    window.location.href = "/"
})

const titleUser = document.getElementById("titulo")

obtenerUsername().then(username => {
    if (username) {
      titleUser.innerText += " " + username;
    }
    else{
        titleUser.innerText = "Hello there!"
    }
  });