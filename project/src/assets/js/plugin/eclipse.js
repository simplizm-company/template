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
                speed: 500, // 전환 속도
                view: 1,
                move: 1,
                margin: 0
            }

            _.options = $.extend({}, _.defaults, settings);

            _.initials = {
                slideCount: 0, // slides 갯수
                thisIndex: 0, // 현재 index
                sliderWidth: 0, // 슬라이더 너비값
                nextIndex: 0, // 다음 index
                transition: _.options.speed + 'ms', // transition 속도
                playActionFlag: false, // 시작종료 flag
                viewIndex: [], // 보여지는 slides의 배열
                computedIndexArray: [] // 계산용 index 배열
            }

            _.$eclipse = $(element);

            _.init(true);
        }

        return eclipse;
    }());

    Eclipse.prototype.preparationAction = function (thisIndex, prevOrNext, callback) {
        // 예비동작
        var _ = this;

        if (!_.initials.playActionFlag) {
            _.initials.playActionFlag = true;
            _.$slides.each(function (i) {
                this.isView = undefined;
                // console.log(_.initials.viewIndex);
                for (var j = 0; j < _.initials.viewIndex.length; j++) {
                    if (this.index === _.initials.viewIndex[j]) {
                        this.isView = _.initials.viewIndex.indexOf(_.initials.viewIndex[j]);
                    }
                }
                this.point = this.index - _.initials.thisIndex;
                if (prevOrNext === 'next') {
                    this.point = i - thisIndex < 0 ? i - thisIndex + _.initials.slideCount : i - thisIndex;
                }
                if (prevOrNext === 'prev') {
                    if (this.isView !== undefined) {
                        this.point = this.isView;
                    } else {
                        this.point = i - thisIndex > 0 ? i - thisIndex - _.initials.slideCount : i - thisIndex;
                    }
                }
                this.left = this.width * this.point + (_.options.margin * this.point);
                this.transform = 'translate3d(' + this.left + 'px, 0, 0)';
                $(this).stop().css(_.autoPrefixer(0, 'none', this.transform));
            }).promise().done(function () {
                setTimeout(function () {
                    callback();
                }, 50);
            });
        }
    }

    Eclipse.prototype.goToSlidesPrevOrNext = function (nextIndex) {
        var _ = this;

        var computedNextIndex = nextIndex;

        if (nextIndex > 0 && _.initials.thisIndex + (_.options.slidesToShow - 1) !== _.initials.slideCount - 1) {
            computedNextIndex = _.initials.thisIndex + nextIndex + (_.options.slidesToShow - 1) > _.initials.slideCount - 1 ?
            (_.initials.slideCount - 1) - (_.options.slidesToShow - 1) - _.initials.thisIndex :
            nextIndex;
        }
        if (nextIndex < 0 && _.initials.thisIndex !== 0) {
            computedNextIndex = _.initials.thisIndex + nextIndex < 0 ?
            0 - _.initials.thisIndex :
            nextIndex;
        }

        _.$slides.each(function (i) {
            this.point -= computedNextIndex;
            this.left = this.width * this.point + (_.options.margin * this.point);
            this.transform = 'translate3d(' + this.left + 'px, 0, 0)';
            $(this).stop().css(_.autoPrefixer(0, _.initials.transition, this.transform));
        }).promise().done(function () {
            _.initials.thisIndex = _.initials.computedIndexArray[_.initials.thisIndex + _.initials.slideCount + computedNextIndex];
            _.setSlideEnd(computedNextIndex);
        });
    }

    Eclipse.prototype.goToSlides = function (nextIndex) {
        var _ = this;

        if (_.initials.thisIndex !== nextIndex && !_.initials.playActionFlag) {
            var computedNextIndex = nextIndex + (_.options.slidesToShow - 1) > _.initials.slideCount - 1 ?
            (_.initials.slideCount - 1) - (_.options.slidesToShow - 1) :
            nextIndex;
            _.preparationAction(_.initials.thisIndex, false, function () {
                _.$slides.each(function (i) {
                    this.point -= computedNextIndex - _.initials.thisIndex;
                    this.left = this.width * this.point + (_.options.margin * this.point);
                    this.transform = 'translate3d(' + this.left + 'px, 0, 0)';
                    $(this).stop().css(_.autoPrefixer(0, _.initials.transition, this.transform));
                }).promise().done(function () {
                    _.setSlideEnd(computedNextIndex - _.initials.thisIndex);
                    _.initials.thisIndex = computedNextIndex;
                });
            });
        }
    }

    Eclipse.prototype.setSlideEnd = function (nextIndex) {
        var _ = this;

        _.$slides.removeClass('eclipse-active');
        for (var j = 0; j < _.initials.viewIndex.length; j++) {
            _.initials.viewIndex[j] = _.initials.computedIndexArray[_.initials.viewIndex[j] + _.initials.slideCount + nextIndex];
            _.$slides.eq(_.initials.viewIndex[j]).addClass('eclipse-active');
        }
        console.log(_.initials.viewIndex);
        setTimeout(function () {
            _.initials.playActionFlag = false;
        }, _.options.speed);
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
        var indexTemp = [];
        var vi = _.options.startIndex;

        _.$slides.each(function (i) {
            this.width = (_.initials.sliderWidth - (_.options.slidesToShow - 1) * _.options.margin) / _.options.slidesToShow;
            this.height = $(this).height();
            this.index = i;
            this.point = i - _.options.startIndex < 0 ? i - _.options.startIndex + _.initials.slideCount : i - _.options.startIndex;
            this.left = this.index == _.options.startIndex ? this.width * this.point : (this.width * this.point) + (this.point * _.options.margin);
            this.transform = 'translate3d(' + this.left + 'px, 0, 0)';

            indexTemp.push(i);

            $(this).css({'width': this.width}).css(_.autoPrefixer(0, 'none', this.transform));
        }).promise().done(function () {
            for (var i = 0; i < 3; i++) {
                _.initials.computedIndexArray.push.apply(_.initials.computedIndexArray, indexTemp);
            }

            _.$slider.css({
                'overflow': 'hidden',
                'position': 'relative',
                'height': _.$slides[_.initials.thisIndex].height
            });

            for (var i = 0; i < _.options.slidesToShow; i++) {
                _.initials.viewIndex[i] = vi;
                vi = vi + 1 > _.initials.slideCount - 1 ? 0 : vi + 1;
            }
        });
    }

    Eclipse.prototype.setInitials = function () {
        var _ = this;

        _.initials.slideCount = _.$slides.length;
        _.initials.thisIndex = _.options.startIndex;
        _.initials.sliderWidth = _.$slider.width();
        _.options.move = _.initials.slideCount / _.options.slidesToShow < _.options.move ? 1 : _.options.move;
    }

    Eclipse.prototype.setEvents = function () {
        var _ = this;

        _.$arrowPrev.on('click', function () {
            _.preparationAction(_.initials.thisIndex, 'prev', function () {
                _.goToSlidesPrevOrNext(-_.options.move);
            });
        });

        _.$arrowNext.on('click', function () {
            _.preparationAction(_.initials.thisIndex, 'next', function () {
                _.goToSlidesPrevOrNext(_.options.move);
            });
        });

        _.$pagingButton.on('click', function () {
            _.goToSlides($(this).index() * _.options.slidesToShow);
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