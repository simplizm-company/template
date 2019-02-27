

// 양사이드 비는 현상




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
                slidesToMove: 1, // 한번에 움직이는 slides 갯수
                speed: 500, // 전환 속도
                margin: 0, // slides 간격
                friction: 200 // mousemove, touchmove 감도
            }

            _.options = $.extend({}, _.defaults, settings);

            _.initials = {
                slidesCount: 0, // slides 갯수
                thisIndex: 0, // 현재 index
                thisLastIndex: 0, // active중 마지막 index
                sliderWidth: 0, // 슬라이더 너비값
                nextIndex: 0, // 다음 index
                transition: _.options.speed + 'ms', // transition 속도
                playActionFlag: false, // 시작종료 flag
                viewIndex: [], // 보여지는 slides의 배열
                computedIndexArray: [], // 계산용 index 배열
                clickStartFlag: false, // click start flag
                clickStartPosX: 0,
                clickMovePosX: 0,
                setMoveChecker: false,
                arrayCheckPoint: [],
                thisPageIndex: 0,
                pagerComputedLength: 0
            }

            _.$eclipse = $(element);

            _.init(true);
        }

        return eclipse;
    }());

    Eclipse.prototype.preparationAction = function (prevOrNext, callback) {
        // 예비동작
        var _ = this;

        if (!_.initials.playActionFlag) {
            _.initials.playActionFlag = true;
            _.$slides.each(function (i) {
                this.isView = undefined;
                for (var j = 0; j < _.initials.viewIndex.length; j++) {
                    if (this.index === _.initials.viewIndex[j]) {
                        this.isView = _.initials.viewIndex.indexOf(_.initials.viewIndex[j]);
                    }
                }
                if (prevOrNext === 'next') {
                    this.point = i - _.initials.thisIndex < 0 ? i - _.initials.thisIndex + _.initials.slidesCount : i - _.initials.thisIndex;
                }
                if (prevOrNext === 'prev') {
                    if (this.isView !== undefined) {
                        this.point = this.isView;
                    } else {
                        this.point = i - _.initials.thisIndex > 0 ? i - _.initials.thisIndex - _.initials.slidesCount : i - _.initials.thisIndex;
                    }
                }
                this.left = this.width * this.point + (_.options.margin * this.point);
                this.transform = 'translate3d(' + this.left + 'px, 0, 0)';
                $(this).stop().css(_.autoPrefixer(0, 'none', this.transform));
            }).promise().done(function () {
                if (callback) {
                    setTimeout(function () {
                        callback();
                    }, 50);
                }
            });
        }
    }

    Eclipse.prototype.goToSlidesPrevOrNext = function (nextIndex) {
        var _ = this;

        var computedNextIndex = 0;

        if (nextIndex == 'next') {
            _.initials.thisPageIndex++;
            _.initials.thisPageIndex = _.initials.thisPageIndex !== _.initials.arrayCheckPoint.length ? _.initials.thisPageIndex : 0;
            console.log(_.initials.thisPageIndex);
            if (_.options.slidesToMove !== 1) {
                if (_.initials.thisPageIndex == _.initials.arrayCheckPoint.length - 1) {
                    computedNextIndex = _.initials.arrayCheckPoint.slice(-1)[0] % _.options.slidesToMove;
                } else {
                    if (_.initials.thisPageIndex == 0) {
                        computedNextIndex = _.options.slidesToShow;
                    } else {
                        computedNextIndex = _.options.slidesToMove;
                    }
                }
            } else {
                computedNextIndex = 1;
            }
        }

        if (nextIndex == 'prev') {
            _.initials.thisPageIndex--;
            _.initials.thisPageIndex = _.initials.thisPageIndex !== -1 ? _.initials.thisPageIndex : _.initials.arrayCheckPoint.length - 1;
            console.log(_.initials.thisPageIndex);
            if (_.options.slidesToMove !== 1) {
                if (_.initials.thisPageIndex == _.initials.arrayCheckPoint.length - 2) {
                    computedNextIndex = -_.initials.arrayCheckPoint.slice(-1)[0] % _.options.slidesToMove;
                } else {
                    if (_.initials.thisPageIndex == _.initials.arrayCheckPoint.length - 1) {
                        computedNextIndex = -_.options.slidesToShow;
                    } else {
                        computedNextIndex = -_.options.slidesToMove;
                    }
                }
            } else {
                computedNextIndex = -1;
            }
        }

        console.log(computedNextIndex);

        _.$slides.each(function (i) {
            this.point -= computedNextIndex;
            this.left = this.width * this.point + (_.options.margin * this.point);
            this.transform = 'translate3d(' + this.left + 'px, 0, 0)';
            $(this).stop().css(_.autoPrefixer(0, _.initials.transition, this.transform));
        }).promise().done(function () {
            _.initials.thisIndex = _.initials.computedIndexArray[_.initials.thisIndex + _.initials.slidesCount + computedNextIndex];
            _.setSlideEnd(computedNextIndex);
        });
    }

    Eclipse.prototype.goToSlides = function (nextIndex) {
        var _ = this;
        var movetype = nextIndex > _.initials.thisIndex ? 'next' : 'prev';

        if (_.initials.thisIndex !== nextIndex && !_.initials.playActionFlag) {
            if (_.options.slidesToMove == 1) {
                var computedNextIndex = nextIndex;
            } else {
                var computedNextIndex = nextIndex + (_.options.slidesToShow - 1) > _.initials.slidesCount - 1 ?
                (_.initials.slidesCount - 1) - (_.options.slidesToShow - 1) :
                nextIndex;
            }
            _.preparationAction(movetype, function () {
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

    Eclipse.prototype.setActiveClass = function (nextIndex) {
        var _ = this;

        _.$slides.removeClass('eclipse-active');
        for (var j = 0; j < _.initials.viewIndex.length; j++) {
            _.initials.viewIndex[j] = _.initials.computedIndexArray[_.initials.viewIndex[j] + _.initials.slidesCount + nextIndex];
            _.$slides.eq(_.initials.viewIndex[j]).addClass(`eclipse-active eclipse-active-${j + 1}`).siblings().removeClass(`eclipse-active-${j + 1}`);
        }
    }

    Eclipse.prototype.setSlideEnd = function (nextIndex) {
        var _ = this;

        _.setActiveClass(nextIndex);
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

        if (_.options.pager === true && _.initials.slidesCount > _.options.slidesToMove) {
            if (_.options.slidesToMove == 1) {
                _.initials.pagerComputedLength = _.initials.slidesCount;
            } else {
                _.initials.pagerComputedLength = Math.ceil((_.initials.slidesCount - _.options.slidesToShow) / _.options.slidesToMove) + 1;
            }
            var paging = $('<div />').addClass(`${_.options.nameSpace}-paging`);
            for (var i = 1; i <= _.initials.pagerComputedLength; i++) {
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

        for (var j = 0; j < _.options.slidesToShow; j++) {
            _.initials.viewIndex[j] = vi;
            vi = vi + 1 > _.initials.slidesCount - 1 ? 0 : vi + 1;
        }

        _.$slides.each(function (i) {
            this.width = (_.initials.sliderWidth - (_.options.slidesToShow - 1) * _.options.margin) / _.options.slidesToShow;
            this.height = $(this).height();
            this.index = i;
            this.point = i - _.options.startIndex < 0 ? i - _.options.startIndex + _.initials.slidesCount : i - _.options.startIndex;
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
            _.setActiveClass(0);
        });
    }

    Eclipse.prototype.setInitials = function () {
        var _ = this;

        _.initials.slidesCount = _.$slides.length;
        _.initials.thisIndex = _.options.startIndex;
        _.initials.sliderWidth = _.$slider.width();
        _.options.slidesToMove = _.initials.slidesCount / _.options.slidesToShow < _.options.slidesToMove ? 1 : _.options.slidesToMove;

        if (_.options.slidesToMove === 1) {
            for (var i = 0; i < _.initials.slidesCount; i++) {
                _.initials.arrayCheckPoint.push(i);
            }
        } else {
            for (var i = 0; i < _.initials.slidesCount; i++) {
                if (i % _.options.slidesToMove == 0 && _.initials.arrayCheckPoint.length < Math.ceil((_.initials.slidesCount - _.options.slidesToShow) / _.options.slidesToMove) + 1) {
                    _.initials.arrayCheckPoint.push(i + _.options.slidesToShow - 1 > _.initials.slidesCount - 1 ? i - (_.options.slidesToMove - 1) : i);
                }
            }
        }
        console.log(_.initials.arrayCheckPoint)
    }

    Eclipse.prototype.clickStart = function (e) {
        var _ = this;

        _.initials.clickStartPosX = e.posX;

        $(document).on({
            'clickmove.eclipse': function (e) {
                _.clickMove(e);
            },
            'clickend.eclipse': function (e) {
                _.clickEnd(e);
            }
        });
    }

    Eclipse.prototype.clickMove = function (e) {
        var _ = this;

        _.initials.clickMovePosX = _.initials.clickStartPosX - e.posX;

        if (_.initials.clickMovePosX > 0 && !_.initials.setMoveChecker) {
            _.initials.setMoveChecker = 'next';
            _.preparationAction('next');
        }
        if (_.initials.clickMovePosX < 0 && !_.initials.setMoveChecker) {
            _.initials.setMoveChecker = 'prev';
            _.preparationAction('prev');
        }
        if (_.initials.setMoveChecker == 'prev' && _.initials.clickMovePosX > 0) {
            _.initials.playActionFlag = false;
            _.initials.setMoveChecker = 'next';
            _.preparationAction('next');
        }
        if (_.initials.setMoveChecker == 'next' && _.initials.clickMovePosX < 0) {
            _.initials.playActionFlag = false;
            _.initials.setMoveChecker = 'prev';
            _.preparationAction('prev');
        }
        _.$slides.each(function (i) {
            this.move = this.left - _.initials.clickMovePosX;
            this.transform = 'translate3d(' + this.move + 'px, 0, 0)';
            $(this).stop().css(_.autoPrefixer(0, 'none', this.transform));
        });
    }

    Eclipse.prototype.clickEnd = function (e) {
        var _ = this;

        if (Math.abs(_.initials.clickMovePosX) > _.options.friction) {
            if (_.initials.clickMovePosX > 0) {
                // next
                _.goToSlidesPrevOrNext('next');
            }
            if (_.initials.clickMovePosX < 0) {
                // prev
                _.goToSlidesPrevOrNext('prev');
            }
        } else {
            // this
            _.goToSlidesPrevOrNext(0);
        }
        $(document).off('clickmove.eclipse clickend.eclipse');
        _.initials.clickStartPosX = 0;
        _.initials.clickMovePosX = 0;
        _.initials.setMoveChecker = false;
    }

    Eclipse.prototype.setEvents = function () {
        var _ = this;

        _.$slider.on({
            'clickstart.eclipse': function (e) {
                _.clickStart(e);
            }
        });

        _.$arrowPrev.on('click', function () {
            _.preparationAction('prev', function () {
                _.goToSlidesPrevOrNext('prev');
            });
        });

        _.$arrowNext.on('click', function () {
            _.preparationAction('next', function () {
                _.goToSlidesPrevOrNext('next');
            });
        });

        _.$pagingButton.on('click', function () {
            // console.log(_.initials.slidesCount <= $(this).index() * _.options.slidesToShow + (_.options.slidesToShow - 1) ? $(this).index() * _.options.slidesToShow - (_.options.slidesToShow - 1) : $(this).index() * _.options.slidesToShow);
            // _.goToSlides(_.initials.slidesCount <= $(this).index() * _.options.slidesToShow + (_.options.slidesToShow - 1) ? $(this).index() * _.options.slidesToShow - (_.options.slidesToShow - 1) : $(this).index() * _.options.slidesToShow);
            _.initials.thisPageIndex = $(this).index();
            _.goToSlides(_.initials.arrayCheckPoint[$(this).index()]);
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