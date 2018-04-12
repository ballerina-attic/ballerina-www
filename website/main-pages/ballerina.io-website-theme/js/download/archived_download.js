$(document).ready(function () {
    Handlebars.registerHelper('basedownloadurl', function(version, artifact) {
        return new Handlebars.SafeString(Handlebars.Utils.escapeExpression(base_download_url+"/"+version+"/"+artifact))
    });
    Handlebars.registerHelper('releasenotesdiv', function(version) {
        return getReleaseNotesDivId(version);
    });
    Handlebars.registerHelper('formatdate', function(date) {
        return formatDate(date);
    });
    $.getJSON( latest_versions_json, function( latest_pack ) {
        var latestVersion = latest_pack['version'];
        $.getJSON( archived_versions_json, function( data ) {

            // remove latest version
            var ltestIndex = data.findIndex(function(element){
                return data["version"] == latestVersion;
            })
            if (ltestIndex !== -1) {
                data.splice(ltestIndex, 1);
            }

            data.sort(function(a, b) {
                return (new Date(a["release-date"])) < (new Date(b["release-date"]));
            });
            updateReleaseTable(data);
        });
    });
});

function updateReleaseTable(allData){
    $.get('/hbs/archived_list.hbs', function (data) {
        var template=Handlebars.compile(data);
        var elements = $('<div class="cInstallers"></div>');
        allData.forEach(function (item) {
            var allArtifact = [];
            if(item["linux-installer"]){
                allArtifact.push(item["linux-installer"]);
            }
            if(item["windows-installer"]){
                allArtifact.push(item["windows-installer"]);
            }
            if(item["macos-installer"]){
                allArtifact.push(item["macos-installer"]);
            }
            if(item["other-artefacts"] && item["other-artefacts"].length > 0){
                allArtifact = allArtifact.concat(item["other-artefacts"]);
            }

            var halfWayThough = Math.ceil(allArtifact.length / 2);
            item["lefttable"] = allArtifact.slice(0, halfWayThough);
            item["righttable"] = allArtifact.slice(halfWayThough, allArtifact.length);
            elements.append(template(item));
        });
        $("#archived-versions").after(elements);
        allData.forEach(function (item) {
            var version = item["version"];
            var releaseNoteUrl = getReleaseNoteURL(version);
            if(releaseNoteUrl){
                $.get( releaseNoteUrl, function( data ) {
                    $("#"+getReleaseNotesDivId(version)).html( data );
                });
            }

        },'html');

    }, 'html');
}

function getReleaseNotesDivId(version){
    var suffix = "-notes";
    return (version+suffix).replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "");
}

function getReleaseNoteURL(version){
    return base_download_url+"/"+version+"/"+releaseNoteFilename;
}