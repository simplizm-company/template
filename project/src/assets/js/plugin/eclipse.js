// 슬라이드 멈춰있을때 left: 각 위치
// 슬라이드 이동할때 left: 0, transform: 각 위치




/*
 * Eclipse for jQuery
 * Version: 1.0.1
 * Author: shinyongjun
 * Website: http://www.simplizm.com/
 */

;(function($){
    'use strict';

    var Eclipse = window.Eclipse || {};

    Eclipse = (function(){
        function eclipse(element, settings){
            var _ = this;

            _.defaults = {
                nameSpace: 'eclipse', // class 네임스페이스
                startIndex: 0, // slider 시작 index
                arrow: true, // arrow navigation 사용 여부
                pager: true, // pager 사용 여부
                slidesToShow: 1, // 한번에 보여질 slide 갯수
                speed: 500 // 전환 속도
            }

            _.options = $.extend({}, _.defaults, settings);

            _.initials = {
                slideCount: 0, // slides 갯수
                thisIndex: 0, // 현재 index
                sliderWidth: 0, // 슬라이더 너비값
                nextIndex: 0, // 다음 index
                transition: _.options.speed + 'ms'
            }

            _.$eclipse = $(element);

            _.init(true);
        }

        return eclipse;
    }());

    Eclipse.prototype.preparationAction = function (thisIndex, prevOrNext, callback) {
        // 예비동작
        var _ = this;

        _.$slides.each(function (i) {
            if (prevOrNext === 'next') {
                this.range = i - thisIndex < 0 ? i - thisIndex + _.initials.slideCount : i - thisIndex;
            }
            if (prevOrNext === 'prev') {
                this.range = i - thisIndex > 0 ? i - thisIndex - _.initials.slideCount : i - thisIndex;
            }
            this.point = this.range;
            this.left = this.width * this.point;
            this.transform = 'translate3d(' + this.left + 'px, 0, 0)';
            $(this).stop().css(_.autoPrefixer(0, 'none', this.transform));
        }).promise().done(function () {
            setTimeout(function () {
                callback();
            }, 10);
        });
    }

    Eclipse.prototype.goToSlidesPrevOrNext = function (nextIndex) {
        var _ = this;

        _.initials.thisIndex = _.initials.thisIndex + nextIndex;

        _.$slides.each(function (i) {
            this.point -= nextIndex;
            this.left = this.width * this.point;
            this.transform = 'translate3d(' + this.left + 'px, 0, 0)';
            if (_.initials.thisIndex === this.point) {
                $(this).addClass('eclipse-active').siblings().removeClass('eclipse-active');
            }
            $(this).stop().css(_.autoPrefixer(0, _.initials.transition, this.transform));
        }).promise().done(function () {
            _.initials.thisIndex = _.computedIndex(_.initials.thisIndex);
        });
    }

    Eclipse.prototype.goToSlides = function (nextIndex) {
        var _ = this;

        var movetype = _.initials.thisIndex !== nextIndex ? _.initials.thisIndex < nextIndex ? 'next' : 'prev' : false;

        if (movetype) {
            _.preparationAction(_.initials.thisIndex, movetype, function () {
                _.$slides.each(function (i) {
                    this.point -= nextIndex - _.initials.thisIndex;
                    this.left = this.width * this.point;
                    this.transform = 'translate3d(' + this.left + 'px, 0, 0)';
                    if (nextIndex === this.index) {
                        $(this).addClass('eclipse-active').siblings().removeClass('eclipse-active');
                    }
                    $(this).stop().css(_.autoPrefixer(0, _.initials.transition, this.transform));
                }).promise().done(function () {
                    _.initials.thisIndex = nextIndex;
                });
            });
        } else {
            return;
        }
    }

    Eclipse.prototype.buildControls = function () {
        var _ = this;

        if (_.options.arrow === true) {
            var prev = $(`<button>prev</button>`).addClass(`${_.options.nameSpace}-arrow ${_.options.nameSpace}-prev`),
                next = $(`<button>next</button>`).addClass(`${_.options.nameSpace}-arrow ${_.options.nameSpace}-next`);
            _.$arrowPrev = prev.appendTo(_.$eclipse);
            _.$arrowNext = next.appendTo(_.$eclipse);
        }

        if (_.options.pager === true && _.initials.slideCount > _.options.slidesToShow) {
            var paging = $('<div />').addClass(`${_.options.nameSpace}-paging`);
            for (var i = 1; i <= Math.ceil(_.initials.slideCount / _.options.slidesToShow); i++) {
                paging.append($(`<button>${i}</button>`).addClass(`${_.options.nameSpace}-paging-button`));
            }
            _.$paging = paging.appendTo(_.$eclipse);
            _.$pagingButton = _.$paging.children();
        }
    }

    Eclipse.prototype.autoPrefixer = function (left, transition, transform) {
        return {
            'left': left,
            '-webkit-transition': transition,
            '-moz-transition': transition,
            '-ms-transition': transition,
            'transition': transition,
            '-webkit-transform': transform,
            '-moz-transform': transform,
            '-ms-transform': transform,
            'transform': transform
        }
    }

    Eclipse.prototype.computedIndex = function (value) {
        var _ = this;

        return value < _.initials.slideCount ? value > -1 ? value : _.initials.slideCount - 1 : 0;
    }

    Eclipse.prototype.setSlidesCSS = function () {
        var _ = this;

        _.$slides.css({
            'float': 'none',
            'position': 'absolute',
            'top': 0
        });
    }

    Eclipse.prototype.setSlidesEach = function () {
        var _ = this;

        _.$slides.each(function (i) {
            this.width = _.initials.sliderWidth;
            this.height = $(this).height();
            this.index = i;
            this.left = this.width * this.index;

            $(this).css({
                'width': this.width,
                'left': this.left
            });
        }).promise().done(function () {
            _.$slider.css({
                'overflow': 'hidden',
                'position': 'relative',
                'height': _.$slides[_.initials.thisIndex].height
            });
        });
    }

    Eclipse.prototype.setInitials = function () {
        var _ = this;

        _.initials.slideCount = _.$slides.length;
        _.initials.thisIndex = _.options.startIndex;
        _.initials.sliderWidth = _.$slider.width();
    }

    Eclipse.prototype.setEvents = function () {
        var _ = this;

        _.$arrowPrev.on('click', function () {
            _.preparationAction(_.initials.thisIndex, 'prev', function () {
                _.goToSlidesPrevOrNext(-1);
            });
        });

        _.$arrowNext.on('click', function () {
            _.preparationAction(_.initials.thisIndex, 'next', function () {
                _.goToSlidesPrevOrNext(1);
            });
        });

        _.$pagingButton.on('click', function () {
            _.goToSlides($(this).index());
        });
    }

    Eclipse.prototype.init = function () {
        var _ = this;

        _.$slider = _.$eclipse.children().addClass(`${_.options.nameSpace}-slider`);
        _.$slides = _.$slider.children().addClass(`${_.options.nameSpace}-slides`);

        _.setSlidesCSS();
        _.setInitials();
        _.setSlidesEach();
        _.buildControls();
        _.setEvents();
    }

    $.fn.eclipse = function(){
        var _ = this,
            o = arguments[0],
            s = Array.prototype.slice.call(arguments, 1),
            l = _.length,
            r;
        for (var i = 0; i < l; i++) {
            if (typeof o == 'object' || typeof o == 'undefined') {
                _[i].Eclipse = new Eclipse(_[i], o);
            } else {
                r = _[i].Eclipse[o].apply(_[i].Eclipse, s);
                if (typeof r != 'undefined') {
                    return r;
                }
            }
        }
        return _;
    }
}(jQuery));