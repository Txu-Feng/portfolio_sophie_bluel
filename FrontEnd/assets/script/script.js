let works;

async function fetchWorks() {
    try {
        const response = await fetch("http://" + window.location.hostname + ":5678/api/works");
        const data = await response.json();
        //console.log(data);
        displayWorks(data);
        works = data;
        //console.log(works);
    }
    catch (error) {
        console.log(error);
    }
}

async function fetchWorks() {
    try {
        const response = await fetch("http://" + window.location.hostname + ":5678/api/works");
        const data = await response.json();
        //console.log(data);
        displayWorks(data);
        works = data;
        //console.log(works);
    }
    catch (error) {
        console.log(error);
    }
}

fetchWorks();

const displayWorks = (data) => {
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";
    const modalGallery =  document.querySelector(".modal-gallery");
    modalGallery.innerHTML = "";
    data.forEach(element => {
        //console.log(element.id, element.title);

        const figure = document.createElement('figure');
        const modalFigure = document.createElement('figure');

        const img = document.createElement('img');
        img.src = element.imageUrl;
        img.alt = element.title;

        const modalImg = document.createElement('img');
        modalImg.src = element.imageUrl;
        modalImg.alt = element.title;

        figure.appendChild(img);
        modalFigure.appendChild(modalImg);

        const figcaption = document.createElement('figcaption');
        const modalFigcaption = document.createElement('figcaption');

        figcaption.textContent = element.title;
        modalFigcaption.textContent = "éditer";

        figure.appendChild(figcaption);
        modalFigure.appendChild(modalFigcaption);

        ///////////////////////////////////

        const workId = element.id;

        // const deleteButton = createButtonElement(['modal-delete-button']);
        const deleteButton = document.createElement("div");
        deleteButton.classList.add("modal-delete-button");
        // const deleteIcon = createIconElement("fa-solid","fa-trash-can");
        const deleteIcon = document.createElement("i");
        deleteIcon.classList.add("fa-solid","fa-trash-can");

        deleteButton.style.cursor = 'pointer';
        deleteButton.appendChild(deleteIcon);

        deleteButton.addEventListener('click', () => {
            //const confirmDeleteButton = createButtonElement(['confirm-delete'],"Confirmer suppression");
            const confirmDeleteButton = document.createElement("div");
            confirmDeleteButton.textContent = "Confirmer suppression";
            confirmDeleteButton.addEventListener("click", function() {
              //deleteWork(workId);
            const token = window.localStorage.getItem('token');
            fetch(`http://` + window.location.hostname + `:5678/api/works/${workId}`, {
                method: 'DELETE',
                headers: {
                'Authorization': `Bearer ${token}`,
                },
            }).then(response => {
                if (response.ok) {
                  // Refresh gallery display after deletion
                  //refreshGallery("#modal-gallery");
                  //refreshGallery(".gallery");
                  fetchWorks();
                } else if(response.status === 401) {
                  // Handle deletion errors
                  //displayErrorMessage("Utilisateur non autorisé!!! Vous allez etre redirigé vers la page connexion.", ".modal-title");
                  //setTimeout(() => {
                    //window.location.href = "login.html";
                  //}, 4000);
                }
              })
              .catch(error => {
                //displayErrorMessage("Une erreur s'est produite lors de la suppression de l'élément.", ".modal-title",error);
              });  


              //
              modalFigure.removeChild(confirmDeleteButton);
            });
            modalFigure.appendChild(confirmDeleteButton);
        });

        modalFigure.appendChild(deleteButton);

        ///////////////////////////////////

        gallery.appendChild(figure);
        modalGallery.appendChild(modalFigure);

        
    });
}

async function fetchCategories() {
    try {
        const response = await fetch("http://" + window.location.hostname + ":5678/api/categories");
        const data = await response.json();
        //console.log(data);
        displayCategoriesFilter(data);
    }
    catch (error) {
        console.log(error);
    }
}

fetchCategories();

const displayCategoriesFilter = (categories) => {
    categories.forEach(element => {
        //console.log(element.id, element.name);
        //const button = `<button class="btn" id=${element.id}>${element.name}</button>`;
        //document.querySelector(".filter").innerHTML += button;
        const button = document.createElement("button");
        button.classList.add("btn");
        button.setAttribute("id", element.id);
        button.innerText = element.name;
        document.querySelector(".filter").appendChild(button);
    });
    const btns = document.querySelectorAll(".btn");
    //console.log(btns);
    for (let i=0 ; i<btns.length; i++) {
        if(!sessionStorage.login){
            btns[i].style = "display : flex";
            btns[i].addEventListener("click", () => {
                const filteredWorks = works.filter(element => {
                    return element.categoryId === i
                });
                if(i===0){
                    updateFilter(i, btns.length, btns);
                    fetchWorks();
                } else {
                    updateFilter(i, btns.length, btns);
                    //console.log(filteredWorks);
                    displayWorks(filteredWorks);
                }
            });
        } else {
            fetchWorks();
        } 
    }
};

const updateFilter = (i, length, btns) => {
    for (let j=0 ; j<length; j++) {
        if (j===i) {
            btns[j].classList.add("filter-active");
        } else {
            btns[j].classList.remove("filter-active");
        }
    }
}

const logout =  document.querySelector(".logout");

function editMode() {
    if (sessionStorage.login) {
        document.getElementById("toolbar").style = "display: flex";
        logout.innerText = "logout";
        document.querySelectorAll(".btn-edit").forEach(element => {
            element.style = "display : flex"
        });
        //console.log("Vous êtes connecté !");

    }
    else {
        //console.log("Vous n'êtes pas connecté !");
    }
}

editMode();

logout.addEventListener("click", () => {
    sessionStorage.removeItem("login");
    sessionStorage.removeItem("token");
    logout.innerText = "login";
});


document.querySelector(".modal-open").addEventListener("click" , () => {
    document.getElementById("modal").style = "display : block";
    document.getElementById("modal-page-two").style = "display : none";
    document.querySelector(".modal-wrapper").scrollIntoView({ behavior: "smooth", block: "start" });
    fetchWorks();
});

document.querySelectorAll(".modal-close").forEach(element => {
    element.addEventListener("click", () => {
        document.getElementById("modal").style = "display : none";
        document.getElementById("modal-page-one").style = "display : flex";
        document.getElementById("modal-page-two").style = "display : none";
    });
});

document.querySelector('.modal-btn').addEventListener('click', () => {
    document.getElementById("modal-page-one").style = "display : none";
    document.getElementById("modal-page-two").style = "display : flex";
});

document.querySelector('.modal-arrow-left').addEventListener('click', () => {
    document.getElementById("modal-page-one").style = "display : flex";
    document.getElementById("modal-page-two").style = "display : none";
});
