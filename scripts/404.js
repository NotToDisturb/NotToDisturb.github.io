function loaded() {
    var xhr = new XMLHttpRequest();
    get_navbar(xhr)
}

function get_navbar(xhr){
    xhr.open("GET", "navbar.html");
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            navbar = document.getElementById("navbar");
            navbar.innerHTML = xhr.responseText;
            get_footer(xhr);
        }
    }
    xhr.send();
}

function get_footer(xhr){
    xhr.open("GET", "footer.html");
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            footage = document.getElementById("footer");
            footage.innerHTML = xhr.responseText;
            get_config(xhr);
        }
    }
    xhr.send();
}