let boxes = document.querySelectorAll(".box");
let resetbtn = document.querySelector("#reset-btn");
let msg = document.querySelector("#msg");
let msgcontainer = document.querySelector(".msg-container")
let check = true;


const winpattern = [
    [0,1,2],
    [0,3,6],
    [0,4,8],
    [1,4,7],
    [2,5,8],
    [2,4,6],
    [3,4,5],
    [6,7,8],

]


boxes.forEach((box) => {
    box.addEventListener("click", () => {
        if(check){
            box.innerHTML = "O";
            check = false;
        }else{
            box.innerHTML = "X";
            check = true;
        }
        box.disabled = true;

        checkwinner();
    });
});

const disa = () => {
    for(let dis of boxes){
        dis.disabled = true;
    }
}
const enableboxes =() => {
    for(let box of boxes){
        box.disabled = false;
        box.innerHTML = "";
    }
}
const showwinner = (winner) =>{
    msg.innerHTML = `congratulation, winner is ${winner}`;
    msgcontainer.classList.remove("hide");
    disa()
}

const checkwinner = () => {
    for (let pattern of winpattern){
      let pos1val = boxes[pattern[0]].innerHTML
      let pos2val = boxes[pattern[1]].innerHTML 
      let pos3val = boxes[pattern[2]].innerHTML   
      if(pos1val != "" && pos1val != "" && pos2val != ""){
        if(pos1val === pos2val && pos2val === pos3val){
           showwinner(pos1val); 
        }
      }
    }
};
 const resetgame = () => {
    check = true;
    enableboxes();
    msgcontainer.classList.add("hide")
 }

 resetbtn.addEventListener("click",resetgame)