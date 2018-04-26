<link rel="stylesheet" href="/css/download-page.css"></link>
<script src="/js/download-page.js"></script>
<div class="row cBallerina-io-Gray-row">
    <div class="container">
        <div class="row">
            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 cDownloadsHeader">
                <h1>Downloads</h1>
                <p>
                    After downloading a release for your system, please follow the installation instructions. If you are building from source, follow the <a href="https://github.com/ballerina-platform/ballerina-lang/blob/master/README.md#install-from-source">build instructions</a>.
                </p>
            </div>
        </div>
        <div class="row">
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 cDownloadsHeader">       
                <div class="cFeaturedVersion">
                    <h2>Current version: <span id="versionInfo"></span></h2>
                </div>
            </div>
        </div>
        <div class="clearfix"></div>
        <div class="row cDownloads">
            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 cDownloadLeft">
                <a id="packWindows" id="packWindows" href="#" class="cDownload">
                    <div>Windows</div>
                    <div class="cSize">Installer msi <span id="packWindowsName"><span></div>
                </a>
                <ul class="cDiwnloadSubLinks">
                    <li><a id="packWindowsMd5" href="#">md5</a></li>
                    <li><a id="packWindowsSha1" href="#">SHA-1</a></li>
                    <li><a id="packWindowsAsc" href="#">asc</a></li>
                </ul>
            </div>
            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 cDownloadMiddle">
                <a id="packLinux" href="#" class="cDownload">
                    <div>Linux</div>
                    <div class="cSize">deb Package <span id="packLinuxName"></span></div>
                </a>
                <ul class="cDiwnloadSubLinks">
                    <li><a id="packLinuxMd5" href="#">md5</a></li>
                    <li><a id="packLinuxSha1" href="#">SHA-1</a></li>
                    <li><a id="packLinuxAsc" href="#">asc</a></li>
                </ul>
            </div>
            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 cDownloadMiddle">
                <a id="packMac" href="#" class="cDownload">
                    <div>MacOS</div>
                    <div class="cSize">Installer pkg <span id="packMacName"></span></div>
                </a>
                <ul class="cDiwnloadSubLinks">
                    <li><a id="packMacMd5" href="#">md5</a></li>
                    <li><a id="packMacSha1" href="#">SHA-1</a></li>
                    <li><a id="packMacAsc" href="#">asc</a></li>
                </ul>
            </div>
        </div>
        <div class="col-xs-12 col-sm-16 col-md-12 col-lg-12">
            <div class="cReleaseNotes">
                <p><a href="/downloads/release-notes">RELEASE NOTES ></a></p>
            </div>
            <div class="cReleaseNotes">
                <p><a href="/downloads/archived">ARCHIVED VERSIONS ></a></p>
            </div>
        </div>
        <div class="col-xs-12 col-sm-16 col-md-12 col-lg-12">
            <div class="cStandaloneInstallers">
                <h2>Installation Packages</h2>
                <div class="cInstallers">
                    <h3>Stable <span id="stableInfo"></span></h3>
                    <div class="col-xs-12 col-sm-16 col-md-6 col-lg-6 cLeftTable">
                        <div class="insPackages0container">
                            <table id="insPackages0"></table>
                        </div>
                    </div>
                    <div class="col-xs-12 col-sm-16 col-md-6 col-lg-6 cRightTable">
                        <div class="insPackages1container">
                            <table id="insPackages1"></table>
                        </div>
                    </div>
                    <div class="clearfix"></div>
                    <br>
                    <div id="nightlyPackContainer"><h3>Nightly <span id="nightlyInfo"></span></h3>
                    <div class="col-xs-12 col-sm-16 col-md-6 col-lg-6 cLeftTable">
                        <div class="nightlyPackages0container">
                            <table id="nightlyPackages0"></table>
                        </div>
                    </div>
                    <div class="col-xs-12 col-sm-16 col-md-6 col-lg-6 cRightTable">
                        <div class="nightlyPackages0container">
                            <table id="nightlyPackages1"></table>
                        </div>
                    </div></div>
                    <div class="clearfix"></div>
                </div>
            </div>            
        </div>
    </div>
</div>
