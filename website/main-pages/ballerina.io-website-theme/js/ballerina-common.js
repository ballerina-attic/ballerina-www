$(document).ready(function() {

    var menu = '<div class="container">'
+'<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">'
+'<nav class="navbar">'
+'<div>'
+'<div class="navbar-header">'
+'<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">'
+'<span class="sr-only">&#9776</span>'
+'<span class="icon-bar"></span>'
+'<span class="icon-bar"></span>'
+'<span class="icon-bar"></span>'
+'</button>'
+'<p class="navbar-brand cTagLine" href="#">Cloud Native Programming Language'
+'<a class="cMobileLogo" href="." ><img src="/img/ballerina-logo.svg" alt="Ballerina"/></a>'
+'</p>'
+'</div>'
+'<div id="navbar" class="collapse navbar-collapse">'
+'<ul class="nav navbar-nav cTopNav">'
+'<li class="active toctree-l1" id="learnli"><a href="/learn">Learn</a></li>'
+'<li class="toctree-l1" id="philosophyli"><a href="/philosophy">Philosophy</a></li>'
+'<li class="toctree-l1" id="openli"><a href="/open-source">Open Source</a></li>'
+'<li class="toctree-l1" id="helpli"><a href="/help">Help </a></li>'
+'<li class="toctree-l1" id="blogli"><a href="https://blog-stage.ballerina.io/"> Blog </a></li>'
+'<li class="toctree-l1"><a class="cSerachIcon" href="#"><img src="/img/search.svg"/></a>'
+'<div class="cSearchBoxTopMenu">'
+'<div role="search">'
+'<form id ="rtd-search-form" class="wy-form" action="./search.html" method="get">'
+'<input type="text" name="q" placeholder="Search" />'
+'</form>'
+'</div></div>'
+'</li>'
+'</ul>'
+'</div>'
+'</div>'
+'</nav>'
+'</div>'
+'</div>';




    $('#iMainNavigation').append(menu);
//    $('#iBallerinaFooter').append(footer);
    
    
});

$(document).ready(function () {
             
         $(".cRuntimeContent").addClass('cShow');
         
         $(".cRUNTIME").click(function() {
         $(".cRuntimeContent").addClass('cShow');
         $(".cDeploymentContent").removeClass('cShow');
         $(".cLifecycleContent").removeClass('cShow');

             });
             
             
         $(".cDEPLOYMENT").click(function() {
         $(".cRuntimeContent").removeClass('cShow');
         $(".cDeploymentContent").addClass('cShow');
         $(".cLifecycleContent").removeClass('cShow');

             });
             
             
         $(".cLIFECYCLE").click(function() {
         $(".cRuntimeContent").removeClass('cShow');
         $(".cDeploymentContent").removeClass('cShow');
         $(".cLifecycleContent").addClass('cShow');

             });
             
             
         $(".cSerachIcon").click(function() {
         $(".cSearchBoxTopMenu").toggleClass('cShowcSearchTopMenu');
        

             });
             
             
             
});