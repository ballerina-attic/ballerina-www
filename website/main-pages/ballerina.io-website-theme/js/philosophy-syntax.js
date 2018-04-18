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
var codeOutputBoxOffset = 7;
var editor = null,
    editorRun = null;

/*
 * Register ballerina language for highlightJS
 * Grammer: https://github.com/ballerina-platform/ballerina-lang/blob/master/compiler/ballerina-lang/src/main/resources/grammar/BallerinaLexer.g4
 */
hljs.registerLanguage('ballerina', function() {
    return {
        "k": "package import as public private native service resource function object annotation parameter transformer worker endpoint " +
            "bind xmlns returns version documentation deprecated new if else match foreach while next break fork join some all timeout " +
            "try catch finally throw return transaction abort fail onretry retries onabort oncommit lengthof with in lock untaint start await but check",
        "i": {},
        "c": [{
            "cN": "ballerinadoc",
            "b": "/\\*\\*",
            "e": "\\*/",
            "r": 0,
            "c": [{
                "cN": "ballerinadoctag",
                "b": "(^|\\s)@[A-Za-z]+"
            }]
        }, {
            "cN": "comment",
            "b": "//",
            "e": "$",
            "c": [{
                "b": {}
            }, {
                "cN": "label",
                "b": "XXX",
                "e": "$",
                "eW": true,
                "r": 0
            }]
        }, {
            "cN": "comment",
            "b": "/\\*",
            "e": "\\*/",
            "c": [{
                "b": {}
            }, {
                "cN": "label",
                "b": "XXX",
                "e": "$",
                "eW": true,
                "r": 0
            }, "self"]
        }, {
            "cN": "string",
            "b": "\"",
            "e": "\"",
            "i": "\\n",
            "c": [{
                "b": "\\\\[\\s\\S]",
                "r": 0
            }, {
                "cN": "constant",
                "b": "\\\\[abfnrtv]\\|\\\\x[0-9a-fA-F]*\\\\\\|%[-+# *.0-9]*[dioxXucsfeEgGp]",
                "r": 0
            }]
        }, {
            "cN": "number",
            "b": "(\\b(0b[01_]+)|\\b0[xX][a-fA-F0-9_]+|(\\b[\\d_]+(\\.[\\d_]*)?|\\.[\\d_]+)([eE][-+]?\\d+)?)[lLfF]?",
            "r": 0
        }, {
            "cN": "annotation",
            "b": "@[A-Za-z]+"
        }, {
            "cN": "type",
            "b": "\\b(int|float|boolean|string|blob|map|jsonOptions|json|xml|table|stream|any|typedesc|type|future|var|error)",
        }]
    };
});

var loadData = function(linkText, sectionId, init) {
    var fileName = linkText.toLowerCase().replace(/\s/g, "-");
    $('#' + sectionId + ' .text-display').hide();
    $('#' + sectionId + ' .shell-display').hide();
    $('#' + sectionId + ' .code-block').hide();

    $.ajax({
        url: "../samples/" + fileName + "-shell.txt",
        method: "GET",
        success: function(data) {
            $('#' + fileName + "-shell").html(data).show();
        },
        error: function(data) {
            $('#' + fileName + "-shell").show();
        }
    });

    $('#' + fileName + "-text").show();
    $('#' + fileName + "-code").show().attr('style', 'display: flex;' +
        'background: #fff; ' +
        'border-radius: 0; ' +
        'margin-bottom: 0');
    $('#' + fileName + "-code > code").show().attr('style', 'white-space:pre; width: 100%;');

    $.ajax({
        url: "../samples/" + fileName + ".txt",
        method: "GET",
        success: function(data) {
            //Set the code to the container
            var highlightCode = hljs.highlightAuto;
            $('#' + fileName + "-code > code").html(data);

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
                $('#' + fileName + '-text ' + '.hTrigger').each(function() {
                    var startLine = $(this).attr('data-startLine');
                    var overlayStartPosition = topPadding + (startLine - 1) * lineHeight + 30;
                    var topPosition = overlayStartPosition;

                    if ($(this).prev().length > 0) {
                        var prevElemBottom = $(this).prev().height() + parseInt($(this).prev().css('top')) + 20;

                        if (overlayStartPosition < prevElemBottom) {
                            topPosition = prevElemBottom;
                            $(this).css('background-image', 'none');
                        }
                    }

                    $(this).css('top', topPosition);
                });

                var $lastCodeDescriptionBox = $('#' + fileName + '-text ' + '.hTrigger:last-child');
                var codeboxContainerHeight = $lastCodeDescriptionBox.height() + parseInt($lastCodeDescriptionBox.css('top')) + 20;
                $('#' + fileName + '-text').css('height', codeboxContainerHeight);
            }
        }
    });

};

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
});

/*
Given line number range this code apply a overlay on top of the syntax hilighting 
*/
function highlightCodeSection(startLine, endLine, codeBoxId, highlighter, offset) {
    if (typeof startLine === 'string') { startLine = parseInt(startLine); }
    if (typeof endLine === 'string') { endLine = parseInt(endLine); }

    var overlayHeight = (endLine - (startLine - 1)) * lineHeight;
    var overlayStartPosition = topPadding + (startLine - 1) * lineHeight;
    $('#' + codeBoxId + ' ' + highlighter).css('top', (overlayStartPosition + offset)).css('height', overlayHeight);
}

$(document).ready(function() {
    $('.codeSampleBoxes .hTrigger').hover(function(e) {
            var startLine = $(this).attr('data-startLine');
            var endLine = $(this).attr('data-endLine');
            var highlighter = '.overllay-highlight';
            var offset = 0;

            if ($(this).hasClass('cOutputDesription')) {
                highlighter = '.output-overllay-highlight';
                offset = codeOutputBoxOffset;
            }

            highlightCodeSection(startLine, endLine, $(e.currentTarget).closest('.container').find('.code-wrapper').attr('id'), highlighter, offset);
        },
        function() {
            $('.code-wrapper .overllay-highlight').css('top', 0).css('height', 0);
            $('.code-wrapper .output-overllay-highlight').css('top', 0).css('height', 0);
        }
    );
});