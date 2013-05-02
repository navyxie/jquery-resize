/**
 * 这个例子是结合了resize.js,drag.js插件写成的一个搭配demo
 */

$(function(){
    var dragWrapper = $('#dragWrapper');//目标容器对象
    var wrapperOffset = dragWrapper.offset();//目标容器对象的offset值
    var bodyObj = $('body');//body对象
    //目标容器对象的宽度和高度
    var wrapperWH = {
        width:dragWrapper.width(),
        height:dragWrapper.height()
    };
    //拖动对象水平方向和垂直方向最大边缘值
    var isDragRound = {
        pageX:wrapperWH.width+wrapperOffset.left,
        pageY:wrapperWH.height+wrapperOffset.top
    };
    var dragItemW = 150;//拖动item的宽度
    var dragItemH = 150;//拖动item的高度
    var itemIndex = 1;//生成拖动对象id下标
    var boundSpace = 5;//宝贝的边缘值
    var dragItemArr = [];//保存实例化的拖动对象
    /**
     * 向目标容器对象增加一个拖动对象
     * @param data 需要传入的数据，一般是宝贝信息
     */
    function addOneItem(data){
        var html = '<div class="itemDragContainer"><img class="" src="'+data.img+'" /></div>';
        var id = 'dragItemId'+itemIndex;
        var idSelector = '#'+id;//拼接id选择器
        $(html).appendTo(dragWrapper).attr('id',id);
        new NAVY.Resize(idSelector);
        dragItemArr.push(new NAVY.Drag(idSelector,idSelector,{left:data.left,top:data.top}));//将实例化出来的拖动对象暂存到dragItemArr中
        itemIndex++;
    }
    var isMouseDown = false;//鼠标是否按下
    var itemData = {};//记录宝贝信息
    var cloneObj = null;//拖动宝贝时clone的对象
    var ajustPosition = {};//拖动时，clone对象的适配值
    $('#floatRight').on('mousedown','.dragItem',function(e){
        var self = $(this);
        if(self.hasClass('dragItem')){
            isMouseDown = true;
            wrapperWH.height = dragWrapper.height();
            isDragRound.pageY = wrapperWH.height + wrapperOffset.top;
            itemData.img = self.find('img').attr('src');
            var itemOffset = self.offset();
            ajustPosition.left = e.pageX - itemOffset.left;
            ajustPosition.top = e.pageY - itemOffset.top;
            cloneObj = self.clone().css({'cursor':'pointer',position:'absolute',left:itemOffset.left,top:itemOffset.top}).attr('id','tempItemDrag').appendTo(bodyObj);//初始化clone的对象
        }
        return false;
    });
    $(document).mouseup(function(e){
        if(isMouseDown){
            var pageX = e.pageX;
            var pageY = e.pageY;
            //当拖动的宝贝在在目标容器对象的范围内处理操作
            if((pageX > (wrapperOffset.left - dragItemW) && pageX < isDragRound.pageX) && (pageY > (wrapperOffset.top - dragItemH) && pageY < isDragRound.pageY)){
                var tempLeft = pageX - wrapperOffset.left - ajustPosition.left;
                var tempTop = pageY - wrapperOffset.top - ajustPosition.top;
                var rightBound = wrapperWH.width - dragItemW - boundSpace;
                var bottomBound = wrapperWH.height - dragItemH - boundSpace;
                tempLeft = Math.min(rightBound,Math.max(tempLeft,boundSpace));//适配拖动对象水平方向上的值
                tempTop = Math.min(bottomBound,Math.max(tempTop,boundSpace));//适配拖动对象垂直方向上的值
                itemData.left = tempLeft;
                itemData.top = tempTop;
                addOneItem(itemData);
            }
            //清除克隆对象
            if(cloneObj.length){
                cloneObj.remove();
            }
            isMouseDown = false;
            return false;
        }
    }).mousemove(function(e){
            //移动clone对象
            if(isMouseDown && cloneObj.length){
                cloneObj.css({left:(e.pageX-ajustPosition.left),top:(e.pageY-ajustPosition.top)});
            }
        });
    $('#save').click(function(){
        var dragItemArrLen = dragItemArr.length,i = 0;
        //清除移动鼠标样式
        for(i = 0 ; i < dragItemArrLen ; i++){
            dragItemArr[i].setCursorDefault();
        }
        $('#tempWrapper').html($('#dragWrapper').clone());
        //重新设置鼠标样式为移动
        for(i = 0 ; i < dragItemArrLen ; i++){
            dragItemArr[i].setCursorMove();
        }
    });
    //new NAVY.Scroll($('#content'),$('#dragWrapper'),{mouseWheelSpace:5,hoverHideScroll:true});
});
