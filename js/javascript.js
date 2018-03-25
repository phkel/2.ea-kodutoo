// Check browser support
if (typeof(Storage) !== "undefined") {
    // Store
    localStorage.setItem("firstname", "");
    // Retrieve
    document.getElementById("player").innerHTML = localStorage.getItem("firstname");
} else {
    document.getElementById("player").innerHTML = "Sorry, your browser does not support Web Storage...";
}


// button function for dark mode (krislyn)

function chBackcolor(color) {
   document.body.style.background = color;
}
