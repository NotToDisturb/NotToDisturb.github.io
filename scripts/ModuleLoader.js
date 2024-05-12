function getNavbar(){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "navbar.html");
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            navbar = document.getElementById("navbar");
            navbar.innerHTML = xhr.responseText;
            updateNavbarMargin();
            window.addEventListener("resize", updateNavbarMargin, false);
        }
    }
    xhr.send();
}

function updateNavbarMargin(){
    var page_content = document.getElementById("page-content"),
        navbar = document.getElementById("navbar-div");
    page_content.style.marginTop = navbar.offsetHeight.toString() + "px";
}

function getFooter(){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "footer.html");
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            footer = document.getElementById("footer");
            footer.innerHTML = xhr.responseText;
            updateFooterMargin();
            window.addEventListener("resize", updateFooterMargin, false);
        }
    }
    xhr.send();
}

function updateFooterMargin(){
    var page_content = document.getElementById("page-content"),
        footer = document.getElementById("footer-div");
    page_content.style.marginBottom = footer.offsetHeight.toString() + "px";
}

