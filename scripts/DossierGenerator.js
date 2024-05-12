var config = {};
var template = "";
var portrait = "";
var last_portrait = "";

function loaded(){
    getNavbar();
    getFooter();
    getConfig();
}

function getConfig(){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "config.json");
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var configText = "";
            configText = xhr.responseText;
            config = JSON.parse(configText);
            template = config.templates.fade_dossier;
            portrait = config.dossier_portraits.viper;
            processPortrait();
            resizeCanvas();
            window.addEventListener("resize", resizeCanvas, false);
        }
    }
    xhr.send();
}

function resizeCanvas(){
    var show_canvas = document.getElementById("show-canvas");
    show_canvas.width = Math.min(700, window.innerWidth * 0.9);
    if(show_canvas.width == 700){
        show_canvas.height = 350;
    }
    else{
        show_canvas.height = 350 * show_canvas.width / 700;
    }
    buildDossier();
}

function processTemplate() {
    template = config.templates[document.getElementById("template").value]

    if(document.getElementById("template-selector").value == "atlas_dossier"){
        document.getElementById("portrait-row").style = "display: none";
        last_portrait = portrait;
        portrait = config.dossier_portraits.empty;
    }
    else{
        document.getElementById("portrait-row").style = "display: table-row";
        portrait = last_portrait;
    }
}

function processPortrait() {
    if(document.getElementById("portrait-selector").value == "custom"){
        document.getElementById("custom-portrait-button").style = "display: inline-block";
    }
    else{
        document.getElementById("custom-portrait-button").style = "display: none";
        portrait = config.dossier_portraits[document.getElementById("portrait-selector").value];
    }
}

function openCustomPortraitPicker() {
    var customPortrait = document.createElement('input');
    customPortrait.type = 'file';
    customPortrait.onchange = event => {
       var file = event.target.files[0];
       var reader = new FileReader();
       reader.readAsDataURL(file);
       reader.onload = readerEvent => {
           portrait = readerEvent.target.result;
           buildDossier();
       }

    }
    customPortrait.click();
}

function fillMultilineText(ctx, text, x, y, maxWidth, lineHeight) {
    var replacement = text.replaceAll("\n", "\n ");
    var words = replacement.split(" ");
    if(words.length == 0){
        return
    }
    var line = words[0];
    for(var n = 1; n < words.length; n++) {
        var testLine = line + " " + words[n];
        var metrics = ctx.measureText(testLine);
        var testWidth = metrics.width;
        if (testWidth > maxWidth || line.endsWith("\n")) {
            ctx.fillText(line, x, y);
            line = words[n];
            y += lineHeight;
        }
        else {
            line = testLine;
        }
    }
    ctx.fillText(line, x, y);
}

function buildDossier() {
    var template_img = new Image(),
        portrait_img = new Image();

    template_img.onload = function() {
        portrait_img.src = portrait;
    };

    portrait_img.onload = function() {
        var canvas = document.getElementById("working-canvas"),
            ctx = canvas.getContext("2d"),
            show_canvas = document.getElementById("show-canvas"),
            show_ctx = show_canvas.getContext("2d");

        canvas.width = 700;
        canvas.height = 350;
        ctx.drawImage(template_img, 0, 0, 700, 350);
        ctx.drawImage(portrait_img, 28, 24, 236, 221);
        if(document.getElementById("template-selector").value == "fade_dossier"){
            drawFadeDossier(ctx);
        }
        if(document.getElementById("template-selector").value == "atlas_dossier"){
            drawAtlasDossier(ctx);
        }
        ctx.font = "9px DINNext-Light";
        ctx.textAlign = "end";
        ctx.fillText("Generated using disturbo.me", 640, 330);
        show_ctx.clearRect(0, 0, show_canvas.width, show_canvas.height);
        show_ctx.drawImage(canvas, 0, 0, show_canvas.width, show_canvas.height);
    };
    template_img.src = template;
}

function drawFadeDossier(ctx){
    ctx.fillStyle = "#a0a0a0";
    ctx.textAlign = "start";
    ctx.font = "12px DINNext-Bold";
    fillMultilineText(ctx, document.getElementById("header-input").value, 51, 273, 175, 15);
    ctx.font = "13px DINNext-Regular";
    fillMultilineText(ctx, document.getElementById("body-input").value, 266, 62, 365, 18);
}

function drawAtlasDossier(ctx){
    ctx.textAlign = "start";
    ctx.fillStyle = "#ffffff";
    ctx.font = "13px DINNext-Regular";
    fillMultilineText(ctx, document.getElementById("header-input").value, 53, 242, 175, 16);
    ctx.fillStyle = "#c8ccc2";
    ctx.font = "17px DINNext-Regular";
    fillMultilineText(ctx, document.getElementById("body-input").value, 290, 51, 400, 20);
}

function downloadDossier() {
    var canvas = document.getElementById("working-canvas"),
        title = document.getElementById("title-input");
    canvas.toBlob(function(blob){
        saveAs(blob, title.value + " - disturbo.me.png");
        link = URL.createObjectURL(blob);
        console.log(blob);
        console.log(link);
    },'image/png');
}