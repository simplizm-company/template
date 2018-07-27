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
                    computedScroll: false,
                    positionTop: 0,
                    positionLeft: 0,
                    pluginIndex: pluginIndex++
                }

            _.options = $.extend(defaults, settings);

            _.init(true);
        };
        return sunrise;
    }());

    Sunrise.prototype.getWindowProperty = function () {
        var _ = this;
        _.windowWidth = $(window).width();
        _.windowHeight = $(window).height();
        _.windowScrollY = $(window).scrollTop();
        _.windowScrollX = $(window).scrollLeft();
    }

    Sunrise.prototype.setElements = function () {
        var _ = this;
        _.$body = $('body');
        _.$wrapper = _.$body.append('<div class="_sunrise-wrapper"></div>').children('._sunrise-wrapper:last-child');
        if (_.options.background) {
            _.$back = _.$wrapper.append('<div class="_sunrise-back" sunrise="close"></div>').children('._sunrise-back');
        }
        _.$outer = _.$wrapper.append('<div class="_sunrise-outer"></div>').children('._sunrise-outer');
        _.$inner = _.$outer.append('<div class="_sunrise-inner"></div>').children('._sunrise-inner');
    }

    Sunrise.prototype.setPopupStyle = function () {
        var _ = this;
        if (_.options.centerMode) {
            _.getWindowProperty();
            _.popupWidth = _.$outer.width();
            _.popupHeight = _.$outer.height();
            if (_.popupWidth > _.windowWidth * 0.8) {
                _.$outer.css({'left': '10vw'});
            } else {
                _.$outer.css({'left': _.windowScrollX + ((_.windowWidth - _.popupWidth) / 2)});
            }
            if (_.popupHeight > _.windowHeight * 0.8) {
                _.$outer.css({'top': '10vh'});
            } else {
                _.$outer.css({'top': _.windowScrollY + ((_.windowHeight - _.popupHeight) / 2)});
            }
        } else {
            _.getWindowProperty();
            _.$outer.css({
                'top': _.options.positionTop,
                'left': _.options.positionLeft
            });
        }
    }

    Sunrise.prototype.EventsBinding = function () {
        var _ = this;
        _.$wrapper.find('[sunrise=close]').on('click', function () {
            _.popupClose();
        });
    }

    Sunrise.prototype.popupClose = function () {
        var _ = this;
        _.$wrapper.remove();
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
                    var idx = 0;
                    var max = _.$inner.find('img').length;
                    _.$inner.find('img').one('load', function (obj) {
                        idx++;
                        if (idx === max) {
                            _.setPopupStyle();
                            _.$outer.addClass('_visible');
                            _.EventsBinding();
                        }
                    });
                } else {
                    _.setPopupStyle();
                    _.$outer.addClass('_visible');
                    _.EventsBinding();
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