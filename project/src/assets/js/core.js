/*
 * Eclipse for jQuery
 * Version: 1.0.1
 * Author: shinyongjun
 * Website: http://www.simplizm.com/
 */

;(function($){
    'use strict';

    // namespace : SPZM
    var SPZM = window.SPZM = window.SPZM || {
        initial: {},
        element: {},
        methods: {}
    };

    var methods = SPZM.methods;

    methods.touchAndMouseEvents = (function () {
        var isTouchSupported = 'ontouchstart' in document;
    
        $.event.special.clickstart = {
            setup: function() {
                var eventtype = isTouchSupported ? 'touchstart' : 'mousedown';
                $(this).on(eventtype + '.clickstart', function (e) {
                    e.type = 'clickstart';
                    e.pageX = e.pageX || e.originalEvent.touches[0].pageX;
                    e.pageY = e.pageY || e.originalEvent.touches[0].pageY;
                    ($.event.dispatch||$.event.handle).call(this, e);
                });
            },
            teardown: function() {
                $(this).off('.clickstart');
            }
        };
    
        $.event.special.clickmove = {
            setup: function() {
                var eventtype = isTouchSupported ? 'touchmove' : 'mousemove';
                $(this).on(eventtype + '.clickmove', function (e) {
                    e.type = 'clickmove';
                    e.pageX = e.pageX || e.originalEvent.touches[0].pageX;
                    e.pageY = e.pageY || e.originalEvent.touches[0].pageY;
                    ($.event.dispatch||$.event.handle).call(this, e);
                });
            },
            teardown: function() {
                $(this).off('.clickmove');
            }
        };
    
        $.event.special.clickend = {
            setup: function() {
                var eventtype = isTouchSupported ? 'touchend' : 'mouseup';
                $(this).on(eventtype + '.clickend', function (e) {
                    e.type = 'clickend';
                    ($.event.dispatch||$.event.handle).call(this, e);
                });
            },
            teardown: function() {
                $(this).off('.clickend');
            }
        };
    })();

    methods.hasOwnProperty = function (org, src) {
        var _ = this;
        for(var prop in src) {
            if (!Object.prototype.hasOwnProperty.call(src, prop)) {
                continue;
            }
            if ('object' === $.type(org[prop])) {
                org[prop] = ($.isArray(org[prop]) ? src[prop].slice(0) : _.hasOwnProperty(org[prop], src[prop]));
            } else {
                org[prop] = src[prop];
            }
        }
        return org;
    }

    methods.matchmedia = function (settings) {
        var defaults = {
            matchDesktop : function () {},
            matchMobile : function () {}
        };
        var options = $.extend({}, defaults, settings);
        var media = window.matchMedia('(max-width: 750px)');

        function matchesAction (paramse) {
            if (!paramse.matches) {
                options.matchDesktop();
            } else {
                options.matchMobile();
            }
        }

        if (matchMedia) {
            matchesAction(media);
            media.addListener(function (parameter) {
                matchesAction(parameter);
            });
        }
    };
}(jQuery));