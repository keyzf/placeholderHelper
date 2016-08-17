/**
 * Created by zee on 2016/8/12.
 *
 */

(function ($) {
     $.fn.placeholderHelper = function(options) {
                var attr = 'placeholder',
                    nativeSupported = attr in document.createElement('input');
                return this.each(function() {
                    var self = $(this),
                        inputVal = $.trim(self.val()),
                        prev = self.prev(),
                        flag = true;
                    if (prev.hasClass("placeholderHelper")) {
                        return true; //存在跳过
                    }
                    if (typeof options === 'string') {
                        options = {
                            text: options
                        };
                    }
                    var opt = $.extend({
                        text: '',
                        style: {
                            'padding-left': '6px',
                            'display': "none"
                        },
                        useNative: true
                    }, options || {});
                    if (!opt.text) {
                        opt.text = self.attr(attr) || '';
                    }
                    if (!opt.useNative) {
                        self.attr(attr, "");
                    }
                    if ((!nativeSupported || opt.useNative == false) && flag) { // 判断浏览器是否支持 placeholder
                        var fontSize = self.css("font-size"),
                            height = self.css("height"),
                            lineHeight = self.css("line-height"),
                            heightSpan = $(self).is('textarea') ? lineHeight : height,
                            spanDom = $("<span class='placeholderHelper'>" + opt.text + "</span>");

                        opt.style = {
                            'height':heightSpan,
                            'line-height':heightSpan,
                            'font-size':fontSize,
                            "margin-left" : self.css("margin-left"),
                            "margin-top": self.css("margin-top"),
                            "padding-top" : self.css("padding-top"),
                            "padding-left" : self.css("padding-left"),
                            "top" : self.css("top"),
                            "left" : self.css('float') != 'none'?self.position().left: self.css('left')
                        };

                        spanDom.css(opt.style);

                        self.before(spanDom);

                        if (height == "0px") { //平台存在一开始获取高度为0的情况，只能特殊处理
                            setTimeout(function() {
                                height = self.css("height");
                                spanDom.css("height", height);
                                spanDom.css("line-height", height);
                            }, 50);
                        }
                        inputVal == "" && spanDom.show();
                        self.focus(function(e) {
                            flag = false;
                            spanDom.hide();
                        }).blur(function(e) {
                            if (!$.trim(self.val())) {
                                flag = true;
                                spanDom.show();
                            }
                        });
                        //处理ajax数据延时
                        self[0].onpropertychange = function() {
                            if ($.trim(self.val())) {
                                spanDom.hide();
                            }
                        };
                        spanDom.bind("focus click", function() {
                            spanDom.hide();
                            self.focus();
                        });
                    } else {
                        self.attr(attr, opt.text);
                    }
                });
            };
})(jQuery);