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
                nameSpace: 'eclipse',       // class 네임스페이스
                arrows: true,               // 화살표 사용 여부
                paging: true,               // 페이징 사용 여부
                between: 0,                 // 간격
                slidesToShow: 1,            // 한번에 보여질 슬라이드 갯수
                startIndex: 0,              // 시작 페이지
                infinite: true,             // 무한롤링
                friction: 200,              // 터치 or 마우스드래그 마찰 값
                speed: 500                  // 전환 속도
            }

            _.options = $.extend({}, _.defaults, settings);

            _.initials = {
                thisIndex: null,
                prevIndex: null,
                nextIndex: null,
                slideWidth: null,
                slideCount: null,
                touchstartFlag: false,
                touchmoveFlag: false,
                actionFlag: false,
                touchmoveDelta: null,
                startX: null,
                startY: null,
                moveX: null,
                moveY: null,
                transition: _.options.speed + 'ms'
            }
            _.$eclipse = $(element);

            _.init(true);
        }

        return eclipse;
    }());

    Eclipse.prototype.buildOut = function () {
        var _ = this;

        _.$slider = _.$eclipse.children().addClass(`${_.options.nameSpace}-slider`);
        _.$slides = _.$slider.children().addClass(`${_.options.nameSpace}-slides`);
        _.initials.slideCount = _.$slides.length;
        _.initials.slideWidth = _.$slider.width();
        _.initials.thisIndex = _.options.startIndex;
        _.initials.nextIndex = _.computedIndex(_.initials.thisIndex + 1);
        _.initials.prevIndex = _.computedIndex(_.initials.thisIndex - 1);
    }

    Eclipse.prototype.buildControls = function () {
        var _ = this;

        if (_.options.arrows === true) {
            var prev = $(`<button>prev</button>`).addClass(`${_.options.nameSpace}-arrow ${_.options.nameSpace}-prev`),
                next = $(`<button>next</button>`).addClass(`${_.options.nameSpace}-arrow ${_.options.nameSpace}-next`);
            _.$arrowPrev = prev.appendTo(_.$eclipse);
            _.$arrowNext = next.appendTo(_.$eclipse);
        }

        if (_.options.paging === true && _.initials.slideCount > _.options.slidesToShow) {
            var paging = $('<div />').addClass(`${_.options.nameSpace}-paging`);
            for (var i = 1; i <= Math.ceil(_.initials.slideCount / _.options.slidesToShow); i++) {
                paging.append($(`<button>${i}</button>`).addClass(`${_.options.nameSpace}-paging-button`));
            }
            _.$paging = paging.appendTo(_.$eclipse);
            _.$pagingButton = _.$paging.children();
        }
    }

    Eclipse.prototype.setSlidesStyle = function () {
        // 슬라이드 스타일 세팅
        var _ = this;

        _.$slides.each(function (i) {
            this.width = $(this).width();
            this.height = $(this).height();
            this.index = i;
            this.range = this.index - _.initials.thisIndex < 0 ? this.index - _.initials.thisIndex + _.initials.slideCount : this.index - _.initials.thisIndex;
            // this.point = Math.abs(this.range) == _.initials.slideCount - 1 ? this.range < 0 ? 1 : -1 : this.range;
            this.point = this.range;
            this.left = _.initials.slideWidth * this.point;
            this.transform = this.left;

            console.log(this.index, this.range, this.point);

            $(this).css({
                'float': 'none',
                'position': 'absolute',
                'top': 0,
                'left': this.left,
                'width': _.initials.slideWidth
            });
        });

        _.$slider.css({
            'overflow': 'hidden',
            'position': 'relative',
            'height': _.$slides[_.initials.thisIndex].height
        });
    }

    Eclipse.prototype.touchstart = function (e) {
        // 터치스타트, 마우스다운 실행
        var _ = this;

        if (!_.initials.touchstartFlag) {
            _.initials.touchstartFlag = true;
            _.startX = e.originalEvent.touches ? e.originalEvent.touches[0].pageX : e.pageX;
            _.startY = e.originalEvent.touches ? e.originalEvent.touches[0].pageY : e.pageY;
    
            $(document).on({
                'mousemove': function (e) {
                    _.touchmove(e);
                },
                'mouseup': function (e) {
                    _.touchend(e);
                }
            });
        }
    }

    Eclipse.prototype.touchmove = function (e) {
        // 터치무브, 마우스무브 실행
        var _ = this;

        if (!_.initials.touchmoveFlag) {
            _.initials.touchmoveFlag = true;
            _.setSideSlides();
        }

        if (_.initials.touchstartFlag) {
            _.moveX = (e.originalEvent.touches ? e.originalEvent.touches[0].pageX : e.pageX) - _.startX;
            _.moveY = (e.originalEvent.touches ? e.originalEvent.touches[0].pageY : e.pageY) - _.startY;
            _.$slides.each(function () {
                this.transform = this.left + _.moveX;
                var transform = 'translate3d(' + this.transform + 'px, 0, 0)';
                $(this).css(_.autoprefixer(0, 'none', transform));
            });
        }
    }

    Eclipse.prototype.touchend = function (e) {
        var _ = this;

        $(document).off('mousemove mouseup');

        if (Math.abs(_.moveX) > _.options.friction) {
            if (_.moveX > 0) {
                console.log('prev');
                _.goToPrevOrNext(-1);
            } else {
                console.log('next');
                _.goToPrevOrNext(1);
            }
        } else {
            console.log('back');
            _.goToPrevOrNext(0);
        }
    }

    Eclipse.prototype.goToPrevOrNext = function (move) {
        var _ = this;
        if (_.initials.actionFlag) return;
        _.initials.actionFlag = true;
        _.initials.thisIndex = _.computedIndex(_.initials.thisIndex + move);
        _.initials.nextIndex = _.computedIndex(_.initials.thisIndex + 1);
        _.initials.prevIndex = _.computedIndex(_.initials.thisIndex - 1);
        _.startX = null;
        _.startY = null;
        _.moveX = null;
        _.moveY = null;

        _.$slides.each(function () {
            var self = this;
            this.point -= move;
            this.left = _.initials.slideWidth * this.point;
            this.range = this.index - _.initials.thisIndex < 0 ? this.index - _.initials.thisIndex + _.initials.slideCount : this.index - _.initials.thisIndex;
            var transform = 'translate3d(' + this.left + 'px, 0, 0)';
            $(this).stop().css(_.autoprefixer(0, _.initials.transition, transform));
            if (this.index === _.initials.thisIndex) {
                $(this).addClass('eclipse-active').siblings().removeClass('eclipse-active');
            }

            setTimeout(function () {
                self.left = _.initials.slideWidth * (self.index - _.initials.thisIndex);
                self.transform = 'translate3d(' + self.left + 'px, 0, 0)';
                $(self).stop().css(_.autoprefixer(0, 'none', self.transform));
                _.initials.actionFlag = false;
                _.initials.touchstartFlag = false;
                _.initials.touchmoveFlag = false;

                console.log(self.index, self.point, self.range);
            }, _.options.speed);
        });
    }

    Eclipse.prototype.goToSlide = function (index) {
        var _ = this;
        if (_.initials.actionFlag) return;
        _.initials.actionFlag = true;
        _.initials.thisIndex = _.computedIndex(index);
        _.initials.nextIndex = _.computedIndex(_.initials.thisIndex + 1);
        _.initials.prevIndex = _.computedIndex(_.initials.thisIndex - 1);

        _.$slides.each(function () {
            var self = this;
            this.left = this.left = _.initials.slideWidth * (this.index - _.initials.thisIndex);
            this.range = this.index - _.initials.thisIndex < 0 ? this.index - _.initials.thisIndex + _.initials.slideCount : this.index - _.initials.thisIndex;
            var transform = 'translate3d(' + self.left + 'px, 0, 0)';
            $(this).stop().css(_.autoprefixer(0, _.initials.transition, transform));
            if (this.index === _.initials.thisIndex) {
                $(this).addClass('eclipse-active').siblings().removeClass('eclipse-active');
            }

            setTimeout(function () {
                self.left = _.initials.slideWidth * (self.index - _.initials.thisIndex);
                self.transform = 'translate3d(' + self.left + 'px, 0, 0)';
                $(self).stop().css(_.autoprefixer(0, 'none', self.transform));
                _.initials.actionFlag = false;
                _.initials.touchstartFlag = false;
                _.initials.touchmoveFlag = false;

                console.log(self.index, self.point, self.range);
            }, _.options.speed);
        })
    }

    Eclipse.prototype.setSideSlides = function (callback) {
        var _ = this;
        _.$slides.each(function () {
            this.point = Math.abs(this.range) == _.initials.slideCount - 1 ? this.range < 0 ? 1 : -1 : this.range;
            this.left = _.initials.slideWidth * this.point;
            var transform = 'translate3d(' + this.left + 'px, 0, 0)';
            $(this).stop().css(_.autoprefixer(0, 'none', transform));
        }).promise().done(function () {
            if (callback) {
                setTimeout(function () {
                    callback();
                }, 10);
            }
        });
    }

    Eclipse.prototype.computedIndex = function (value) {
        var _ = this;
        return value < _.initials.slideCount ? value > -1 ? value : _.initials.slideCount - 1 : 0;
    }

    Eclipse.prototype.autoprefixer = function (left, transition, transform) {
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

    Eclipse.prototype.setEvents = function () {
        var _ = this;

        _.$slider.on('mousedown', function (e) {
            e.preventDefault();
            _.touchstart(e);
        });
        _.$arrowPrev.on('click', function () {
            if (_.initials.actionFlag) return;
            _.setSideSlides(function () {
                _.goToPrevOrNext(-1);
            });
        });
        _.$arrowNext.on('click', function () {
            if (_.initials.actionFlag) return;
            _.setSideSlides(function () {
                _.goToPrevOrNext(1);
            });
        });
        _.$pagingButton.on('click', function () {
            _.goToSlide($(this).index());
        });
    }

    Eclipse.prototype.init = function () {
        var _ = this;

        _.buildOut();
        _.buildControls();
        _.setSlidesStyle();
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