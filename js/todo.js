var clickButton = "all";


$(document).ready(function () {
    // 返回被选中的多选框
    function ckbClick() {
        return $("input[name ='ckb']:checked");
    }

    function notckbClick() {
        return $("input[name ='ckb']").not("input:checked");
    }

    // 返回被选中多选框的父节点（li）
    function ckbparent() {
        return ckbClick().parent();
    }

    function notCkbparent() {
        return notckbClick().parent();
    }

    // 底部按钮的显示
    function btnShow() {
        let liLength = $("#all li").length;
        if (liLength) {
            $("#btn").show();
            $(".foot").show();
        } 
        else {
            $("#btn").hide();
            $(".foot").hide();
        }

    }

    // 获取未完成todo的数量
    function todoNum() {
        let num = notckbClick().length;
        if (num === 1) {
            $("#record").html(num + "item left");
        }
        else {
            $("#record").html(num + "items left");
        }

    }

    // 底部Clear completed按钮的显示
    function clearBt() {
        if (ckbClick().length) {
            $("#clear").show();
        }
        else {
            $("#clear").hide();
        }

    }

    // 输入框左侧的全选按钮的显示
    function allCkbShow() {
        let allLength = $("#all li").length;

        if (allLength === 0) {
            $("#allCkb img").hide();
        }
        else {
            if (notckbClick().length === 0) {
                $("#allCkb").html("<img src='images\\all_check-1.jpg' >");
            }
            else {
                $("#allCkb").html("<img src='images\\all_check.jpg' >");
            }

        }

    }

    // 多选框选中与否时文字样式和多选框背景的改变
    function doneText() {
        ckbClick().siblings('label').css({'text-decoration':'line-through','color':'#d7d7d7'});
        ckbClick().siblings('label').css({"text-decoration": "none","color": "#363535"});

        ckbClick().css("background","url(images/checkbox-1.jpg)");
        notckbClick().css("background","url(images/checkbox.jpg)");
    }

    // 获取本地存储并使用JSON.parse转化数据
    function getJsons() {
        let json = JSON.parse(localStorage.getItem("jsons"));
        return json;
    }

    // 存储数据到本地
    function setJsons(json) {
        localStorage.clear();
        let jsons = JSON.stringify(json);
        localStorage.setItem("jsons",jsons);
    }

    // 多选框选中与否时本地state的改变
    function ckbstate() {
        let jsonArray_1 = getJsons();
            for (let i = 0; i < $("#all li").length; i++) {
                // 遍历li节点
                let liEq = $("li").eq(i);
                if (liEq.children("input[name='ckb']").is(":checked")) {
                    jsonArray_1[i].state = "checked";
                }
                else {
                    jsonArray_1[i].state = "notchecked";
                }

            }
            
            setJsons(jsonArray_1);
    }

    // 删除某条数据事件
    function localStorageRemove(index) {
        let jsonArray_2 = getJsons();
        jsonArray_2.splice(index,1);
        setJsons(jsonArray_2); 
    }

    // todo事件的修改
    function inputReplaceWith(theIndex,e) {
        if (!$("#inputlb").val()) {
            $("#inputlb").parent().remove();
            localStorageRemove(theIndex);
            checkedThing();
            e.preventDefault();
        }
        else {
            let newtxt = $("#inputlb").val();
            $("#inputlb").replaceWith("<label class='lbTxt'>" + newtxt + "</label>");
            let jsonArray_3 = getJsons();
            jsonArray_3[theIndex].content = newtxt;
            setJsons(jsonArray_3);
        }

    }
    // 在不同按钮选中状态下，li的显示
    function liShow() {
        switch(clickButton) {
            case "all":
                checkedThing();
                break;
            case "active":
                ckbparent().hide();
                notCkbparent().show();
                checkedThing();
                break;
            case "completed":
                notCkbparent().hide();
                ckbparent().show();
                checkedThing();
                break;
        }
    }

    function checkedThing() {
        todoNum();
        clearBt();
        doneText();
        allCkbShow();
        btnShow();
    }

    // 为ul动态添加li
    function addLi(newItem,x) {
        if (x === 0) {
            let liTemp = ""
            + "<li>" 
            +    "<input class='ckbn' type='checkbox' name='ckb' style='background: url(../images/checkbox.jpg) no-repeat' >"
            +    "<label class='lbTxt'>" + newItem + "</label>" 
            +    "<button class='clearX' >" + "×" + "</button>" 
            + "</li>";
            $("#all").append(liTemp);
            $("#allCkb img").show();
        }
        else {
            let liTemp = ""
            + "<li>" 
            +    "<input class='ckbn' type='checkbox' name='ckb' style='background: url(../images/checkbox.jpg) no-repeat' checked='checked'>"
            +    "<label class='lbTxt'>" + newItem + "</label>" 
            +    "<button class='clearX' >" + "×" + "</button>" 
            + "</li>";
            $("#all").append(liTemp);
            $("#allCkb img").show();
        }
    }
    if (localStorage.length) {
        console.log("have localStorage");
        let jsonArray_4 = getJsons();
        console.log(jsonArray_4 instanceof Array);

        for (let i = 0;i < jsonArray_4.length; i++) {
            if (!jsonArray_4[i]) {
                    jsonArray_4.splice(i,1);
                    i--;
                }
        }

        let newlength = jsonArray_4.length;
        for (let j = 0; j < newlength; j++) {
            let state = jsonArray_4[j].state;
            let itemTxt = jsonArray_4[j].content;
            if (state !== "notchecked") {
                addLi(itemTxt,1);
            }
            else {
                addLi(itemTxt,0);
            }
        }

        checkedThing();
    }

    // 添加新的todo事件
    $("#add").keydown(function (event) {
        // 判断按键是否为enter
        if (event.keyCode === 13) {
            // 判断输入框是否为空
            if ($("#add").val()) {
                let newItem = $("#add").val();
                console.log(newItem);
                addLi(newItem,0);
                liShow();
                $("#add").val('');

                let obj = {"content": newItem,"state": "notchecked"};
                let jsonArray_5 = getJsons();
                if (!jsonArray_5) {
                    console.log("no jsonArray_2");
                    let addarr = [];
                    addarr[addarr.length] = obj;
                    setJsons(addarr);
                }
                else {
                    jsonArray_5[jsonArray_5.length] = obj;
                    // 去除数组中的空项
                    for (let i = 0 ;i < jsonArray_5.length; i++) {
                        if (jsonArray_5[i] === null 
                            || typeof(jsonArray_5[i]) == "undefined"
                            || jsonArray_5[i] === ""
                            ) {
                                jsonArray_5.splice(i,1);
                                i--;
                            }
                    }
                    setJsons(jsonArray_5);
                }
            }
        }
    });

    // 全选事件
    $("#allCkb").click(function () {
        let allList = $("#all li").length;
        let checkboxs = ckbClick().length;
        if (checkboxs !== allList) {
            $("#all :checkbox").prop("checked",true);
        }
        else {
            $("#all :checkbox").prop("checked",false);
        }

        liShow();
        ckbstate();
    });

    // 点击底部Clear completed按钮时，清除被选中的li项
    $("#clear").click(function () {
        let jsonArray_6 = getJsons();
        for (let i = 0; i < ckbparent().length; i++) {
            let ckbnum = ckbparent().index();
            jsonArray_6.splice(ckbnum,1);
            $("#all li").eq(ckbnum).remove();
            i--;
        }

        setJsons(jsonArray_6);
        checkedThing();
    });

    // 为checkbox添加事件代理
    $('#all').delegate('.ckbn', 'click', function () {
        liShow();
        ckbstate();
    });

    // 为鼠标移动到li时显示X按钮事件添加代理事件
    $("#all").delegate('li','mouseover',xShow = function () {
        $(this).children("button").show();
    });

    $("#all").delegate('li','mouseleave', xHide = function () {
        $(this).children("button").hide();
    });

    // 点击X时删除当前li的代理事件
    $("#all").delegate('.clearX','click',function () {
        theIndex = $(this).parent().index();
        $(this).parent().remove();
        console.log(theIndex);
        localStorageRemove(theIndex);
        checkedThing();
    });

    // 为双击label修改文本绑定代理事件
    $("#all").delegate("label","dblclick",function () {
        $(this).next().hide();
        theIndex = $(this).parent().index();
        console.log(theIndex);
        // 移除代理事件
        $("#all").undelegate("li","mouseover",xShow);
        let txt = $(this).text();
        $(this).text("");
        let input = "<input type='text' id='inputlb' class='lbTxt' value='" + txt + "' />";
        $(this).replaceWith(input);
        // 获取焦点
        $("#inputlb").focus();
        // 文本框失去焦点后提交内容，重新变为文本
        $("#inputlb").blur(function () {
            inputReplaceWith(theIndex);
            doneText();
            // 重新设置事件代理
            $("#all").delegate("li","mouseover",xShow);
        });

        $("#inputlb").keydown(function (event) {
            if (event.keyCode === 13) {
                inputReplaceWith(theIndex);
                doneText();
                // 重新设置事件代理
                $("#all").delegate("li","mouseover",xShow);
            }

        });

        return false;
    });

    // 编写button选中状态下li的显示
    $("#Active").click(function () {
        ckbparent().hide();
        notCkbparent().show();
        clickButton = "active";
        $(this).css("border","1px solid #efd5d5");
        $(this).siblings().css("border","none");
    });

    $("#All").click(function () {
        ckbparent().show();
        notCkbparent().show();

        clickButton = "all";
        $(this).css("border","1px solid #efd5d5 ");
        $(this).siblings().css("border","none");
    });

    $("#Completed").click(function () {
        ckbparent().show();
        notCkbparent().hide();

        clickButton = "completed";
        $(this).css("border","1px solid #efd5d5");
        $(this).siblings().css("border","none");
    });
});
