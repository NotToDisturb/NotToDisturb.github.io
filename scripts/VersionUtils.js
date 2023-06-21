var configs = {
    "manifests": {
        "url": "https://raw.githubusercontent.com/NotToDisturb/VersionArchive/master/out/manifests.json",
        "data": {}
    },
    "ue_versions": {
        "url": "https://raw.githubusercontent.com/NotToDisturb/VersionUtils/master/versionutils/ue_versions.json",
        "data": {}
    }
};


function loaded(){
    getNavbar();
    getConfig(configs.manifests);
    getConfig(configs.ue_versions);
    getFooter();
}

function getConfig(config){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", config.url);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var configText = "";
            configText = xhr.responseText;
            config.data = JSON.parse(configText);
        }
    }
    xhr.send();
}

function updateManifests(){
    branches = [];
    if (document.getElementById("accept_release").checked){
        branches.push("release");
    }
    if (document.getElementById("accept_pbe").checked){
        branches.push("pbe");
    }
    version = document.getElementById("manifest_version").value;
    document.getElementById("manifests").value = getManifests(version, branches);
}

function updateUEVersion(){
    version = document.getElementById("datamine_version").value;
    document.getElementById("datamine").value = getUEVersion(version);
}

function getManifests(version, branches) {
    var result = ""
    versionData = configs.manifests.data
    for (var idx in versionData) {
        if (versionData[idx].version.includes(version) && branches.includes(versionData[idx].branch)) {
            if (result.length > 0){
                result += ", "
            }
            result += versionData[idx].manifest
        }
    }
    return result;
}

function getUEVersion(version) {
    versionOrder = configs.ue_versions.data.order
    versionData = configs.ue_versions.data.data
    console.log(versionData)
    for (idx in versionOrder) {
        ueVersion = versionData[versionOrder[idx]]
        console.log(versionOrder[idx])
        if (isVersionNewer(version, versionOrder[idx])){
            return "Unreal Engine version:    " + ueVersion.unreal_engine + "\nUModel version:           " + ueVersion.umodel + "\nFModel version:           " + ueVersion.fmodel;
        }
    }
}

function isVersionNewer(versionA, versionB) {
    var splitVersionA = versionA.split(".");
    var splitVersionB = versionB.split(".");
    console.log(splitVersionA)
    console.log(splitVersionB)
    var minVersionLength = Math.min(splitVersionA.length, splitVersionB.length);
    for (var idx = 0; idx < minVersionLength; idx++) {
        if (splitVersionA[idx] == "") {
            splitVersionA[idx] = "0";
        }
        if (splitVersionB[idx] == "") {
            splitVersionB[idx] = "0";
        }
        if (parseInt(splitVersionA[idx]) > parseInt(splitVersionB[idx])) {
            return true;
        }
        if (parseInt(splitVersionA[idx]) < parseInt(splitVersionB[idx])) {
            return false;
        }
    }
    return splitVersionA.length >= splitVersionB.length;
}