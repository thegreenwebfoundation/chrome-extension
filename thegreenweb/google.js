/* 
 * Google search pagemod functions
 * 
 * @author Arend-Jan Tetteroo <aj@cleanbits.net>
 * @copyright Cleanbits/The Green Web Foundation 2010-2011
 */

/**
 * On Request, find all hrefs and assign green or grey icon
 */
chrome.extension.onRequest.addListener(
    function(request, sender, sendResponse) {
        if (request.data){
            data = request.data;
            var links = $('span .Cleanbits');
            $(links).each(function (i) {            
                if(data[i]){
                    $(this).html(getResult(data[i]));
                    if(data[i].poweredby) {
                        $(this).next().css('background-color', '#DBFA7F');
                    }else{
                    }
                }
            });
            sendResponse({});
        }else{
            sendResponse({}); // snub them.
        }
    });

/**
 * If document is ready, find the urls to check
 */
$(document).ready(function() {
    $('#res').append("<p id='thegreenweb'>" + getLinkImage('green','The Green Web extension shows if a site is sustainably hosted') + ' The Green Web is enabled<span id=\'thegreenwebenabled\'/></p>');

    (function checkLoop() {
        // Check if search results have 'cleanbits' link
        if ( $('.Cleanbits').length != $('.tl').length) {
			
            // Remove all cleanbits links
            $('.Cleanbits').remove();
			
            // Add cleanbits link to each google listing
            $('.tl').prepend(' <span class="Cleanbits">' + getImage('greenquestion') + '&nbsp;</span>');
			
            // Check urls to see if search results are green/grey
            var locs = new Array();
            var links = $('span .Cleanbits').next();
            $(links).each(function (i) {
                var loc = $(this).find('a').first().attr('href');
                locs[i] = getUrl(loc);
            });
            if(locs.length > 6) {
                chrome.extension.sendRequest({
                    locs: locs
                }, function(response) {
                });
            }
        }
        setTimeout(checkLoop, 100);
    })();
});