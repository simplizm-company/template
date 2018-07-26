/*
 * sunrise for jQuery
 * Version: 1.0.1
 * Author: Shin yongjun
 * Website: http://www.simplizm.com/
 */

;(function ($) {
    'use strict';

    var Sunrise = window.Sunrise || {};

    Sunrise = (function () {
        var pluginIndex = 0;
        function sunrise (url, settings) {
            var _ = this,
                settings = settings === undefined ? {} : settings,
                defaults = {
                    url: url,
                    background: true,
                    centerMode: true,
                    pluginIndex: pluginIndex++
                }

            _.options = $.extend(defaults, settings);

            _.init(true);
        };
        return sunrise;
    }());

    Sunrise.prototype.setElements = function () {
        var _ = this;
        _.$body = $('body');
        _.$wrapper = _.$body.append('<div class="_sunrise-wrapper"></div>').children('._sunrise-wrapper:last-child');
        _.$back = _.$wrapper.append('<div class="_sunrise-back"></div>').children('._sunrise-back');
        _.$outer = _.$wrapper.append('<div class="_sunrise-outer"></div>').children('._sunrise-outer');
        _.$inner = _.$outer.append('<div class="_sunrise-inner"></div>').children('._sunrise-inner');
        _.$close = _.$outer.append('<button class="_sunrise-close"></button>').children('._sunrise-close');
    }

    Sunrise.prototype.setInnerStyle = function () {
        var _ = this;
        if (_.options.centerMode) {
            _.$outer.css({'max-height': '80vh'});
            _.$inner.css({'max-height': '80vh'});
            _.setInnerPosition();
            _.$outer.addClass('_visible');
            _.popupResponsive();
        } else {

        }
    }

    Sunrise.prototype.setInnerPosition = function () {
        var _ = this;

        _.innerWidth = _.$inner.width();
        _.innerHeight = _.$inner.height();
        _.$outer.css({
            'top': ($(window).height() - _.innerHeight) / 2,
            'left': ($(window).width() - _.innerWidth) / 2
        });
    }

    Sunrise.prototype.getAjaxPopup = function () {
        var _ = this;
        $.ajax({
            url: _.options.url,
            timeout: 10000,
            dataType: 'html',
            success: function (data) {
                _.$inner.append(data);
                if (_.$inner.find('img').length) {
                    _.$inner.find('img').one('load', function () {
                        _.setInnerStyle();
                    });
                } else {
                    _.setInnerStyle();
                }
            }
        });
    }

    Sunrise.prototype.popupResponsive = function () {
        var _ = this;
        $(window).on('resize.sunrise'+_.options.pluginIndex, function () {
            _.setInnerPosition();
        });
    }

    Sunrise.prototype.init = function () {
        var _ = this;

        _.setElements();
        _.getAjaxPopup();
    }

    window.sunrise = function () {
        var _ = new Sunrise(arguments[0], arguments[1]);

        return _;
    }
}(jQuery));