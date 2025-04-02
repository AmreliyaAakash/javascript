let img = document.querySelector("#img");
let button = document.querySelector("#btn");

button.addEventListener('click', changeimg);
img.src = "img/off.png";
console.log("off");

  

function changeimg() {
    if (button.textContent.includes("Turn On")) {
      img.src = "img/on.png";
      button.textContent = "Turn Off";
    }else{
      img.src = "img/off.png";
      button.textContent = "Turn On";
    }
  }
  
  
