"use strict"

const url = "http://localhost:3000/";

const jwt = localStorage.getItem('jwt');
if (!jwt) {
    window.location.href = url;
} 
// else {
//     console.log('JWT found:', jwt);
// }

const [headerBase64, payloadBase64, signature] = jwt.split('.');


const decodeBase64 = (base64) => {
  return JSON.parse(atob(base64.replace(/-/g, '+').replace(/_/g, '/')));
};

const payload = decodeBase64(payloadBase64);

// console.log(payload)

const welcomeText = document.getElementById("welcome");

welcomeText.innerHTML = `Welcome ${payload.username}!`

