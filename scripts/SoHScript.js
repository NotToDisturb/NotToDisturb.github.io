const MAX_ASSET_WIDTH = 200;
const MAX_ASSET_HEIGHT = 300;

var config = {};
var sohAssets = {}

function loaded() {
    getNavbar();
    getFooter();
    getConfig();
}

function getConfig() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "config.json");
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var configText = "";
            configText = xhr.responseText;
            config = JSON.parse(configText);
            getSoHAssets();
        }
    }
    xhr.send();
}

function getSoHAssets() {
    var sohChars = Object.keys(config.soh_script.letters);
    var fistLetter = sohChars[0];
    sohAssets[fistLetter] = new Image();
    for (var n = 0; n < sohChars.length; n++) {
        var currentChar = sohChars[n];
        if (n + 1 < sohChars.length) {
            var nextChar = sohChars[n + 1];
            sohAssets[nextChar] = new Image();
            sohAssets[currentChar].onload = function () {
                sohAssets[nextChar].src = config.soh_script.letters[nextChar]
            };
        } else {
            sohAssets[currentChar].onload = function () {
                updateEnglishToSoH();
            };
        }

        
    }
    sohAssets[fistLetter].src = config.soh_script.letters[fistLetter]
}

function updateEnglishToSoH() {
    english = document.getElementById("from_english").value;
    var canvas = document.getElementById("result"),
        ctx = canvas.getContext("2d"),
        show_canvas = document.getElementById("show"),
        show_ctx = show_canvas.getContext("2d");
    canvas.width = 700;
    canvas.height = 100;
    for(var n = 0; n < english.length; n++) {
        lowercase = english[n].toLowerCase();
        // assetHsohAsset.naturalHeight
        ctx.drawImage(sohAssets[lowercase], n * MAX_ASSET_WIDTH, 0, (n + 1) * MAX_ASSET_WIDTH, MAX_ASSET_HEIGHT);
    }
    show_ctx.clearRect(0, 0, show_canvas.width, show_canvas.height);
    show_ctx.drawImage(canvas, 0, 0, show_canvas.width, show_canvas.height);

    // document.getElementById("to_soh").value = ;
}