document.querySelector('input[type="submit"]').addEventListener("click", function (e) {
    e.preventDefault();
    FetchUserLogin();
});

async function FetchUserLogin() {
    try {
        const response = await fetch("http://"+ window.location.hostname +":5678/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                accept: "application/json",
            },
            body: JSON.stringify({
                "email": document.getElementById("email").value,
                "password": document.getElementById("password").value,
            })
        });

        if (response.ok) {
            window.location.href = "./index.html";
            const dataUser = await response.json();
            //console.log(dataUser);
            localStorage.setItem("token", dataUser.token);
            localStorage.setItem("login", true);
        }
        else {
            localStorage.setItem("token", undefined);
            localStorage.setItem("login", false);
            document.querySelector(".msg-error").innerText = "L'email ou le mot de passe saisi est incorrect";
            document.getElementById("password").after(p);
        }
    }

    catch (e) {
        console.log(e);
    }
};