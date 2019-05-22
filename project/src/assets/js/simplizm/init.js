;(function($){
    'use strict';

    SPZM.matchmedia = function (settings) {
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

    SPZM.elementsHello = function () {
        return new function () {
            var _ = this, object;
            var e = 'load.hello$ scroll.hello$';
            var w = SPZM.getWindowInfo;

            _.init = function () {
                object = _.object = {
                    hello: $('._hello')
                }

                if (object.hello.length) {
                    _.play();
                }
            }

            _.play = function () {
                object.hello.each(function (i, o) {
                    var $o = $(o);
                    o.t = $o.offset().top;
                    o.h = $o.outerHeight() / 2;
                    o.p = o.t + o.h;
                    o.e = e.replace(/\$/g, i);

                    $(window).on(o.e, function () {
                        _.action(o);
                    });
                });
            }

            _.action = function (o) {
                if (w.scrollTop + w.height > o.p && !o.visible) {
                    $(o).addClass('_visible');
                    $(window).off(o.e);
                    o.visible = true;
                }
            }

            return (function () {
                _.init();

                return _;
            })();
        }
    };

    $(document).ready(function () {
        SPZM.elementsHello();

        console.log(SPZM);
    });

    $(window).on({
        'load': function () {
            SPZM.matchmedia({
                matchDesktop: function () {
                    console.log('pc');
                },
                matchMobile: function () {
                    console.log('mobile');
                }
            });
        }
    });
})(jQuery);
