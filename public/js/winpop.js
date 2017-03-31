(function(window, jQuery, undefined) {

    var HTMLS = {
        ovl: '<div class="J_WinpopMask winpop-mask" id="J_WinpopMask"></div>' + '<div class="J_WinpopBox winpop-box" id="J_WinpopBox">' + '<div class="J_WinpopMain winpop-main"></div>' + '<div class="J_WinpopBtns winpop-btns"></div>' + '</div>',
        alert: '<input type="button" class="J_AltBtn pop-btn alert-button" value="确定">',
        confirm: '<input type="button" class="J_CfmFalse pop-btn confirm-false" value="取消">' + '<input type="button" class="J_CfmTrue pop-btn confirm-true" value="确定">'
    }

    function Winpop() {/*定义一个Winpop方法*/
    //this应该是指Winpop这个方法
        console.log(this)
        var config = {};/*config对象*/
        this.get = function(n) {/*获取config的键值*/
            return config[n];
        }

        this.set = function(n, v) {/*设置config的建值*/
            config[n] = v;
        }
        this.init();/*因为init是在原型中定义，可是使用this.init直接调用*/

    }

    Winpop.prototype = {/*拓展Winpop的原型方法*/
        init: function() {
            console.log('init')
            this.createDom();/*创建DOM节点*/
            this.bindEvent();/*为DOM节点绑定事件*/
        },
        createDom: function() {
            console.log('createDOM')
            var body = jQuery("body"),/*获取body*/
                ovl = jQuery("#J_WinpopBox");/*ovl获取J_WinpopBox*/
            if (ovl.length === 0) {/*当还没有ovl，创建ovl*/
                body.append(HTMLS.ovl);
            }

            this.set("ovl", jQuery("#J_WinpopBox"));/*将ovl存储在config里面*/
            this.set("mask", jQuery("#J_WinpopMask"));/*将mask存储在config里*/
            console.log("createDom this",this)
        },
        bindEvent: function() {
            console.log('bindEvent')
            var _this = this,
                ovl = _this.get("ovl"),/*获取config里的ovl*/
                mask = _this.get("mask");/*获取config里的mask*/
            ovl.on("click", ".J_AltBtn", function(e) {
                _this.hide();
            });
            ovl.on("click", ".J_CfmTrue", function(e) {
                var cb = _this.get("confirmBack");
                _this.hide();
                cb && cb(true);
            });
            ovl.on("click", ".J_CfmFalse", function(e) {
                var cb = _this.get("confirmBack");
                _this.hide();
                cb && cb(false);
            });
            mask.on("click", function(e) {
                _this.hide();
            });
            // jQuery(document).on("keyup", function(e) {
            //     var kc = e.keyCode,
            //         cb = _this.get("confirmBack");;
            //     if (kc === 27) {
            //         _this.hide();
            //     } else if (kc === 13) {
            //         _this.hide();
            //         if (_this.get("type") === "confirm") {
            //             cb && cb(true);
            //         }
            //     }
            // });
        },
        alert: function(str, btnstr) {

            var str = typeof str === 'string' ? str : str.toString(),
                ovl = this.get("ovl");/*获取config里的ovl*/
            this.set("type", "alert");/*将type存储在config里面*/
            ovl.find(".J_WinpopMain").html(str);
            if (typeof btnstr == "undefined") {
                ovl.find(".J_WinpopBtns").html(HTMLS.alert);
            } else {
                ovl.find(".J_WinpopBtns").html(btnstr);
            }
            console.log('alert this',this)
            this.show();
        },
        confirm: function(str, callback) {
            console.log('confirm')
            var str = typeof str === 'string' ? str : str.toString(),
                ovl = this.get("ovl");
            this.set("type", "confirm");/*将type存储在config里面*/
            ovl.find(".J_WinpopMain").html(str);
            ovl.find(".J_WinpopBtns").html(HTMLS.confirm);
            this.set("confirmBack", (callback || function() {}));/*将confirmBack存储在config里面*/
            console.log('confirm this',this)
            this.show();
        },
        show: function() {
            console.log('show')
            this.get("ovl").show();
            this.get("mask").show();
        },
        hide: function() {
            console.log('hide')
            var ovl = this.get("ovl");
            ovl.find(".J_WinpopMain").html("");
            ovl.find(".J_WinpopBtns").html("");
            ovl.hide();
            this.get("mask").hide();
        },
        destory: function() {
            this.get("ovl").remove();
            this.get("mask").remove();
            delete window.alert;
            delete window.confirm;
        }
    };

    var obj = new Winpop();
    window.alert = function(str) {
        obj.alert.call(obj, str);
    };
    window.confirm = function(str, cb) {
        obj.confirm.call(obj, str, cb);
    };
})(window, jQuery);