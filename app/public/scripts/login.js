const error = document.getElementsByClassName("error")[0];

document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const user = document.getElementById("user").value;
    const password = document.getElementById("password").value;
  
    const res = await fetch("http://localhost:4000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ user, password })
    });
    
    error.classList.toggle("display", true);
    if(!res.ok) return error.classList.toggle("display", false);

    const resJSON = await res.json();

    if(resJSON.redirect){
        window.location.href = resJSON.redirect
    }


  });
  