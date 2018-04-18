$(document).ready(function() {

    $("#iReleseNotes").click(function() {
        $(".cReleseNotePannel").toggleClass('cShowPlannel');
        $("#iReleseNotes").toggleClass('cShowPlannel');
    });

    // Getting latest release information
    $.getJSON(latest_versions_json, function(latest_pack) {

        var version = latest_pack['version'];
        var version_pack = version.replace(/ /g, "-").toLowerCase();
        var released_date = latest_pack['release-date'];
        var windows_pack = latest_pack['windows-installer'];
        var windows_pack_size = latest_pack['windows-installer-size'];
        var linux_pack = latest_pack['linux-installer'];
        var linux_pack_size = latest_pack['linux-installer-size'];
        var macos_pack = latest_pack['macos-installer'];
        var macos_pack_size = latest_pack['macos-installer-size'];

        var product_dist_path = base_download_url + "/" + version_pack + "/";

        $("#versionInfo").html(version + " (" + formatDate(released_date) + ")");
        $("#stableInfo").html(version + " (" + formatDate(released_date) + ")");

        $("#packWindowsName").html(windows_pack + " (" + windows_pack_size + ")");
        $("#packWindows").attr("href", product_dist_path + windows_pack);
        $("#packWindowsMd5").attr("href", product_dist_path + windows_pack + ".md5");
        $("#packWindowsSha1").attr("href", product_dist_path + windows_pack + ".sha1");
        $("#packWindowsAsc").attr("href", product_dist_path + windows_pack + ".asc");

        $("#packLinuxName").html(linux_pack + " (" + linux_pack_size + ")");
        $("#packLinux").attr("href", product_dist_path + linux_pack);
        $("#packLinuxMd5").attr("href", product_dist_path + linux_pack + ".md5");
        $("#packLinuxSha1").attr("href", product_dist_path + linux_pack + ".sha1");
        $("#packLinuxAsc").attr("href", product_dist_path + linux_pack + ".asc");

        $("#packMacName").html(macos_pack + " (" + macos_pack_size + ")");
        $("#packMac").attr("href", product_dist_path + macos_pack);
        $("#packMacMd5").attr("href", product_dist_path + macos_pack + ".md5");
        $("#packMacSha1").attr("href", product_dist_path + macos_pack + ".sha1");
        $("#packMacAsc").attr("href", product_dist_path + macos_pack + ".asc");

        var i = 0;
        $.each(latest_pack['other-artefacts'], function(key, value) {

            release_content = "<tr>";
            release_content += '<td style="width: 96%">' + value + '</td>';
            release_content += '<td style="width: 1%; white-space: nowrap;"><a href="' + product_dist_path + value + '" class="cDownloadLinkIcon"><img src="../img/download-bg-green-fill.svg"></a></td>';
            release_content += '<td style="width: 1%; white-space: nowrap;"><a href="' + product_dist_path + value + '.md5">md5</a></td>';
            release_content += '<td style="width: 1%; white-space: nowrap;"><a href="' + product_dist_path + value + '.sha1">SHA-1</a></td>';
            release_content += '<td style="width: 1%; white-space: nowrap;"><a href="' + product_dist_path + value + '.asc">asc</a></td>';
            release_content += "</tr>";

            if (i < latest_pack['other-artefacts'].length / 2) {
                var row_id = 0;
            } else {
                var row_id = 1;
            }
            $("#insPackages" + row_id).append(release_content);
            i++;
        });
    });

    //Nightly Packages
    var nightly_pack = "";
    $("#nightlyPackContainer").hide();

    $.getJSON(nightly_versions_json, function(nightly_pack) {

        $("#nightlyPackContainer").show();
        var version = nightly_pack['version'];
        var version_pack = version.replace(/ /g, "-").toLowerCase();
        var released_date = nightly_pack['release-date'];

        $("#nightlyInfo").html(version + " (" + formatDate(released_date) + ")");
        var nightly_packs = $.merge([nightly_pack['windows-installer'], nightly_pack['linux-installer'], nightly_pack['macos-installer']], nightly_pack['other-artefacts']);
        var i = 0;
        var product_dist_path = nightly_download_url + "/";

        if (nightly_packs.length == 0) {
            $("#nightlyPackContainer").hide();
        }

        $.each(nightly_packs, function(key, value) {

            release_content = "<tr>";
            release_content += '<td style="width: 96%">' + value + '</td>';
            release_content += '<td style="width: 1%; white-space: nowrap;"><a href="' + product_dist_path + value + '" class="cDownloadLinkIcon"><img src="../img/download-bg-green-fill.svg"></a></td>';
            release_content += '<td style="width: 1%; white-space: nowrap;"><a href="' + product_dist_path + value + '.md5">md5</a></td>';
            release_content += '<td style="width: 1%; white-space: nowrap;"><a href="' + product_dist_path + value + '.sha1">SHA-1</a></td>';
            release_content += '<td style="width: 1%; white-space: nowrap;"><a href="' + product_dist_path + value + '.asc">asc</a></td>';
            release_content += "</tr>";

            if (i < nightly_packs.length / 2) {
                var row_id = 0;
            } else {
                var row_id = 1;
            }
            $("#nightlyPackages" + row_id).append(release_content);
            i++;
        });
    }).fail(function() {$("#nightlyPackContainer").hide();});
});
