(function($){
    'use strict';

    if(typeof window.ui === 'undefined'){
        var ui = window.ui = {}
    }

    ui.setElementsVariable = function () {
        ui.$html      = $('html');
        ui.$body      = $('body');
        ui.$wrap      = $('#wrap');
        ui.$header    = $('#header');
        ui.$gnb       = $('#gnb');
        ui.$container = $('#container');
        ui.$main      = $('#main');
        ui.$contents  = $('#contents');
        ui.$footer    = $('#footer');
        ui.$hello     = $('._hello');
    }

    ui.getWindowSize = function () {
        ui.winsizeW = $(window).outerWidth();
        ui.winsizeH = $(window).outerHeight();
    }

    ui.getWindowScroll = function () {
        ui.winscrlT = $(window).scrollTop();
        ui.winscrlL = $(window).scrollLeft();
    }

    ui.hasOwnProperty = function (org, src) {
        for(var prop in src){
            if(!hasOwnProperty.call(src, prop)){
                continue;
            }
            if('object' === $.type(org[prop])){
                org[prop] = ($.isArray(org[prop]) ? src[prop].slice(0) : ui.hasOwnProperty(org[prop], src[prop]));
            }else{
                org[prop] = src[prop];
            }
        }
        return org;
    }

    ui.slider = (function (_) {
        return {
            mainVisual : function () {
                this.$mainVisual = $('#main .main_visual .slick-wrap').slick({
                    fade : true,
                    arrows : true,
                    dots : false,
                    infinite : true,
                    slidesToShow : 1,
                    slidesToScroll : 1,
                    accessibility : false
                });
            }
        }
    })(ui);

    ui.inputfile = function (target) {
        var $target = $(target), value = $target.val();
        $target.next().val(value);
    }

    ui.hello = (function (_) {
        return {
            init : function () {
                var self = this;
                if (_.$hello) {
                    _.$hello.each(function(idx, obj){
                        obj.t = $(obj).offset().top;
                        obj.h = $(obj).outerHeight() / 2;
                        obj.p = obj.t + obj.h;
                        obj.e = 'scroll.lmotion'+idx;
                        self.scroll(obj);
                        $(window).on(obj.e, function () {
                            self.scroll(obj);
                        });
                    });
                }
            },
            scroll : function (obj) {
                if(_.winscrlT + _.winsizeH > obj.p && !obj.visible){
                    $(obj).addClass('_visible');
                    $(window).off(obj.e);
                    obj.visible = true;
                }
            }
        }
    })(ui);

    ui.matchmedia = function (settings) {
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

    ui.tabAction = function (navi, cont) {
        var _ = ui;
        function action(tab, idx){
            tab.def.$navi.eq(idx).addClass('on').siblings().removeClass('on');
            tab.def.$cont.eq(idx).addClass('on').siblings().removeClass('on');
            tab.def.offsetTop = tab.def.$navi.offset().top;

            tab.def.idx = idx;
        }
        var tabAction = (function () {
            return {
                def : {
                    idx : 0,
                    $navi : $(navi).children(),
                    $cont : $(cont).children()
                },
                init : function () {
                    var _this = this;
                    _this.def.$navi.on('click', function () {
                        action(_this, $(this).index());
                    });
                    return _this;
                },
                setIndex : function(idx){
                    action(this, idx);
                    $('html, body').animate({scrollTop : this.def.offsetTop-_.$header.outerHeight()}, 300);
                }
            };
        })();
        return tabAction.init();
    }

    ui.textMarginCut = function (target) {
        target.find('._txt').each(function (idx, obj) {
            this.$inner = $(this).wrapInner('<div>').children('div');
            this.lineHeight = parseInt($(this).css('line-height'));
            this.fontSize = parseInt($(this).css('font-size'));
            this.margin = (this.lineHeight - this.fontSize) / this.fontSize;
            $(this).css({'display': 'flex'});
            this.$inner.css({'margin': '-'+this.margin+'ex 0'});
        });
    }

    $(document).ready(function () {
        ui.setElementsVariable();
        ui.textMarginCut($('body'));
    });

    $(window).on({
        'load' : function () {
            ui.getWindowSize();
            ui.getWindowScroll();
            ui.hello.init();
            ui.matchmedia({
                matchDesktop : function () {
                    console.log('pc');
                },
                matchMobile : function () {
                    console.log('mobile');
                }
            });
        },
        'resize' : function () {
            ui.getWindowSize();
        },
        'scroll' : function () {
            ui.getWindowScroll();
        }
    });
})(jQuery);
