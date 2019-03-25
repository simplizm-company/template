;(function($){
    'use strict';

    var methods = SPZM.methods;
    var element = SPZM.element;
    var initial = SPZM.initial;

    var Sunrise = (function () {
        var pluginIndex = 0;
        function sunrise (target, settings) {
            var _ = this;
            var settings = settings === undefined ? {} : settings;
            var defaults = {
                pluginIndex: pluginIndex++,
                target: target,
                inline: false,
                background: true,
                centerMode: true,
                position: {
                    top: 0,
                    left: 0
                },
                fixed: false,
                openCallback: function () {},
                closeCallback: function () {}
            }

            _.options = methods.hasOwnProperty(defaults, settings);

            _.init(true);
        }
        return sunrise;
    })();

    Sunrise.prototype.setElements = function () {
        var _ = this;

        _.$wrapper = element.body.append('<div class="sunrise-wrapper"></div>').children('.sunrise-wrapper:last-child');
        if (_.options.background) {
            _.$back = _.$wrapper.append('<div class="sunrise-back" sunrise="close"></div>').children('.sunrise-back');
        }
        _.$outer = _.$wrapper.append('<div class="sunrise-outer"></div>').children('.sunrise-outer');
        _.$inner = _.$outer.append('<div class="sunrise-inner"></div>').children('.sunrise-inner');
    }

    Sunrise.prototype.setPopupStyle = function () {
        var _ = this;
        if (_.options.centerMode) {
            _.popupWidth = _.$outer.width();
            _.popupHeight = _.$outer.height();

            if (_.options.fixed) {
                _.$outer.css({
                    'position': 'fixed',
                    'max-height': '80vh',
                    'max-width': '80vw',
                    'overflow': 'auto',
                    'top': _.popupHeight > initial.window.height * 0.8 ? '10vh' : (initial.window.height - _.popupHeight) / 2,
                    'left': _.popupWidth > initial.window.width * 0.8 ? '10vw' : (initial.window.width - _.popupWidth) / 2
                });
            } else {
                if (_.popupWidth > initial.window.width * 0.8) {
                    _.$outer.css({
                        'left': initial.window.scrollLeft + initial.window.width * 0.1,
                        'padding-right': '10vw'
                    });
                } else {
                    _.$outer.css({'left': initial.window.scrollLeft + ((initial.window.width - _.popupWidth) / 2)});
                }
    
                if (_.popupHeight > initial.window.height * 0.8) {
                    _.$outer.css({
                        'top': initial.window.scrollTop + initial.window.height * 0.1,
                        'padding-bottom': '10vh'
                    });
                } else {
                    _.$outer.css({'top': initial.window.scrollTop + ((initial.window.height - _.popupHeight) / 2)});
                }
            }
        } else {
            _.$outer.css({
                'top': _.options.position.top,
                'left': _.options.position.left
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
        _.options.closeCallback();
    }

    Sunrise.prototype.openEvents = function (data) {
        var _ = this;
        SPZM.methods.setTextEx();
        _.setPopupStyle();
        _.$outer.addClass('_visible');
        _.EventsBinding();
        _.options.openCallback(data);
    }

    Sunrise.prototype.innerImgLoaded = function (data) {
        var _ = this;

        if (_.$inner.find('img').length) {
            var idx = 0;
            var max = _.$inner.find('img').length;
            _.$inner.find('img').one('load', function () {
                idx++;
                if (idx === max) {
                    _.openEvents(data);
                }
            });
        } else {
            _.openEvents(data);
        }
    }

    Sunrise.prototype.getAjaxPopup = function () {
        var _ = this;
        if (!_.options.inline) {
            $.ajax({
                url: _.options.target,
                timeout: 10000,
                dataType: 'html',
                success: function (data) {
                    var data = _.$inner.append(data).children()[0];
                    _.innerImgLoaded(data);
                }
            });
        } else {
            var $data = _.$inner.append($(_.options.target).clone()).children(_.options.target).show();
            var data = $data[0];
            _.innerImgLoaded(data);
        }
    }

    Sunrise.prototype.init = function () {
        var _ = this;
        _.setElements();
        _.getAjaxPopup();
    }

    SPZM.sunrise = function () {
        return new Sunrise(arguments[0], arguments[1]);
    }
})(jQuery);
