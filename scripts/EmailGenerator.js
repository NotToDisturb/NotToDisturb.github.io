var config = {};
var template = "";
var portrait = "";

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
            template = config.templates.valorant;
            portrait = config.email_portraits.viper;
            processTemplate();
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
    buildEmail();
}

function processTemplate() {
    template = config.templates[document.getElementById("template-selector").value]
}

function processPortrait() {
    if(document.getElementById("portrait-selector").value == "custom"){
        document.getElementById("custom-portrait-button").style = "display: inline-block";
    }
    else{
        document.getElementById("custom-portrait-button").style = "display: none";
        portrait = config.email_portraits[document.getElementById("portrait-selector").value];
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
           buildEmail();
       }

    }
    customPortrait.click();
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

function buildEmail() {
    var template_img = new Image(),
        portrait_img = new Image(),
        canvas = document.getElementById("working-canvas"),
        ctx = canvas.getContext("2d");
    template_img.onload = function() {
        portrait_img.src = portrait;
    };
    portrait_img.onload = function() {
        canvas.width = 700;
        canvas.height = 350;
        ctx.drawImage(template_img, 0, 0, 700, 350);
        ctx.drawImage(portrait_img, 21, 63, 67, 75);
        ctx.font = "21px DINNext-Light";
        ctx.fillStyle = "white";
        ctx.textAlign = "start";
        ctx.fillText(document.getElementById("title-input").value, 103, 34);
        ctx.textAlign = "end";
        ctx.fillText(document.getElementById("date-input").value, 658, 34);
        ctx.textAlign = "start";
        ctx.font = "17px DINNext-Light";
        fillMultilineText(ctx, document.getElementById("body-input").value, 103, 96, 490, 21);
        ctx.font = "13px DINNext-Light";
        ctx.fillText("INBOX", 495, 34);
        ctx.fillText("REPLY", 164, 301);
        ctx.fillText("FORWARD", 300, 301);
        ctx.fillStyle = "#a0a0a0";
        ctx.fillText(document.getElementById("sender-input").value, 103, 73);
        ctx.fillText(document.getElementById("receiver-input").value, 389, 300);
        ctx.font = "9px DINNext-Light";
        ctx.textAlign = "end";
        ctx.fillText("Generated using disturbo.me", 640, 330);
        var show_canvas = document.getElementById("show-canvas"),
            show_ctx = show_canvas.getContext("2d");
        show_ctx.clearRect(0, 0, show_canvas.width, show_canvas.height);
        show_ctx.drawImage(canvas, 0, 0, show_canvas.width, show_canvas.height);
    };
    template_img.src = template;
}

function downloadEmail() {
    var canvas = document.getElementById("working-canvas"),
        title = document.getElementById("title-input");
    canvas.toBlob(function(blob){
        saveAs(blob, title.value + " - disturbo.me.png");
        link = URL.createObjectURL(blob);
        console.log(blob);
        console.log(link);
    },'image/png');
}