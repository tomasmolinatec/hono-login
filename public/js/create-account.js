async function hashInput(inputString) {
    const encoder = new TextEncoder();
    const data = encoder.encode(inputString);

    const hashBuffer = await crypto.subtle.digest('SHA-256', data);

    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
    return hashHex;
}


const url = "http://localhost:3000/";

const caButton = document.getElementById('ca-btn');
const errorMessage = document.getElementById('error-message');
const successMessage = document.getElementById('success-message');

caButton.addEventListener("click", async  (event) => {

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const password2 = document.getElementById("password2").value;


  if (password !== password2)
  {
    showError("Passwords have to match!");
    // console.log("Password have to match!")
    return;
  }

  if (password.length < 8)
  {
    showError("Password has to be at least 8 characters");
    // console.log("Password has to be at least 8 characters")
    return;
  }

  if (username.length < 5)
  {
    showError("Username has to be at least 5 characters");
    // console.log("Usernem has to be at least 5 characters")
    return;
  }

 
  // console.log(username, password);
  const hashedpassword = await hashInput(password);

  let response = await fetch(url + "users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
      password: hashedpassword,
    }),
  })
    .catch((error) => {
      console.error("Error:", error); 
    });

    // console.log(await response.json())
    response = await response.json();

    if (!response.status)
    {
      showError(response.message);
      // console.log(response.message)
      return;
    }
    else
    {
      showSucc("Succesfully created your account!");
      // console.log("Succesfully created your account!")
      return;
    }

});

function showError(e)
{
  successMessage.style.display = 'none';
  errorMessage.innerHTML = e;
  errorMessage.style.display = 'block'; 
}

function showSucc(e)
{
  errorMessage.style.display = 'none';
  successMessage.innerHTML = e;
  successMessage.style.display = 'block'; 
}
