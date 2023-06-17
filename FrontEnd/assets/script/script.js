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

fetchWorks();

const displayWorks = (data) => {
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";
    data.forEach(element => {
        //console.log(element.id, element.title);
        const figure = 
            `<figure>
				<img src=${element.imageUrl} alt=${element.title}>
				<figcaption>${element.title}</figcaption>
			</figure>`
            gallery.innerHTML += figure
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
        if(!localStorage.login){
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
            btns[j].classList.add("active");
        } else {
            btns[j].classList.remove("active");
        }
    }
}

const logout =  document.querySelector(".logout");

function editMode() {
    if (localStorage.login) {
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
    localStorage.removeItem("login");
    localStorage.removeItem("token");
    logout.innerText = "login";
});