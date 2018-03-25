// Check browser support
if (typeof(Storage) !== "undefined") {
    // Store
    localStorage.setItem("firstname", "");
    // Retrieve
    document.getElementById("player").innerHTML = localStorage.getItem("firstname");
} else {
    document.getElementById("player").innerHTML = "Sorry, your browser does not support Web Storage...";
}


// button for dark mode (krislyn)


.button {
    background-color: pink;
    border: none;
    color: white;
    width: 3%;
    height: 0;
    padding-bottom: 3%;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 13px;
    position:fixed;
    bottom:0;

}

.button{border-radius: 100%;}
