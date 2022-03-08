// VALORANT Email and Dossier generator
// Copyright (C) 2022 Disturbo
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see http://www.gnu.org/licenses/

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

