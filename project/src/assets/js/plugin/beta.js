;(function ($) {
    'use strict';

    var Beta = (function () {
        function Beta (settings) {
            this._VERSION = '1.0';

            this.defaults = {

            }

            this.events = {
                touchstart: 'touchstart.beta',
                touchmove: 'touchmove.beta',
                touchend: 'touchend.beta'
            }

            this.options = $.extend(this.defaults, settings);

            this.init();
        }
        return Beta;
    }());

    var _isMobile = (function() {
        var check = false;
        (function(a){
            if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) {
                check = true;
            }
        })(navigator.userAgent||navigator.vendor||window.opera);
        return check;
    })();

    Beta.prototype.init = function () {
        var _ = this;

        if (_isMobile) {
            _.mobileInit();
            alert('mobile');
        } else {
            _.pcInit();
            alert('pc');
        }
    }

    Beta.prototype.mobileInit = function () {
        var _ = this;

        _.mobileOffset = 0;
        _.rememberOffset = 0;
        _.touchendDelta = 0;
        _.touchFlag = false;

        _.setBodyInnerWrap();
        _.setBodyFixed();
        _.mobileEvents();
    }

    Beta.prototype.setBodyFixed = function () {
        var _ = this;

        $('html, body').css({
            'position': 'fixed',
            'overflow': 'hidden',
            'width': '100%',
            'height': '100%'
        });
        _.$beta.css({'position': 'relative'});
    }

    Beta.prototype.setBodyInnerWrap = function () {
        var _ = this;

        _.$beta = $('body').wrapInner('<div id="beta-wrap"></div>').children('#beta-wrap');
    }

    Beta.prototype.mobileEvents = function () {
        var _ = this;

        var startY;
        var thisY;
        var moveY;
        var lastY;
        var thisT;
        var moveT;
        var lastT;
        var speed;

        $(document).on([_.events.touchstart, _.events.touchmove, _.events.touchend].join(' '), function (e) {
            var touch = e.changedTouches[0];
            e.preventDefault();

            thisT = e.timeStamp;
            thisY = touch.clientY;

            switch (e.type) {
                case 'touchstart':
                    _.touchFlag = true;
                    startY = lastY = thisY;
                    _.mobileOffset = _.rememberOffset;
                    _.$beta.css({'top': _.mobileOffset});

                    break;
                case 'touchmove':
                    _.touchFlag = true;
                    moveT = thisT - lastT;
                    moveY = thisY - lastY;

                    lastT = thisT;
                    lastY = thisY;

                    _.mobileOffset = _.mobileOffset + moveY > 0 ? 0 : _.mobileOffset + moveY;
                    _.$beta.css({'top': _.mobileOffset});

                    break;
                case 'touchend':
                    _.touchFlag = false;
                    _.touchendDelta = 0;

                    if (Math.abs(startY - thisY) < 30) {
                        return;
                    } else {
                        speed = Math.max(Math.min(moveY / moveT, 3), -3);
                        _.touchendMove(speed);
                    }

                    break;
            }
        });
    }

    Beta.prototype.touchendMove = function (speed) {
        var _ = this;

        if (_.touchendDelta < 1 && !_.touchFlag) {
            var easing = Math.pow((_.touchendDelta - 1), 3) + 1;
            var offset = 200 * (speed * easing);

            _.rememberOffset = _.mobileOffset + offset;
            _.$beta.css({'top': _.rememberOffset});

            setTimeout(function () {
                _.touchendDelta += 1 / 100;
                _.touchendMove(speed);
            }, 1);
        }
    }

    Beta.prototype.pcInit = function () {
        var _ = this;

        console.log('pc');
    }

    window.beta = function (settings) {
        return new Beta(settings);
    }
}(jQuery));