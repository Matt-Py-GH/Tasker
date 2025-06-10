const error = document.getElementsByClassName("error")[0];

document.getElementById("register-form").addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const user = document.getElementById("user").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
  
    const res = await fetch("http://localhost:4000/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ user, email, password })
    });

    const resJSON = await res.json();

    if (  resJSON.status === "Password short"
       || resJSON.status === "Short name"
       || !res.ok
       ) {return error.classList.toggle("display", false)}

    else if (resJSON.redirect) {
      return  window.location.href = resJSON.redirect;
    }
});

  