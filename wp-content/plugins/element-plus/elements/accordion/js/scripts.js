/**
 * Element Name: Accordion
 */

(function ($, window, document) {
    "use strict";

    $(document).on('click', '.eplus-accordion-item > .eplus-accordion-title', function () {

        let thisTitle = $(this),
            thisItem = $(this).parent(),
            allItems = thisItem.parent(),
            thisContent = thisItem.find('.eplus-accordion-content'),
            thisIcon = thisTitle.find('.toggle-icon');

        if (!thisItem.hasClass('active')) {
            allItems.find('.eplus-accordion-item').removeClass('active').find('.eplus-accordion-content').slideUp();
            allItems.find('.toggle-icon').removeClass('icon-minus');
            thisContent.slideToggle();
            thisItem.toggleClass('active');
            thisIcon.toggleClass('icon-minus icon-plus');
        }
    });

})(jQuery, window, document);

