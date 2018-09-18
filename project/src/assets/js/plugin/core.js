/*
 * Eclipse for jQuery
 * Version: 1.0.1
 * Author: shinyongjun
 * Website: http://www.simplizm.com/
 */

;(function($){
    'use strict';

    var $$ = window.$$ = {
        window: {}
    };

    $$.getWindowScroll = function () {
        $$.window.scrollTop = $(window).scrollTop();
        $$.window.scrollLeft = $(window).scrollLeft();
    }

    $$.getWindowSize = function () {
        $$.window.width = $(window).outerWidth();
        $$.window.height = $(window).outerHeight();
    }

    $$.matchmedia = function (settings) {
        var defaults = {
            matchDesktop : function () {},
            matchMobile : function () {}
        };
        var opt = $.extend({}, defaults, settings);
        var media = window.matchMedia('(max-width: 750px)');

        function matchesAction (paramse) {
            if (!paramse.matches) {
                opt.matchDesktop();
            } else {
                opt.matchMobile();
            }
        }

        if (matchMedia) {
            matchesAction(media);
            media.addListener(function (parameter) {
                matchesAction(parameter);
            });
        }
    }

    $(window).on({
        'load': function () {
            $$.getWindowScroll();
            $$.getWindowSize();
        },
        'scroll': function () {
            $$.getWindowScroll();
        },
        'resize': function () {
            $$.getWindowSize();
        }
    })
}(jQuery));