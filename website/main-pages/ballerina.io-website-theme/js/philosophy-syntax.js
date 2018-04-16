/*
We extract the file name from the link text.
Replace the space with a hyphan and make all text simple case
For example "REST Services" will become "rest-services"
Then we look for the file "rest-services.txt" in the samples folder.
if the data-run attribute is present in the link
we search for a file "rest-services-run.txt" file as well
*/
var  editor = null ,editorRun = null;
var loadData = function(linkText, sectionId, init){
var fileName = linkText.toLowerCase().replace(/\s/g, "-");
$('#' + sectionId + ' .text-display').hide();
$('#' + sectionId + ' .shell-display').hide();
$('#' + sectionId + ' .code-block').hide();
$.ajax(
	{
		url: "../samples/" + fileName + "-shell.txt",
		method: "GET",
		success: function(data){
			$('#'+fileName + "-shell").html(data).show();
		},
		error: function(data){
			$('#'+fileName + "-shell").show();
		}
	});
$('#'+fileName + "-text").show();
$('#'+fileName + "-code").show().attr('style','display: flex;'+ 
										'background: #fff; '+
										'border-radius: 0; '+
										'margin-bottom: 0');
$('#'+fileName + "-code > code").show().attr('style','padding-left:20px;padding-top: 10px;white-space:pre');

$.ajax(
	{
		url: "../samples/" + fileName + ".txt",
		method: "GET",
		success: function(data){
			//Set the code to the container
			var highlightCode = hljs.highlightAuto
			$('#'+fileName + "-code > code").html(data);

			//Doing the syntax highlighting
			hljs.highlightBlock($('#'+fileName + "-code > code").get(0));

			//Remove any existing line numbers
			$('#' + sectionId + ' .line-numbers-wrap').remove();
			
			//If not the fist load ( document ready callback ) we add the line numbers
			if(!init) {
				//cont the number of rows
				//Remove the new line from the end of the text
				var numberOfLines = data.split(/\r\n|\r|\n/).length;
				var lines = '<div class="line-numbers-wrap">';

				//Iterate all the lines and create div elements with line number
				for(var i=1; i <= numberOfLines; i++){
					lines = lines + '<div class="line-number">'+i+'</div>';
				}
				lines = lines + '</div>';
				//calculate <pre> height and set it to the container
				var preHeight = numberOfLines*18 + 20;
				$('#'+fileName + "-code")
					.height(preHeight)
					.addClass('ballerina-pre-wrapper')
					.prepend(
						$(lines)
					);
			}

			
		}
	});
		
}

$(document).ready(function(){
	//Load data on click callback
	$('#nativeLanguage li.links').click(function(){
		loadData($(this).text(), 'nativeLanguage', false);
		$('#nativeLanguage li.links').removeClass('cActive');
		$(this).addClass('cActive');
	});
	$('#integration li.links').click(function(){
		loadData($(this).text(), 'integration', false);
		$('#integration li.links').removeClass('cActive');
		$(this).addClass('cActive');
	});

	//Load data on page load
	loadData($('#nativeLanguage li.first').text(), 'nativeLanguage', false);
	loadData($('#integration li.first').text(), 'integration', false);
})