export const showMenu = () => {
    var menu = document.getElementById("menu");
    console.log("show menu")
    if (menu !== null){
        var current = menu.style.visibility;
        console.log("menu visible")
        if (current === "visible") {
            menu.style.visibility = "hidden";
        } else { menu.style.visibility = "visible";}
    } else {
        console.log("menu id not found...")
    }
}