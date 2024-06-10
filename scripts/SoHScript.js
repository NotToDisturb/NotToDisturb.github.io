const MAX_ASSET_HEIGHT = 400;
const SYMBOL_GAP = 5;
const CANVAS_HEIGHT = 40;

var config = {};
var sohSymbols = {}
var sohSpeculativeSymbols = {}
var sohLetterToSymbolMapping = {}
var sohKeyboardConfigs = {}
var currentKeyboardLayout = "alphabet"
var currentKeyboardLetterCase = "upper"

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
            loadSoHSymbols(config.soh_script.symbol_assets.hollow.symbols, sohSymbols, "hollow");
            loadSoHSymbols(config.soh_script.symbol_assets.solid.symbols, sohSymbols, "solid");
            loadSoHSymbols(config.soh_script.symbol_assets.others.symbols, sohSymbols, "others");
            loadSoHSymbols(config.soh_script.symbol_assets.hollow.speculative_symbols, sohSpeculativeSymbols, "hollow");
            loadSoHSymbols(config.soh_script.symbol_assets.solid.speculative_symbols, sohSpeculativeSymbols, "solid");
            sohLetterToSymbolMapping = config.soh_script.letter_to_symbol_type;
            sohKeyboardConfigs = config.soh_script.keyboard_configs;
            initTranslator();
        }
    }
    xhr.send();
}

function loadSoHSymbols(letterToSymbolMap, loadedSymbols, symbolType) {
    var letters = Object.keys(letterToSymbolMap);
    var fistLetter = letters[0];
    loadedSymbols[`${symbolType}-${fistLetter}`] = new Image();
    for (var n = 0; n < letters.length; n++) {
        var currentLetter = letters[n];
        if (n + 1 < letters.length) {
            var nextLetter = letters[n + 1];
            loadedSymbols[`${symbolType}-${nextLetter}`] = new Image();
            loadedSymbols[`${symbolType}-${currentLetter}`].onload = (function (symbolType, nextLetter) {
                loadedSymbols[`${symbolType}-${nextLetter}`].src = letterToSymbolMap[nextLetter];
            })(symbolType, nextLetter);
        }
    }
    loadedSymbols[`${symbolType}-${fistLetter}`].src = letterToSymbolMap[fistLetter]
}

function initTranslator() {
    setSymbolKeyboard();
    toggleIncludeSpeculative();
    updateDownloadButton();
}

function getSoHSymbol(letter, includeSpeculative) {
    var symbolType = letter in sohLetterToSymbolMapping ? sohLetterToSymbolMapping[letter] : "none";
    var symbolKey = `${symbolType}-${letter.toLowerCase()}`

    if (symbolKey in sohSymbols) {
        return sohSymbols[symbolKey];
    } else if (includeSpeculative && symbolKey in sohSpeculativeSymbols) {
        return sohSpeculativeSymbols[symbolKey];
    } else if (letter == " "){
        return sohSymbols["others- "];
    } else {
        return sohSymbols["others-unk"];
    }
}

function getSoHSymbolMeasures(sohSymbol) {
    var sizeRatio = sohSymbol.naturalWidth / sohSymbol.naturalHeight;
    var heightRatio = sohSymbol.naturalHeight / MAX_ASSET_HEIGHT;
    var effectiveHeight = CANVAS_HEIGHT * heightRatio;
    var effectiveWidth = effectiveHeight * sizeRatio;
    return [effectiveWidth, effectiveHeight];
}

function getCanvasWidth(text, includeSpeculative) {
    var width = SYMBOL_GAP * (text.length + 1);
    for(var n = 0; n < text.length; n++) {
        var sohSymbol = getSoHSymbol(text[n], includeSpeculative);
        var [effectiveWidth, _] = getSoHSymbolMeasures(sohSymbol);
        width += effectiveWidth;
    }
    return width;
}

function drawSoHSymbols() {
    var text = document.getElementById("english-input").value;
    var includeSpeculative = document.getElementById("include-speculative-checkbox").checked;
    var canvas = document.getElementById("result"),
        ctx = canvas.getContext("2d"),
        show_canvas = document.getElementById("show"),
        show_ctx = show_canvas.getContext("2d");
    canvas.width = getCanvasWidth(text, includeSpeculative);
    show_canvas.width = canvas.width;
    var cumulativeWidth = SYMBOL_GAP;
    for(var n = 0; n < text.length; n++) {
        var sohSymbol = getSoHSymbol(text[n], includeSpeculative);
        var [effectiveWidth, effectiveHeight] = getSoHSymbolMeasures(sohSymbol);
        ctx.drawImage(sohSymbol, cumulativeWidth, (CANVAS_HEIGHT - effectiveHeight) / 2, effectiveWidth, effectiveHeight);
        cumulativeWidth += effectiveWidth + SYMBOL_GAP;
    }
    show_ctx.clearRect(0, 0, show_canvas.width, show_canvas.height);
    show_ctx.drawImage(canvas, (canvas.width - cumulativeWidth) / 2, 0, show_canvas.width, show_canvas.height);
}

function setSymbolKeyboard() {
    var keyboard = window.document.getElementById("soh-symbols-keyboard-div");
    var keyboardHtml = "";
    sohKeyboardConfigs[currentKeyboardLayout].forEach((line) => {
        keyboardHtml += "<p>";
        line.forEach((letter) => {
            shownLetter = currentKeyboardLetterCase == "upper" ? letter.toUpperCase() : letter;
            symbolType = sohLetterToSymbolMapping[shownLetter];
            symbolKey = `${symbolType}-${letter}`;
            isSpeculative = symbolKey in sohSpeculativeSymbols;
            if (isSpeculative){
                keyboardHtml += `<a class="soh-symbol-button speculative" style="display: none;" href="" onclick="updateSoHToEnglish('add', '${shownLetter}'); return false;"><img src="${sohSpeculativeSymbols[symbolKey].src}" class="soh_symbol_img"/> ${shownLetter}*</a>`
            } else {
                console.log(symbolKey)
                keyboardHtml += `<a class="soh-symbol-button" href="" onclick="updateSoHToEnglish('add', '${shownLetter}'); return false;"><img src="${sohSymbols[symbolKey].src}" class="soh_symbol_img"/> ${shownLetter}</a>`
            }
        });
        keyboardHtml += "</p>";
    });
    var toLayout = currentKeyboardLayout == "alphabet" ? "QWERTY" : "Alphabet";
    var toLetterCase = currentKeyboardLetterCase == "lower" ? "upper" : "lower";
    keyboardHtml += `<p>
                        <a class="stylized-button" href="" onclick="updateSoHToEnglish('add', ' '); return false;">Space</a>
                        <a class="stylized-button" href="" onclick="updateSoHToEnglish('remove'); return false;">Remove</a>
                        <a class="stylized-button" href="" onclick="updateSoHToEnglish('clear'); return false;">Clear</a>
                        <a class="stylized-button" href="" onclick="toggleToSymbolLayout('${toLayout.toLowerCase()}'); return false;">Change to ${toLayout} layout</a>
                        <a class="stylized-button" href="" onclick="toggleToLetterCase('${toLetterCase}'); return false;">Change to ${toLetterCase}case</a>
                    </p>`;
    keyboard.innerHTML = keyboardHtml;
}

function toggleIncludeSpeculative() {
    drawSoHSymbols();
    var includeSpeculative =  document.getElementById("include-speculative-checkbox").checked;
    document.querySelectorAll(".speculative").forEach(input => {
        input.style.display = includeSpeculative ? "inline-block" : 'none';
    });
}

function toggleToSymbolLayout(layout) {
    currentKeyboardLayout = layout;
    setSymbolKeyboard();
    toggleIncludeSpeculative();
}

function toggleToLetterCase(letterCase) {
    currentKeyboardLetterCase = letterCase;
    setSymbolKeyboard();
    toggleIncludeSpeculative();
}

function updateDownloadButton() {
    document.getElementById("download-button").hidden = document.getElementById("english-input").value.length == 0;
}

function updateEnglishToSoH() {
    updateDownloadButton();
    drawSoHSymbols();
}

function updateSoHToEnglish(action, letter) {
    var textInput = document.getElementById("english-input");
    if (action == "add") {
        textInput.value = textInput.value + letter;
    } else if (action == "remove") {
        textInput.value = textInput.value.substring(0, textInput.value.length - 1);
    } else {
        textInput.value = ""
    }
    updateDownloadButton();
    drawSoHSymbols();
}

function downloadSymbols() {
    var canvas = document.getElementById("result"),
        title = document.getElementById("english-input");
    canvas.toBlob(function(blob){
        saveAs(blob, title.value + " - disturbo.me.png");
        link = URL.createObjectURL(blob);
    },'image/png');
}