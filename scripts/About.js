function loaded(){
    var xhr = new XMLHttpRequest();
    get_navbar(xhr);
}

function get_navbar(xhr){
    xhr.open("GET", "navbar.html");
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            navbar = document.getElementById("navbar");
            navbar.innerHTML = xhr.responseText;
        }
    }
    xhr.send();
}