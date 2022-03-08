var config = {};
var template = "";
var portrait = "";

function loaded(){
    var xhr = new XMLHttpRequest();
    get_navbar(xhr);
}

function get_navbar(xhr){
    xhr.open("GET", "navbar.html");
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            navbar = document.getElementById("navbar");
            navbar.innerHTML = xhr.responseText;
            get_footer(xhr);
        }
    }
    xhr.send();
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

function get_config(xhr){
    xhr.open("GET", "config.json");
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var configText = "";
            configText = xhr.responseText;
            config = JSON.parse(configText);
            portrait = config.dossier_portraits.viper;
            processPortrait();
            resizeCanvas();
            window.addEventListener("resize", resizeCanvas, false);
        }
    }
    xhr.send();
}

function resizeCanvas(){
    var show_canvas = document.getElementById("show");
    show_canvas.width = Math.min(700, window.innerWidth * 0.9);
    if(show_canvas.width == 700){
        show_canvas.height = 350;
    }
    else{
        show_canvas.height = 350 * show_canvas.width / 700;
    }
    buildDossier();
}

function processPortrait() {
    portrait = config.dossier_portraits[document.getElementById("portrait").value]
}

function fillMultilineText(context, text, x, y, maxWidth, lineHeight) {
    var replacement = text.replaceAll("\n", "\n ");
    var words = replacement.split(" ");
    if(words.length == 0){
        return
    }
    var line = words[0];
    for(var n = 1; n < words.length; n++) {
        var testLine = line + " " + words[n];
        var metrics = context.measureText(testLine);
        var testWidth = metrics.width;
        if (testWidth > maxWidth || line.endsWith("\n")) {
            context.fillText(line, x, y);
            line = words[n];
            y += lineHeight;
        }
        else {
            line = testLine;
        }
    }
    context.fillText(line, x, y);
}

function buildDossier() {
    var template_img = new Image(),
        portrait_img = new Image(),
        canvas = document.getElementById("result"),
        ctx = canvas.getContext("2d");
    template_img.onload = function() {
        portrait_img.src = portrait;
    };
    portrait_img.onload = function() {
        canvas.width = 700;
        canvas.height = 350;
        ctx.drawImage(template_img, 0, 0, 700, 350);
        ctx.drawImage(portrait_img, 28, 24, 236, 221);
        ctx.fillStyle = "#a0a0a0";
        ctx.textAlign = "start";
        ctx.font = "12px DINNext-Bold";
        fillMultilineText(ctx, document.getElementById("header").value, 51, 273, 175, 15);
        ctx.font = "13px DINNext-Regular";
        fillMultilineText(ctx, document.getElementById("body").value, 266, 62, 365, 18);
        ctx.font = "9px DINNext-Light";
        ctx.textAlign = "end";
        ctx.fillText("Generated using disturbo.me", 640, 330);
        var show_canvas = document.getElementById("show"),
            show_ctx = show_canvas.getContext("2d");
        show_ctx.clearRect(0, 0, show_canvas.width, show_canvas.height);
        show_ctx.drawImage(canvas, 0, 0, show_canvas.width, show_canvas.height);
    };
    template_img.src = config.templates.dossier;
}

function download() {
    var canvas = document.getElementById("result"),
        title = document.getElementById("title");
    canvas.toBlob(function(blob){
        saveAs(blob, title.value + " - disturbo.me.png");
        link = URL.createObjectURL(blob);
        console.log(blob);
        console.log(link);
    },'image/png');
}