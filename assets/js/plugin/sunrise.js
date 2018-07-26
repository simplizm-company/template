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
        _.$cell = _.$wrapper.append('<div class="_sunrise-cell"></div>').children('._sunrise-cell');
        _.$back = _.$cell.append('<div class="_sunrise-back"></div>').children('._sunrise-back');
        _.$outer = _.$cell.append('<div class="_sunrise-outer"></div>').children('._sunrise-outer');
        _.$inner = _.$outer.append('<div class="_sunrise-inner"></div>').children('._sunrise-inner');
        _.$close = _.$outer.append('<button class="_sunrise-close"></button>').children('._sunrise-close');
    }

    Sunrise.prototype.setInnerStyle = function () {
        var _ = this;
        if (_.options.centerMode) {
            _.$outer.css({'max-height': '80vh'});
            _.$inner.css({'max-height': '80vh'});
            _.$outer.addClass('_visible');
        } else {

        }
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