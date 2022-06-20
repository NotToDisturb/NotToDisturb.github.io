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
    if(document.getElementById("portrait").value == "custom"){
        document.getElementById("custom_portrait").style = "display: inline-block";
    }
    else{
        document.getElementById("custom_portrait").style = "display: none";
        portrait = config.dossier_portraits[document.getElementById("portrait").value];
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