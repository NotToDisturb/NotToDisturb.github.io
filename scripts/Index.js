var config = {};

function loaded() {
    var xhr = new XMLHttpRequest();
    get_footer(xhr)
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

function get_config(xhr) {
    xhr.open("GET", "config.json");
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var configText = "";
            configText = xhr.responseText;
            config = JSON.parse(configText);
            document.getElementById("email_generator").src = config.templates.valorant;
            document.getElementById("dossier_generator").src = config.templates.dossier;
        }
    }
    xhr.send();
}

