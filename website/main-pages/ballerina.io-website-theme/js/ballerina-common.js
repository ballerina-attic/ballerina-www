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
+'<li class="toctree-l1"><a href="https://staging-central.ballerina.io/">Central</a></li>'
+'<li class="toctree-l1" id="openli"><a href="/open-source">Open Source</a></li>'
+'<li class="toctree-l1" id="helpli"><a href="/help">Help </a></li>'
+'<li class="toctree-l1" id="blogli"><a href="https://blog-stage.ballerina.io/"> Blog </a></li>'
+'<li class="toctree-l1"><a class="cSerachIcon" href="#"><img src="/img/search.svg"/></a>'
+'<div class="cSearchBoxTopMenu">'
+'<div role="search">'
+'<form role="form">'
+'<div class="form-group">'
+'<input type="text" class="form-control" placeholder="Search..." id="mkdocs-search-query" autocomplete="off">'
+'</div>'
+'</form>'
+'<div id="mkdocs-search-results"></div>'
+'</div></div>'
+'</li>'
+'</ul>'
+'</div>'
+'</div>'
+'</nav>'
+'</div>'
+'</div>';



var footer =  '<div class="container">'
+'<div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 cBallerina-io-left-col cBallerinaFooterLinks">'
+'<ul>'
+'<li><a href="/downloads">Download</a></li>'
+'<li><a href="https://github.com/ballerina-lang/ballerina/blob/master/LICENSE">Code License</a></li>'
+'<li><a href="/license-of-site">Site License</a></li>'
+'<li><a href="/terms-of-service">TERMS OF SERVICE</a></li>'
+'<li><a href="/terms-of-service">PRIVACY POLICY</a></li>'
+'</ul>'
+'</div>'
+'<div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 cBallerina-io-middle-col cBallerinaFooterSignUp">'
+'<p><span>Announcement List</span><br/>'
+'<div class="cFormContainer">'
+'<form>'
+'<div class="cFieldContainer">'
+'<input maxlength="90" value="" id="emailUser" name="email" placeholder="Email" title="Email" type="text">'
+'</div>'
+'<div class="cButtonContainer">'
+'<a class="cBallerinaButtons subscribeUserForm" href="" id="subscribeUserButton"></a>'
+'</div>'
+'</form>'
+'</div>'
+'<div class="cSocialmedia">'
+'<ul>'
+'<li>'
+'<a href="https://github.com/ballerina-platform"><img src="/img/github.svg"/></a>'
+'</li>'
+'<li><a href="https://stackoverflow.com/questions/tagged/ballerina"><img src="/img/stackoverflow.svg"/></a></li>'
+'<li><a href="https://twitter.com/ballerinaplat"><img src="/img/twitter.svg"/></a></li>'
+'<li><a href="https://ballerina-platform.slack.com"><img src="/img/slack.svg"/></a></li>'
+'</ul>'
+'<div class="pdframe"></div>'
+'</div>'
+'</div>'
+'<div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 cBallerina-io-right-col">'
+'<p>In the creation of Ballerina, we were inspired by so many technologies. Thank you to all that have come before us (and forgive us if we missed one): Go, Kotlin, Java, Rust, Bootstrap, JavaScript, Jenkins, NPM, Crates, Maven, Gradle, Kubernetes, Envoy, Docker, Microsoft VS Code, Jetbrains IntelliJ, Eclipse Che, WSO2, mkdocs and GitHub.</div>'
+'</div>';


$('#iMainNavigation').append(menu);
$('#iBallerinaFooter').append(footer);


$("code").addClass('cBasicCode');
$(".ballerina").removeClass('cBasicCode');
$(".bash").removeClass('cBasicCode');

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
            if($(".cSearchBoxTopMenu").hasClass('cShowcSearchTopMenu')){
                $("#mkdocs-search-query").focus()
            }
         });

         //subscribe form
         $("#subscribeUserButton").click(function (event) {
             event.preventDefault();
             subscribeUser($(this).val());
         });

         $('#emailUser').on('keypress', function (event) {
            if(event.which === 13){
              event.preventDefault();
               $(this).attr("disabled", "disabled");
               subscribeUser($(this).val());
               $(this).removeAttr("disabled");
            }
        });
});

function subscribeUser(email){
  $('#subscribeUserMessage').remove("");
  if (email == "") {
      $('.cFormContainer').append('<span id="subscribeUserMessage">Please enter your email</span>');
  } else if (!isEmail(email)) {
      $('.cFormContainer').append('<span id="subscribeUserMessage">Please enter a valid email</span>');
  } else {
      $('.cFieldContainer').hide();
      $('.cButtonContainer').hide();
      $(".pdframe").html("<iframe src='https://go.pardot.com/l/142131/2018-03-26/4yl979?email=" + email + "'></iframe>");
      $('.cFormContainer').append('<span id="subscribeUserMessage">Thank you! Stay tuned for updates on Ballerina.</span>');
      $("#emailUser").val("");
  }
  return;
}

function isEmail(email) {
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email);
}
/*
Following script is adding line numbers to the ballerina code blocks in the gneerated documentation
*/
$(document).ready(function(){
    $('pre > code.ballerina').each(function(){
        //cont the number of rows
        //Remove the new line from the end of the text
        var numberOfLines = $(this).text().replace(/\n$/, "").split(/\r\n|\r|\n/).length;
        var lines = '<div class="line-numbers-wrap">';

        //Iterate all the lines and create div elements with line number
        for(var i=1; i <= numberOfLines; i++){
            lines = lines + '<div class="line-number">'+i+'</div>';
        }
        lines = lines + '</div>';
        //calculate <pre> height and set it to the container
        var preHeight = numberOfLines*25 + 20;
        $(this).parent()
            .height(preHeight)
            .addClass('ballerina-pre-wrapper')
            .prepend(
                $(lines)
            );
    });

    $('.cBBE-body:not(.cOutput)').each(function(){
        var count = 0;

        $('.cTR', this).each(function(i, n){
            var $codeElem = $(n).find('td.code').get(0);
            var lines = $('> td.code', n).text().replace(/\n$/, "").trim().split(/\r\n|\r|\n/);
            var numbers = [];

            $.each(lines, function(i){
                count += 1;
                numbers.push('<span class="line-number">' + count + '</span>');
            });

            $( "<div/>", {
                "class": "bbe-code-line-numbers",
                html: numbers.join("")
            }).prependTo($codeElem);
        });
    });
})
