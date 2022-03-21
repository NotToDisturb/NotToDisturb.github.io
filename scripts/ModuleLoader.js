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
    page_content = document.getElementById("page_content");
    navbar = document.getElementById("navbar_div");
    console.log(navbar.offsetHeight);
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
    page_content = document.getElementById("page_content");
    footer = document.getElementById("footer_div");
    console.log(footer.offsetHeight);
    page_content.style.marginBottom = footer.offsetHeight.toString() + "px";
}

