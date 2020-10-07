/**
 * Front Script
 */

(function ($, window, document, pluginObject) {
    "use strict";

    let $masonaryGrid = $('.pb-masonry');

    // on load event
    $(window).on('load', function (e) {
        $masonaryGrid.masonry({
            itemSelector: '.pb-masonry-item',
        });
    });

})(jQuery, window, document, eplus_object);







