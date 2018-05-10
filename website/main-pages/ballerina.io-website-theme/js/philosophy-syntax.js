/*
We extract the file name from the link text.
Replace the space with a hyphan and make all text simple case
For example "REST Services" will become "rest-services"
Then we look for the file "rest-services.txt" in the samples folder.
if the data-run attribute is present in the link
we search for a file "rest-services-run.txt" file as well
*/
var lineHeight = 18;
var topPadding = 4;
var codeBoxOffset = 2;
var codeOutputBoxOffset = 5;
var editor = null,
    editorRun = null;

var loadData = function(linkText, sectionId, init) {
    var fileName = linkText.toLowerCase().replace(/\s/g, "-");
    var codeBlockBgColor = (sectionId == 'integration') ? '#fff' : '#f5f6f6';

    $('#' + sectionId + ' .text-display').hide();
    $('#' + sectionId + ' .shell-display').hide();
    $('#' + sectionId + ' .code-block').hide().removeClass('active');

    $.ajax({
        url: "../samples/" + fileName + ".out",
        method: "GET",
        success: function(data) {
            $('#' + fileName + "-shell").text(data).show();
        },
        error: function(data) {
            $('#' + fileName + "-shell").show();
        }
    });

    $('#' + fileName + "-text").show();
    $('#' + fileName + "-code").show().attr('style', 'display: flex;' +
        'background: ' + codeBlockBgColor + '; ' +
        'border-radius: 0; ' +
        'margin-bottom: 0').addClass('active');
    $('#' + fileName + "-code > code").show().attr('style', 'white-space:pre; width: 100%;');

    $.ajax({
        url: "../samples/" + fileName + ".bal",
        method: "GET",
        success: function(data) {
            //Set the code to the container
            var highlightCode = hljs.highlightAuto;
            $('#' + fileName + "-code > code").text(data);

            //Doing the syntax highlighting
            hljs.highlightBlock($('#' + fileName + "-code > code").get(0));

            //Remove any existing line numbers
            $('#' + sectionId + ' .line-numbers-wrap').remove();

            //If not the fist load ( document ready callback ) we add the line numbers
            if (!init) {
                //cont the number of rows
                //Remove the new line from the end of the text
                var numberOfLines = data.split(/\r\n|\r|\n/).length;
                var lines = '<div class="line-numbers-wrap">';

                //Iterate all the lines and create div elements with line number
                for (var i = 1; i <= numberOfLines; i++) {
                    lines = lines + '<div class="line-number">' + i + '</div>';
                }
                lines = lines + '</div>';
                //calculate <pre> height and set it to the container
                var preHeight = numberOfLines * 18 + 20;
                $('#' + fileName + "-code")
                    .height(preHeight)
                    .addClass('ballerina-pre-wrapper')
                    .prepend($(lines));

                //position code description boxes to align with highlighting area
                $('#' + fileName + "-code").closest('.code-wrapper').find('.overlay-highlight').remove();
                $('#' + fileName + '-text ' + '.hTrigger').each(function(i, n) {
                    var startLine = $(this).attr('data-startLine');
                    var endLine = $(this).attr('data-endLine');
                    var overlayStartPosition = topPadding + (startLine - 1) * lineHeight + 30 + codeBoxOffset;
                    var overlayHeight = (endLine - (startLine - 1)) * lineHeight;
                    var topPosition = overlayStartPosition;
                    var hightLighterPosition = topPosition;
                    var hightlighterId = (fileName + '-highlighter-' + i);
                    var offset = 0;

                    if ($(this).prev().length >= 0) {
                        var prevElemBottom = $(this).prev().height() + parseInt($(this).prev().css('top')) + 20;

                        if ($(this).hasClass('cOutputDesription')) {
                            topPosition = (($('#' + fileName + '-code').height() + overlayStartPosition) + codeOutputBoxOffset);
                        }

                        hightLighterPosition = topPosition;

                        if (topPosition < prevElemBottom) {
                            topPosition = prevElemBottom;
                        }
                    }

                    $(this)
                        .css('top', topPosition)
                        .attr('data-toggle-highlight', hightlighterId);

                    $(this)
                        .closest('.container')
                        .find('.code-wrapper')
                        .prepend('<div id="' + hightlighterId + '" class="overlay-highlight"></div>');

                    $('#' + hightlighterId)
                        .css('top', ((hightLighterPosition - 30) + offset))
                        .css('height', overlayHeight);
                });

                var $lastCodeDescriptionBox = $('#' + fileName + '-text ' + '.hTrigger:last-child');
                var codeboxContainerHeight = $lastCodeDescriptionBox.height() + parseInt($lastCodeDescriptionBox.css('top')) + 20;
                $('#' + fileName + '-text').css('height', codeboxContainerHeight);
            }
        }
    });

};

function setTooltip(btn, message) {
    $(btn).attr('data-original-title', message)
        .tooltip('show');
}

function hideTooltip(btn) {
    setTimeout(function() {
        $(btn).tooltip('hide').removeAttr('data-original-title');
    }, 1000);
}

$(document).ready(function() {
    //Load data on click callback
    $('#nativeLanguage li.links').click(function() {
        loadData($(this).text(), 'nativeLanguage', false);
        $('#nativeLanguage li.links').removeClass('cActive');
        $(this).addClass('cActive');
    });
    $('#integration li.links').click(function() {
        loadData($(this).text(), 'integration', false);
        $('#integration li.links').removeClass('cActive');
        $(this).addClass('cActive');
    });

    //Load data on page load
    loadData($('#nativeLanguage li.first').text(), 'nativeLanguage', false);
    loadData($('#integration li.first').text(), 'integration', false);
    $('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
        var target = $(e.target).attr("href") // activated tab
        if (target === "#3b") {
            $('#type-system-code .line-numbers-wrap').remove();
            loadData('type-system', 'dummyXoXo', false);
        }
    });

    $('.codeSampleBoxes .hTrigger').hover(function(e) {
            $('#' + $(this).data('toggle-highlight')).css('opacity', 0.2);
        },
        function() {
            $('.overlay-highlight').css('opacity', 0);
        }
    );


    /*
     * Code hints hightlighting method
     */
    var $codeWrapper = $('.code-wrapper');

    $codeWrapper.on('mouseenter', '.overlay-highlight', function(e) {
        $('#' + $(e.currentTarget).data('toggle-highlight')).css('opacity', 0.2);
        $('[data-toggle-highlight="' + $(this).attr('id') + '"]')
            .addClass('active');
    });

    $codeWrapper.on('mouseout', '.overlay-highlight', function(e) {
        $('#' + $(e.currentTarget).data('toggle-highlight')).css('opacity', 0);
        $('[data-toggle-highlight="' + $(this).attr('id') + '"]')
            .removeClass('active');
    });

    $codeWrapper.on('mousedown contextmenu', function(e) {
        $('.overlay-highlight', e.currentTarget).css('z-index', -1);
    });

    $codeWrapper.on('mouseup mouseleave', function(e) {
        $('.overlay-highlight', e.currentTarget).css('z-index', 3);
    });


    /*
     * Register "copy to clipboard" event to elements with "copy" class
     */
    var clipboard = new ClipboardJS('.copy', {
        text: function(trigger) {
            return $(trigger).closest('.cPhilosophyWidget').find('.code-wrapper pre.code-block.active code').text();
        }
    });

    // Register events show hide tooltip on click event
    clipboard.on('success', function(e) {
        setTooltip(e.trigger, 'Copied!');
        hideTooltip(e.trigger);
    });

    clipboard.on('error', function(e) {
        setTooltip(e.trigger, 'Failed!');
        hideTooltip(e.trigger);
    });

    $('.copy').tooltip({
        trigger: 'click',
        placement: 'bottom'
    });

    $("a.copy").unbind("click");
});