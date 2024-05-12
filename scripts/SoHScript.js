const MAX_ASSET_HEIGHT = 400;
const ASSET_GAP = 5;
const CANVAS_WIDTH = 700;
const CANVAS_HEIGHT = 40;

var config = {};
var sohSymbols = {}
var sohSpeculativeSymbols = {}

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
            loadSoHSymbols(config.soh_script.letters_to_symbols, sohSymbols);
            loadSoHSymbols(config.soh_script.letters_to_speculative_symbols, sohSpeculativeSymbols);
        }
    }
    xhr.send();
}

function loadSoHSymbols(letterToSymbolMap, loadedSymbols) {
    var letters = Object.keys(letterToSymbolMap);
    var fistLetter = letters[0];
    loadedSymbols[fistLetter] = new Image();
    for (var n = 0; n < letters.length; n++) {
        var currentChar = letters[n];
        if (n + 1 < letters.length) {
            var nextLetter = letters[n + 1];
            loadedSymbols[nextLetter] = new Image();
            loadedSymbols[currentChar].onload = (function (nextChar) {
                loadedSymbols[nextChar].src = letterToSymbolMap[nextChar];
            })(nextLetter);
        }
    }
    loadedSymbols[fistLetter].src = letterToSymbolMap[fistLetter]
}

function getSoHSymbol(letter, include_speculative) {
    if (letter in sohSymbols) {
        return sohSymbols[letter];
    } else if (include_speculative && letter in sohSpeculativeSymbols) {
        return sohSpeculativeSymbols[letter];
    } else {
        return sohSymbols["unk"];
    }
}

function updateEnglishToSoH() {
    var english = document.getElementById("from_english").value;
    var include_speculative = document.getElementById("include_speculative").checked;
    var canvas = document.getElementById("result"),
        ctx = canvas.getContext("2d"),
        show_canvas = document.getElementById("show"),
        show_ctx = show_canvas.getContext("2d");
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    var cumulativeWidth = ASSET_GAP;
    for(var n = 0; n < english.length; n++) {
        lowercase = english[n].toLowerCase();
        var sohSymbol = getSoHSymbol(lowercase, include_speculative);
        var sizeRatio = sohSymbol.naturalWidth / sohSymbol.naturalHeight;
        var heightRatio = sohSymbol.naturalHeight / MAX_ASSET_HEIGHT;
        var effectiveHeight = CANVAS_HEIGHT * heightRatio;
        var effectiveWidth = effectiveHeight * sizeRatio;
        ctx.drawImage(sohSymbol, cumulativeWidth, (CANVAS_HEIGHT - effectiveHeight) / 2, effectiveWidth, effectiveHeight);
        cumulativeWidth += effectiveWidth + ASSET_GAP;
    }
    show_ctx.clearRect(0, 0, show_canvas.width, show_canvas.height);
    show_ctx.drawImage(canvas, (CANVAS_WIDTH - cumulativeWidth) / 2, 0, show_canvas.width, show_canvas.height);
}