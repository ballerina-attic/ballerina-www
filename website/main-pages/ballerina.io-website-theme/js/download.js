$(document).ready(function () {

		// Getting latest release information
		var latest_pack = {
				"version": "0.970.0 alpha1",
				"release-date": "Apr 03, 2018",
				"windows-installer": "ballerina-platform-windows-installer-64x-0.970.0.msi",
				"windows-installer-size": "82mb",
				"linux-installer": "ballerina-platform-linux-installer-64x-0.970.0.deb",
				"linux-installer-size": "91.1mb",
				"macos-installer": "ballerina-platform-mac-installer-64x-0.970.0.pkg",
				"macos-installer-size": "98.2mb",
				"other-artefacts": [
						"ballerina-runtime-0.970.0.zip",
						"ballerina-platform-0.970.0.zip",
						"Ballerina-runtime-windows-installer-64x-0.970.0.msi",
						"ballerina-runtime-linux-installer-64x-0.970.0.deb",
						"ballerina-runtime-linux-installer-64x-0.970.0.rpm",
						"ballerina-runtime-mac-installer-64x-0.970.0.pkg",
						"ballerina-platform-linux-installer-64x-0.970.0.rpm"
				],
				"api-docs": "ballerina-api-docs-0.970.0.zip",
				"release-notes": "ballerina-release-notes-0.970.0.md"
		};

		var version = latest_pack['version'];
		var version_pack = version.replace(/ /g, "-").toLowerCase();
		var released_date = latest_pack['release-date'];
		var windows_pack = "ballerina-" + version_pack + "-windows-x64.msi";
		var windows_pack_size = "";
		var linux_pack = "ballerina-" + version_pack + "-linux-x64.deb";
		var linux_pack_size = "";
		var macos_pack = "ballerina-" + version_pack + "-macos-x64.pkg";
		var macos_pack_size = "";

		var product_dist_path = "https://product-dist.ballerina.io/downloads/" + version_pack + "/";

		$("#versionInfo").html(version + "(" + released_date + ")");
		$("#stableInfo").html(version + "(" + released_date + ")");

		$("#packWindowsName").html(windows_pack +" ("+windows-installer-size+")");
		$("#packWindows").attr("href", product_dist_path + windows_pack);
		$("#packWindowsMd5").attr("href", product_dist_path + windows_pack + ".md5");
		$("#packWindowsSha1").attr("href", product_dist_path + windows_pack + ".sha1");
		$("#packWindowsAsc").attr("href", product_dist_path + windows_pack + ".asc");

		$("#packLinuxName").html(linux_pack +" ("+linux-installer-size+")");
		$("#packLinux").attr("href", product_dist_path + linux_pack);
		$("#packLinuxMd5").attr("href", product_dist_path + linux_pack + ".md5");
		$("#packLinuxSha1").attr("href", product_dist_path + linux_pack + ".sha1");
		$("#packLinuxAsc").attr("href", product_dist_path + linux_pack + ".asc");

		$("#packMacName").html(macos_pack +" ("+macos-installer-size+")");
		$("#packMac").attr("href", product_dist_path + macos_pack);
		$("#packMacMd5").attr("href", product_dist_path + macos_pack + ".md5");
		$("#packMacSha1").attr("href", product_dist_path + macos_pack + ".sha1");
		$("#packMacAsc").attr("href", product_dist_path + macos_pack + ".asc");

		var i = 0;
		$.each(latest_pack['other-artefacts'], function (key, value) {

				release_content = "<tr>";
				release_content += '<td style="width: 65%"><a href="' + product_dist_path + value + '" class="cLinkBlack">' + value + '</a></td>';
				release_content += '<td style="width: 14%"><a href="' + product_dist_path + value + '.md5">md5</a></td>';
				release_content += '<td style="width: 15%"><a href="' + product_dist_path + value + '.sha1">SHA-1</a></td>';
				release_content += '<td style="width: 6%"><a href="' + product_dist_path + value + '.asc">asc</a></td>';
				release_content += "</tr>";

				var row_id = i % 2;
				$("#insPackages" + row_id).append(release_content);
				i++;
		});
});
