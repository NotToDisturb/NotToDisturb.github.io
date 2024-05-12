const MAX_ASSET_HEIGHT = 400;
const SYMBOL_GAP = 5;
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
            toggleIncludeSpeculative();
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

function getSoHSymbolMeasures(sohSymbol) {
    var sizeRatio = sohSymbol.naturalWidth / sohSymbol.naturalHeight;
    var heightRatio = sohSymbol.naturalHeight / MAX_ASSET_HEIGHT;
    var effectiveHeight = CANVAS_HEIGHT * heightRatio;
    var effectiveWidth = effectiveHeight * sizeRatio;
    return [effectiveWidth, effectiveHeight];
}

function getCanvasWidth(text) {
    var width = SYMBOL_GAP * (text.length + 1);
    for(var n = 0; n < text.length; n++) {
        letter = text[n].toLowerCase();
        var sohSymbol = getSoHSymbol(letter, include_speculative);
        var [effectiveWidth, _] = getSoHSymbolMeasures(sohSymbol);
        width += effectiveWidth;
    }
    return width;
}

function drawSoHSymbols() {
    var text = document.getElementById("from_english").value;
    var include_speculative = document.getElementById("include_speculative").checked;
    var canvas = document.getElementById("result"),
        ctx = canvas.getContext("2d"),
        show_canvas = document.getElementById("show"),
        show_ctx = show_canvas.getContext("2d");
    canvas.width = getCanvasWidth(text);
    show_canvas.width = canvas.width;
    var cumulativeWidth = SYMBOL_GAP;
    for(var n = 0; n < text.length; n++) {
        letter = text[n].toLowerCase();
        var sohSymbol = getSoHSymbol(letter, include_speculative);
        var [effectiveWidth, effectiveHeight] = getSoHSymbolMeasures(sohSymbol);
        ctx.drawImage(sohSymbol, cumulativeWidth, (CANVAS_HEIGHT - effectiveHeight) / 2, effectiveWidth, effectiveHeight);
        cumulativeWidth += effectiveWidth + SYMBOL_GAP;
    }
    show_ctx.clearRect(0, 0, show_canvas.width, show_canvas.height);
    show_ctx.drawImage(canvas, (canvas.width - cumulativeWidth) / 2, 0, show_canvas.width, show_canvas.height);
}

function toggleIncludeSpeculative() {
    drawSoHSymbols()
    var includeSpeculative =  document.getElementById("include_speculative").checked;
    document.querySelectorAll(".speculative").forEach(input => {
        input.style.display = includeSpeculative ? "inline-block" : 'none';
    });
}

function toggleToSymbolsLayout(layout) {
    if (layout == "alphabet") {
        document.getElementById("soh_symbols_qwerty").style.display = "none";
        document.getElementById("soh_symbols_alphabet").style.display = "inline";
    } else {
        document.getElementById("soh_symbols_qwerty").style.display = "inline";
        document.getElementById("soh_symbols_alphabet").style.display = "none";
    }
}

function updateSoHToEnglish(action, letter) {
    var textInput = document.getElementById("from_english");
    if (action == "add") {
        textInput.value = textInput.value + letter;
    } else if (action == "remove") {
        textInput.value = textInput.value.substring(0, textInput.value.length - 1);
    } else {
        textInput.value = ""
    }
    drawSoHSymbols();
}

function downloadSymbols() {
    var canvas = document.getElementById("result"),
        title = document.getElementById("from_english");
    canvas.toBlob(function(blob){
        saveAs(blob, title.value + " - disturbo.me.png");
        link = URL.createObjectURL(blob);
        console.log(blob);
        console.log(link);
    },'image/png');
}