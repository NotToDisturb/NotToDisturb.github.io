const MAX_ASSET_HEIGHT = 300;
const ASSET_GAP = 5;
const CANVAS_WIDTH = 700;
const CANVAS_HEIGHT = 40;

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
            sohAssets[currentChar].onload = (function (nextChar) {
                sohAssets[nextChar].src = config.soh_script.letters[nextChar];
            })(nextChar);
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
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    var cumulativeWidth = ASSET_GAP;
    for(var n = 0; n < english.length; n++) {
        lowercase = english[n].toLowerCase();
        var sohAsset = lowercase in sohAssets ? sohAssets[lowercase] : sohAssets["unk"];
        var sizeRatio = sohAsset.naturalWidth / sohAsset.naturalHeight;
        var heightRatio = sohAsset.naturalHeight / MAX_ASSET_HEIGHT;
        var effectiveHeight = CANVAS_HEIGHT * heightRatio;
        var effectiveWidth = effectiveHeight * sizeRatio;
        ctx.drawImage(sohAsset, cumulativeWidth, (CANVAS_HEIGHT - effectiveHeight) / 2, effectiveWidth, effectiveHeight);
        cumulativeWidth += effectiveWidth + ASSET_GAP;
    }
    show_ctx.clearRect(0, 0, show_canvas.width, show_canvas.height);
    show_ctx.drawImage(canvas, (CANVAS_WIDTH - cumulativeWidth) / 2, 0, show_canvas.width, show_canvas.height);
}