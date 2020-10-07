/**
 * Element Name: Tabs
 */

(function ($, window, document) {
    "use strict";

    $(document).on('click', '.eplus-tab-panel .tab-nav-item', function () {

        let thisItem = $(this),
            tabNav = thisItem.parent(),
            tabPanel = tabNav.parent(),
            target = thisItem.data('target');

        if (thisItem.hasClass('active')) {
            return;
        }

        tabNav.find('.tab-nav-item').removeClass('active');
        thisItem.addClass('active');

        tabPanel.find('> .tab-content > .tab-item-content').hide();
        tabPanel.find('> .tab-content > .tab-item-content.' + target).fadeIn('show');



    });

})(jQuery, window, document);
