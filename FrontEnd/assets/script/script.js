let works;
let file;

async function fetchWorks() {
    try {
        const response = await fetch("http://localhost:5678/api/works");
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
        const response = await fetch("http://localhost:5678/api/works");
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
    modalGallery.style = "grid-template-rows: repeat(" + (data.length / 5) + ", 1fr);";
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


        const deleteButton = document.createElement("div");
        deleteButton.classList.add("modal-delete-button");

        const deleteIcon = document.createElement("i");
        deleteIcon.classList.add("fa-solid","fa-trash-can", "fa-2xs");

        deleteButton.style.cursor = 'pointer';
        deleteButton.appendChild(deleteIcon);

        deleteButton.addEventListener('click', () => {

            const confirmResponse =  confirm("souhaitez vous confirmer la suppression");


            if(confirmResponse) {
                const token = window.sessionStorage.getItem('token');
                fetch("http://localhost:5678/api/works/" + workId, {
                    method: 'DELETE',
                    headers: {
                    'Authorization': `Bearer ${token}`,
                    },
                }).then(response => {
                    if (response.ok) {
                    // Refresh gallery display after deletion
                    fetchWorks();
                    } else if(response.status === 401) {
                    // Handle deletion errors
                    alert("Utilisateur non autorisé!!! Vous allez etre redirigé vers la page connexion");
                    setTimeout(() => {
                        window.location.href = "login.html";
                    }, 2000);
                    }
                })
                .catch(error => {
                    alert("Une erreur s'est produite lors de la suppression de l'élément.");
                });  


            }
        });

        modalFigure.appendChild(deleteButton);

        ///////////////////////////////////

        gallery.appendChild(figure);
        modalGallery.appendChild(modalFigure);

        
    });
}

async function fetchCategories() {
    try {
        const response = await fetch("http://localhost:5678/api/categories");
        const data = await response.json();
        //console.log(data);
        displayCategoriesFilterAndOption(data);
    }
    catch (error) {
        console.log(error);
    }
}

fetchCategories();

const displayCategoriesFilterAndOption = (categories) => {

    const selectImageCategory = document.querySelector('.select-image-category');

    categories.forEach(element => {
        //console.log(element.id, element.name);
        
        const button = document.createElement("button");
        button.classList.add("btn");
        button.setAttribute("id", element.id);
        button.innerText = element.name;
        document.querySelector(".filter").appendChild(button);

        const option = document.createElement('option');
        option.textContent = element.name;
        option.value = element.id;
        selectImageCategory.appendChild(option);

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
        initForm();
    });
});

document.querySelector('.modal-btn').addEventListener('click', () => {
    document.getElementById("modal-page-one").style = "display : none";
    document.getElementById("modal-page-two").style = "display : flex";
    document.getElementById('validate').disabled = true;
});

document.querySelector('.modal-arrow-left').addEventListener('click', () => {
    initForm();
});


document.querySelector('.input-image-upload').addEventListener('change', (e) => {
    file = e.target.files[0];
    //const file = e.target.files[0];

    if (file.type==="image/jpeg" || file.type==="image/png") {
        const previewImage = document.querySelector(".preview-image");
        previewImage.src = URL.createObjectURL(file);
        previewImage.style = "display : flex";
        verifyForm();
    } else {
        document.querySelector('.form-error').textContent = "veuillez téléverser une image au format jpg ou png";
    }

});

document.querySelector('.input-image-title').addEventListener('change', (e) => {
    verifyForm();
});

document.querySelector('.select-image-category').addEventListener('change', (e) => {
    verifyForm();
});

document.getElementById('validate').addEventListener('click', async (e) => {
    e.preventDefault();
    const formData = new FormData();
    const uploadImage = file;
    const uploadTitle = document.querySelector('.input-image-title').value;
    const uploadCategory = document.querySelector('.select-image-category').value;
    if (uploadImage && uploadTitle && uploadCategory) {
        formData.append("image", uploadImage);
        formData.append("title", uploadTitle);
        formData.append("category", uploadCategory);
        //console.log(formData);
        fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${sessionStorage.token}`,
            },
            body: formData,
        }).then(response => {
            if(response.ok){
                alert("ajout réussi");
                fetchWorks();
                initForm();
            } else {
                document.querySelector('.form-error').textContent = "problème lors de l'envoi du formulaire";
            }
        }).catch(error => {
            alert("Une erreur s'est produite lors de l'envoi du formulaire.");
        });
    }
    
});

const verifyForm = () => {
    if (file 
    && document.querySelector('.input-image-title').value 
    && document.querySelector('.select-image-category').value) {
        document.getElementById('validate').disabled = false;
        document.querySelector('.form-error').textContent = "";
    } else {
        document.querySelector('.form-error').textContent = "veuillez compléter le formulaire";
    }
}

const initForm = () => {
    document.getElementById("modal-page-one").style = "display : flex";
    document.getElementById("modal-page-two").style = "display : none";
    const previewImage = document.querySelector(".preview-image");
    previewImage.src = "";
    previewImage.style = "display : none";
    document.querySelector('.input-image-upload').value = "";
    document.getElementById('validate').disabled = true;
    document.querySelector('.input-image-title').value = "";
    document.querySelector('.select-image-category').value = "";
    document.querySelector('.form-error').textContent = "";
    file = null;
}