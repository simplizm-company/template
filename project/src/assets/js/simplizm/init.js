;(function($){
    'use strict';

    var methods = SPZM.methods;
    var element = SPZM.element;
    var initial = SPZM.initial;

    var setElementsVariable = (function () {
        return {
            init: function () {
                element.html = this.find('html');
                element.body = this.find('body');
                element.hello = this.find('._hello');
                element.text = this.find('._');
            },
            find: function (target) {
                return $(target).length ? $(target) : false;
            }
        }
    })();

    var elementsHello = (function () {
        return {
            init: function () {
                if (element.hello) {
                    this.play();
                }
            },
            play: function () {
                var _ = this;
                element.hello.each(function (i) {
                    this.t = $(this).offset().top;
                    this.h = $(this).outerHeight() / 2;
                    this.p = this.t + this.h;
                    this.el = 'load.hello-'+i;
                    this.es = 'scroll.hello-'+i;
                    $(window).on(this.el + ' ' + this.es, function () {
                        _.action(this);
                    }.bind(this));
                });
            },
            action: function (target) {
                if(initial.window.scrollTop + initial.window.height > target.p && !target.visible){
                    $(target).addClass('_visible');
                    $(window).off(target.es);
                    target.visible = true;
                }
            }
        }
    })();

    var setTextEx = (function () {
        return {
            init: function () {
                SPZM.methods.setTextEx = this.load;
                this.load();
            },
            load: function () {
                if (element.text) {
                    this.play();
                }
            },
            play: function () {
                element.text.each(function () {
                    if (!this.ed) {
                        this.ed = true;
                        this.in = $(this).wrapInner('<div>').children('div');
                        this.lh = parseInt($(this).css('line-height'));
                        this.fz = parseInt($(this).css('font-size'));
                        this.mg = (this.lh - this.fz) / this.fz;
                        $(this).css({'display': 'flex'});
                        this.in.css({'margin': (-this.mg) + 'ex 0'});
                    }
                });
            }
        }
    })();

    var getWindowInfo = (function () {
        initial.window = {};

        return {
            init: function () {
                this.scroll();
                this.resize();
            },
            scroll: function () {
                $(window).on('load scroll', function () {
                    initial.window.scrollTop = $(window).scrollTop();
                    initial.window.scrollLeft = $(window).scrollLeft();
                });
            },
            resize: function () {
                $(window).on('load resize', function () {
                    initial.window.width = $(window).outerWidth();
                    initial.window.height = $(window).outerHeight();
                });
            }
        }
    })();

    $(document).ready(function () {
        getWindowInfo.init();
        setElementsVariable.init();
        elementsHello.init();
        setTextEx.init();
    });

    $(window).on({
        'load' : function () {
            methods.matchmedia({
                matchDesktop : function () {
                    console.log('pc');
                },
                matchMobile : function () {
                    console.log('mobile');
                }
            });
        },
        'resize' : function () {
            //
        },
        'scroll' : function () {
            //
        }
    });
})(jQuery);
