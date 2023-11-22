//Dit zou in de main.ts file moeten gezet worden maar weet niet waar deze file gedefineerd is

//import PrimeView from 'primevue'
//import App from "./../app.vue"

//app.use(primevue);
//app.mount("#app");


export const showMenu = () => {
    var menu = document.getElementById("menu");
    console.log("show menu")
    if (menu !== null){
        var current = menu.style.display;
        console.log("menu visible")
        if (current === "block") {
            menu.style.display = "none";
        } else { 
            menu.style.display = "block";
    }
    } else {
        console.log("menu id not found...")
    }
}


//wordt momenteel niet meer gebruikt 
