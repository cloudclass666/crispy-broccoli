/**
 * Element Name: Schedules
 */

(function ($, window, document) {
    "use strict";

    $(document).on('click', '.eplus-schedules .eplus-schedule .eplus-day-name', function () {

        let is_self = false;
        if( $(this).parent().hasClass('opened') ) is_self = true;

        $(this).parent().parent().find('.eplus-schedule').removeClass('opened').find('.eplus-day-schedules').slideUp('slow');

        if (is_self) return;

        $(this).parent().addClass('opened').find('.eplus-day-schedules').slideDown('slow');
    });

})(jQuery, window, document);
