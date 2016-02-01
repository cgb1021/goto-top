/*
 * 返回顶部按钮
 * http://xhyo.com/
 * Copyright (c) 2015 Bill Chen(chenguibiao@yy.com/48838096@qq.com)
 *
 * 需要html5.js
 *
 */
(function(window){
    var document = window.document;
    var addEvent = (function(){
        return window.addEventListener?
            function(dom, type, fn){dom.addEventListener(type, fn);}:
            (window.attachEvent?
                function(dom, type, fn){dom.attachEvent('on'+type, fn)}:
                function(dom, type, fn){dom['on'+type]= fn});
    })();
    var bind = function(context, fn) {
        return function() {fn.apply(context, arguments)}
    };
    var classList = html5Test.classList?null:window.classList;

    var node = null; //点击回到顶部按钮
    var intervalId = 0; //setInterval ID
    var stateChangeHeight = 0; //显示先上按钮状态高度
    var speed = 0; //返回顶部滚动速度
    var isStateHide = true; //是否隐藏
    var scrollTop = 0; //滚动条距离
    var clickEvent = null; //按钮点击事件
    var scrollEvent = null; //滚动事件

    window.gotoTop = function(option){
        node = option.node;
        stateChangeHeight = option.stateChangeHeight||document.documentElement.clientHeight*0.2;
        speed = option.speed || document.documentElement.clientHeight*0.2;
        clickEvent = typeof option.clickEvent == 'function'?bind(this, option.clickEvent):function(){};
        scrollEvent = typeof option.scrollEvent == 'function'? bind(this, option.scrollEvent):function(){};

        this.isStateHide = true;
        window.setTimeout(bind(this, function(){
            this.scrollTop = scrollTop = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
            if(scrollTop > stateChangeHeight) {
                //显示按钮
                if(html5Test.classList)
                    node.classList.remove('hide');
                else
                    classList.remove(node, 'hide');
                this.isStateHide = isStateHide = false;
            }}), 100);

        addEvent(node, 'click', bind(this, function(e){
            if(e.preventDefault)
                e.preventDefault();
            else
                e.returnValue = false;

            if(intervalId>0)
                return false;

            intervalId = window.setInterval(function(){
                this.scrollTop = scrollTop = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
                if(scrollTop<= 0) {
                    window.clearInterval(intervalId);
                    intervalId = 0;
                }
                window.scrollTo(0, scrollTop-speed);
                //console.log('gotop');
            }, 25);

            clickEvent();
        }));
        addEvent(window, 'scroll', html5Test.classList?bind(this, function() {
            this.scrollTop = scrollTop = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
            if (isStateHide && scrollTop > stateChangeHeight) {
                //显示按钮
                node.classList.remove('hide');
                this.isStateHide = isStateHide = false;
                //console.log('show');
            } else if (!isStateHide && scrollTop <= stateChangeHeight) {
                //隐藏按钮
                node.classList.add('hide');
                this.isStateHide = isStateHide = true;
                //console.log('hide');
            }
            scrollEvent();
        }):bind(this, function() {
            this.scrollTop = scrollTop = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
            if (isStateHide && scrollTop > stateChangeHeight) {
                //显示按钮
                classList.remove(node, 'hide');
                this.isStateHide = isStateHide = false;
                //console.log('show');
            } else if (!isStateHide && scrollTop <= stateChangeHeight) {
                //隐藏按钮
                classList.add(node, 'hide');
                this.isStateHide = isStateHide = true;
                //console.log('hide');
            }
            scrollEvent();
        }));
    }
})(window);