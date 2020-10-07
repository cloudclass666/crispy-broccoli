/**
 * Element Name: Progress Pie
 */

(function ($, window, document) {
    "use strict";

    $(document).on('ready', function () {

        let $progressPie = $( '.eplus-progress-pie' );

        if ( ! $progressPie.length ) {
            return;
        }

        $progressPie.appear(function () {
            let progressPie = '#' + $(this).attr('id');

            $(progressPie).asPieProgress({
                namespace: "pieProgress",
                classes: {
                    svg: "eplus-progress-pie-svg",
                    number: "eplus-progress-pie-number"
                }
            });

            $(progressPie).asPieProgress("start");

        });

    });

})(jQuery, window, document);