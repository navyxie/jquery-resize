/**
 * 基于jquery1.7+的调整容器大小插件
 * author:navy
 * email:navyxie2010@gmail.com
 * qq:951178609
 * version:1.0
 * date 2013-04-10
 */
var NAVY = NAVY || {};
NAVY.Resize = function(target,options){
    this.targetObj = $(target);
    var defaultOptions = {
        minWidth:100,
        minHeight:100,
        startWidth:0,
        startHeight:0,
        left:0,
        top:0,
        isMoveSpace:{
            x:3,
            y:3
        }
    };
    $.extend(defaultOptions,options);
    this.options = defaultOptions;
    this.init();
};
NAVY.Resize.prototype = {
    init:function(){
        var _this = this;
        var targetObj = _this.targetObj;
        targetObj.append(_this.makeResizeHtml());
        _this.resizeObjs = targetObj.find('.navy-window-resize');
        if(targetObj.css('position') === 'static'){
            targetObj.css('position','relative');
        };
        _this.initEvent();
        return this;
    },
    initEvent:function(){
        var targetObj = this.targetObj;
        var resizeObjs = this.resizeObjs;
        var options = this.options;
        var minWidth = options.minWidth,minHeight = options.minHeight;
        var isResize = false;//判断当前鼠标是否按下
        var startPos = {startWidth:options.startWidth,startHeight:options.startHeight,left:options.left,top:options.top,pageX:0,pageY:0};//记录目标移动对象targetObj的left和top值
        var resizeValue =null;
        var moveValue = 0, moveValue2 = 0,positionValue = 0,positionValue2 = 0;
        resizeObjs.mousedown(function(e){
//            direction = directionMap[$(this).attr('resize')];
            resizeValue = $(this).attr('resize');
            isResize = true;
            startPos.pageX = e.pageX;
            startPos.pageY = e.pageY;
            startPos.startWidth = targetObj.outerWidth();
            startPos.startHeight = targetObj.outerHeight();
            startPos.left = targetObj.position().left;
            startPos.top = targetObj.position().top;
            //NAVY.UTIL.Style.setMaxZIndex(targetObj[0]);//设置targetObj的z-index属性值为最大，效率低下。
            return false;
        });
        $(document).on('mousemove mouseup',function(e){
            switch(e.type){
                case 'mouseup':
                    isResize = false;
                    return false;
                    break;
                case 'mousemove' :
                    if(isResize){
                        var curPage = {x:e.pageX,y:e.pageY};//当前pageX和pageY值
                        var moveValueX = curPage.x - startPos.pageX;//当前鼠标移动的x方向上的值
                        var moveValueY = curPage.y - startPos.pageY;//当前鼠标移动的y方向上的值
                        if(moveValueX % options.isMoveSpace.x === 0 || moveValueY % options.isMoveSpace.y === 0){
                            if(resizeValue === 't'){
                                positionValue = startPos.top + moveValueY;
                                moveValue = startPos.startHeight - moveValueY;
                                moveValue = moveValue <= minHeight ? minHeight : moveValue;
                                targetObj.css({height:moveValue,top:positionValue});
                            }else if(resizeValue === 'b'){
                                moveValue = startPos.startHeight + moveValueY;
                                moveValue = moveValue <= minHeight ? minHeight : moveValue;
                                targetObj.css({height:moveValue});
                            }else if(resizeValue === 'l'){
                                positionValue = startPos.left + moveValueX;
                                moveValue = startPos.startWidth - moveValueX;
                                moveValue = moveValue <= minWidth ? minWidth : moveValue;
                                targetObj.css({width:moveValue,left:positionValue});
                            }else if(resizeValue === 'r'){
                                moveValue = startPos.startWidth + moveValueX;
                                moveValue = moveValue <= minWidth ? minWidth : moveValue;
                                targetObj.css({width:moveValue});
                            }else if(resizeValue === 'rt'){
                                moveValue = startPos.startWidth + moveValueX;
                                moveValue = moveValue <= minWidth ? minWidth : moveValue;
                                moveValue2 = startPos.startHeight - moveValueY;
                                moveValue2 = moveValue2 <= minHeight ? minHeight : moveValue2;
                                positionValue = startPos.top + moveValueY;
                                targetObj.css({width:moveValue,height:moveValue2,top:positionValue});
                                return false;
                            }else if(resizeValue === 'rb'){
                                moveValue = startPos.startWidth + moveValueX;
                                moveValue = moveValue <= minWidth ? minWidth : moveValue;
                                moveValue2 = startPos.startHeight + moveValueY;
                                moveValue2 = moveValue2 <= minHeight ? minHeight : moveValue2;
                                targetObj.css({width:moveValue,height:moveValue2});
                            }else if(resizeValue === 'lt'){
                                positionValue = startPos.left + moveValueX;
                                moveValue = startPos.startWidth - moveValueX;
                                moveValue = moveValue <= minWidth ? minWidth : moveValue;
                                positionValue2 = startPos.top + moveValueY;
                                moveValue2 = startPos.startHeight - moveValueY;
                                moveValue2 = moveValue2 <= minHeight ? minHeight : moveValue2;
                                targetObj.css({width:moveValue,height:moveValue2,left:positionValue,top:positionValue2});
                            }else{
                                //lb
                                positionValue = startPos.left + moveValueX;
                                moveValue = startPos.startWidth - moveValueX;
                                moveValue = moveValue <= minWidth ? minWidth : moveValue;
                                moveValue2 = startPos.startHeight + moveValueY;
                                moveValue2 = moveValue2 <= minHeight ? minHeight : moveValue2;
                                targetObj.css({width:moveValue,height:moveValue2,left:positionValue});
                            }
                        }
                    }
                    return false;
                    break;
            }
        });
        return this;
    },
    makeResizeHtml:function(){
        var resizeHtmlArr = ['<div class="navy-window-resize window-resize-t" resize="t"></div>'];
        resizeHtmlArr.push('<div class="navy-window-resize window-resize-r" resize="r"></div>');
        resizeHtmlArr.push('<div class="navy-window-resize window-resize-b" resize="b"></div>');
        resizeHtmlArr.push('<div class="navy-window-resize window-resize-l" resize="l"></div>');
        resizeHtmlArr.push('<div class="navy-window-resize window-resize-rt" resize="rt"></div>');
        resizeHtmlArr.push('<div class="navy-window-resize window-resize-rb" resize="rb"></div>');
        resizeHtmlArr.push('<div class="navy-window-resize window-resize-lt" resize="lt"></div>');
        resizeHtmlArr.push('<div class="navy-window-resize window-resize-lb" resize="lb"></div>');
        return resizeHtmlArr.join('');
    }
};