let addBtn = document.querySelector("#add-btn");
let inputField = document.querySelector("#input");



addBtn.addEventListener("click", addchapter);
function addchapter(e) {
    let currentbtn = e.currentTarget;
    let currentinput = currentbtn.previousElementSibling;

    let newli = document.createElement("li");
    newli.classList.add("list-group-item","list-group-item-action", "d-flex", "justify-content-between", "align-items-start", "mb-2",);
    newli.classList.add("col-6");
    newli.textContent = currentinput.value;

    let chapterList = document.querySelector("#chapterList");
    chapterList.appendChild(newli);

    let editbtn = document.createElement("button");
    editbtn.classList.add("btn","btn-warning","d-flex","edit");
    editbtn.textContent = "Edit";
   

    let deletbtn = document.createElement("button");
    deletbtn.classList.add("btn","btn-danger",);
    deletbtn.textContent = "Remove";

    newli.appendChild(editbtn);
    newli.appendChild(deletbtn);


    deletbtn.addEventListener("click", function () {
        newli.remove();
    });

    editbtn.addEventListener("click", function () {
        let updatedText = prompt("Edit the chapter:", newli.firstChild.textContent);
        if (updatedText !== null && updatedText.trim() !== "") {
            newli.firstChild.textContent = updatedText;
            newli.appendChild(editbtn);
            newli.appendChild(deletbtn);
        }
    });

    }
    // Ensure the edit button and delete button are re-added after editing
    inputField.addEventListener("input", function () {
        addBtn.disabled = inputField.value.trim() === "";
    });

    // Initially disable the button if the input is empty
    addBtn.disabled = inputField.value.trim() === "";