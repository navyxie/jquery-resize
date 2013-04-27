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
    this.orignTarget = target;
    this.targetObj = $(target);
    var defaultOptions = {
        minWidth:100,
        minHeight:100,
        startWidth:150,
        startHeight:150,
        left:0,
        top:0,
        isMoveSpace:{
            x:3,
            y:3
        },
        limitObj: this.targetObj.offsetParent() || 'body',
        isLimit:true,
        isL:true,
        isR:true,
        isT:true,
        isB:true,
        isRT:true,
        isRB:true,
        isLT:true,
        isLB:true
    };
    $.extend(defaultOptions,options);
    this.options = defaultOptions;
    this.init();
};
NAVY.Resize.prototype = {
    init:function(){
        var _this = this;
        var targetObj = _this.targetObj;
        var options = _this.options;
        targetObj.append(_this.makeResizeHtml()).css({width:options.startWidth,height:options.startHeight});
        _this.limitObjWidth = this.options.limitObj.width();
        _this.limitObjHeight = this.options.limitObj.height();
        _this.resizeObjs = targetObj.find('.navy-window-resize');
        if(targetObj.css('position') === 'static'){
            targetObj.css('position','relative');
        }
        _this.initEvent();
        return this;
    },
    initEvent:function(){
        var _this = this;
        var targetObj = this.targetObj;
        var resizeObjs = this.resizeObjs;
        var options = this.options;
        var minWidth = options.minWidth,minHeight = options.minHeight;
        var isResize = false;//判断当前鼠标是否按下
        var startPos = {startWidth:options.startWidth,startHeight:options.startHeight,left:options.left,top:options.top,pageX:0,pageY:0};//记录目标移动对象targetObj的left和top值
        var resizeValue =null;
        var moveValue = 0, moveValue2 = 0,positionValue = 0,positionValue2 = 0;
        var limitObjWidth = this.limitObjWidth,limitObjHeight = this.limitObjHeight;
        var tempValue,tempValue2;//temp the maxMoveValue
        resizeObjs.mousedown(function(e){
//            direction = directionMap[$(this).attr('resize')];
            var $this = $(this);
            targetObj = $this.closest(_this.orignTarget);
            resizeValue = $this.attr('resize');
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
                                if(options.isLimit){
                                    positionValue = Math.max((startPos.top + moveValueY),0);
                                    moveValue = startPos.startHeight - moveValueY;
                                    moveValue = moveValue <= minHeight ? minHeight : moveValue;
                                    tempValue = limitObjHeight-positionValue;
                                    if(moveValue >= tempValue){
                                        moveValue = tempValue
                                    }
                                    if(moveValue === minHeight){
                                        targetObj.css({height:moveValue});
                                    }else{
                                        targetObj.css({height:moveValue,top:positionValue});
                                    }
                                }else{
                                    positionValue = startPos.top + moveValueY;
                                    moveValue = startPos.startHeight - moveValueY;
                                    targetObj.css({height:moveValue,top:positionValue});
                                }
                            }else if(resizeValue === 'b'){
                                if(options.isLimit){
                                    moveValue = startPos.startHeight + moveValueY;
                                    moveValue = moveValue <= minHeight ? minHeight : moveValue;
                                    tempValue = limitObjHeight - startPos.top;
                                    if(moveValue >= tempValue){
                                        moveValue = tempValue;
                                    }
                                    targetObj.css({height:moveValue});
                                }else{
                                    moveValue = startPos.startHeight + moveValueY;
                                    targetObj.css({height:moveValue});
                                }

                            }else if(resizeValue === 'l'){
                                if(options.isLimit){
                                    positionValue = Math.max((startPos.left + moveValueX),0);
                                    moveValue = startPos.startWidth - moveValueX;
                                    moveValue = moveValue <= minWidth ? minWidth : moveValue;
                                    tempValue = limitObjWidth - positionValue;
                                    if(moveValue >= tempValue){
                                        moveValue = tempValue;
                                    }
                                    if(moveValue === minWidth){
                                        targetObj.css({width:moveValue});
                                    }else{
                                        targetObj.css({width:moveValue,left:positionValue});
                                    }
                                }else{
                                    positionValue = startPos.left + moveValueX;
                                    moveValue = startPos.startWidth - moveValueX;
                                    targetObj.css({width:moveValue,left:positionValue});
                                }
                            }else if(resizeValue === 'r'){
                                if(options.isLimit){
                                    moveValue = startPos.startWidth + moveValueX;
                                    moveValue = moveValue <= minWidth ? minWidth : moveValue;
                                    tempValue = limitObjWidth - startPos.left;
                                    if(moveValue >= tempValue){
                                        moveValue = tempValue;
                                    }
                                    targetObj.css({width:moveValue});
                                }else{
                                    moveValue = startPos.startWidth + moveValueX;
                                    targetObj.css({width:moveValue});
                                }

                            }else if(resizeValue === 'rt'){
                                if(options.isLimit){
                                    moveValue = startPos.startWidth + moveValueX;
                                    moveValue = moveValue <= minWidth ? minWidth : moveValue;
                                    moveValue2 = startPos.startHeight - moveValueY;
                                    moveValue2 = moveValue2 <= minHeight ? minHeight : moveValue2;
                                    positionValue = Math.max((startPos.top + moveValueY),0);
                                    tempValue = limitObjWidth - startPos.left;
                                    tempValue2 = limitObjHeight - positionValue;
                                    if(moveValue >= tempValue){
                                        moveValue = tempValue;
                                    }
                                    if(moveValue2 >= tempValue2){
                                        moveValue2 = tempValue2;
                                    }
                                    if(moveValue2 === minHeight){
                                        targetObj.css({width:moveValue,height:moveValue2});
                                    }else{
                                        targetObj.css({width:moveValue,height:moveValue2,top:positionValue});
                                    }
                                }else{
                                    moveValue = startPos.startWidth + moveValueX;
                                    moveValue2 = startPos.startHeight - moveValueY;
                                    positionValue = startPos.top + moveValueY;
                                    targetObj.css({width:moveValue,height:moveValue2,top:positionValue});
                                }
                            }else if(resizeValue === 'rb'){
                                if(options.isLimit){
                                    moveValue = startPos.startWidth + moveValueX;
                                    moveValue = moveValue <= minWidth ? minWidth : moveValue;
                                    moveValue2 = startPos.startHeight + moveValueY;
                                    moveValue2 = moveValue2 <= minHeight ? minHeight : moveValue2;
                                    tempValue = limitObjWidth - startPos.left;
                                    tempValue2 = limitObjHeight - startPos.top;
                                    if(moveValue >= tempValue){
                                        moveValue = tempValue;
                                    }
                                    if(moveValue2 >= tempValue2){
                                        moveValue2 = tempValue2;
                                    }
                                    targetObj.css({width:moveValue,height:moveValue2});
                                }else{
                                    moveValue = startPos.startWidth + moveValueX;
                                    moveValue2 = startPos.startHeight + moveValueY;
                                    targetObj.css({width:moveValue,height:moveValue2});
                                }
                            }else if(resizeValue === 'lt'){
                                if(options.isLimit){
                                    positionValue = Math.max((startPos.left + moveValueX),0);
                                    moveValue = startPos.startWidth - moveValueX;
                                    moveValue = moveValue <= minWidth ? minWidth : moveValue;
                                    positionValue2 = Math.max((startPos.top + moveValueY),0);
                                    moveValue2 = startPos.startHeight - moveValueY;
                                    moveValue2 = moveValue2 <= minHeight ? minHeight : moveValue2;
                                    tempValue = limitObjWidth - positionValue;
                                    tempValue2 = limitObjHeight - positionValue2;
                                    if(moveValue >= tempValue){
                                        moveValue = tempValue;
                                    }
                                    if(moveValue2 >= tempValue2){
                                        moveValue2 = tempValue2;
                                    }
                                    if(moveValue === minWidth){
                                        if(moveValue2 !== minHeight){
                                            targetObj.css({width:moveValue,height:moveValue2,top:positionValue2});
                                        }else{
                                            targetObj.css({width:moveValue,height:moveValue2});
                                        }
                                    }else if(moveValue2 === minHeight){
                                        targetObj.css({width:moveValue,height:moveValue2,left:positionValue});
                                    }else{
                                        targetObj.css({width:moveValue,height:moveValue2,left:positionValue,top:positionValue2});
                                    }
                                }else{
                                    positionValue = startPos.left + moveValueX;
                                    positionValue2 = startPos.top + moveValueY;
                                    moveValue = startPos.startWidth - moveValueX;
                                    moveValue2 = startPos.startHeight - moveValueY;
                                    targetObj.css({width:moveValue,height:moveValue2,left:positionValue,top:positionValue2});
                                }
                            }else{
                                //lb
                                if(options.isLimit){
                                    positionValue = Math.max((startPos.left + moveValueX),0);
                                    moveValue = startPos.startWidth - moveValueX;
                                    moveValue = moveValue <= minWidth ? minWidth : moveValue;
                                    moveValue2 = startPos.startHeight + moveValueY;
                                    moveValue2 = moveValue2 <= minHeight ? minHeight : moveValue2;
                                    tempValue = limitObjWidth - positionValue;
                                    tempValue2 = limitObjHeight - startPos.top;
                                    if(moveValue >= tempValue){
                                        moveValue = tempValue;
                                    }
                                    if(moveValue2 >= tempValue2){
                                        moveValue2 = tempValue2;
                                    }
                                    if(moveValue === minWidth){
                                        targetObj.css({width:moveValue,height:moveValue2});
                                    }else{
                                        targetObj.css({width:moveValue,height:moveValue2,left:positionValue});
                                    }
                                }else{
                                    positionValue = startPos.left + moveValueX;
                                    moveValue = startPos.startWidth - moveValueX;
                                    moveValue2 = startPos.startHeight + moveValueY;
                                    targetObj.css({width:moveValue,height:moveValue2,left:positionValue});
                                }
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
        var options = this.options;
        var resizeHtmlArr = [];
        if(options.isT){
            resizeHtmlArr.push('<div class="navy-window-resize window-resize-t" resize="t"></div>');
        }
        if(options.isR){
            resizeHtmlArr.push('<div class="navy-window-resize window-resize-r" resize="r"></div>');
        }
        if(options.isB){
            resizeHtmlArr.push('<div class="navy-window-resize window-resize-b" resize="b"></div>');
        }
        if(options.isL){
            resizeHtmlArr.push('<div class="navy-window-resize window-resize-l" resize="l"></div>');
        }
        if(options.isRT){
            resizeHtmlArr.push('<div class="navy-window-resize window-resize-rt" resize="rt"></div>');
        }
        if(options.isRB){
            resizeHtmlArr.push('<div class="navy-window-resize window-resize-rb" resize="rb"></div>');
        }
        if(options.isLT){
            resizeHtmlArr.push('<div class="navy-window-resize window-resize-lt" resize="lt"></div>');
        }
        if(options.isLB){
            resizeHtmlArr.push('<div class="navy-window-resize window-resize-lb" resize="lb"></div>');
        }
        return resizeHtmlArr.join('');
    }
};