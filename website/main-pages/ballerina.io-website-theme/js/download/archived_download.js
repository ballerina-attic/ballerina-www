$(document).ready(function () {
    Handlebars.registerHelper('basedownloadurl', function(version, artifact) {
        return new Handlebars.SafeString(Handlebars.Utils.escapeExpression(base_download_url+"/"+version+"/"+artifact))
    });
    Handlebars.registerHelper('releasenotesdiv', function(version, suffix) {
        return (version+suffix).replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "")
    });
    $.getJSON( archived_versions_json, function( data ) {
        data.sort(function(a, b) {
            return Date(a["release-date"]) > Date(b["release-date"]);
        });
        updateReleaseTable(data);
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
    }, 'html');
}