/**
 * Created by insomniahl on 16/5/30.
 */
$(function () {
    var registType, md;
    var connection;
    var isRight = true;
    var arrdate = {}, provinces = [];
    var provinceCode, province, city, cityCode, areaCode, area, street, address, sex, phone, userName, realName, nameCanUse = false;
    var smsResultArr = {
        '010': "图片验证码验证失败",
        '014': "图片验证码失效",
        '011': "短信验证码验证失败",
        '012': "短信验证码缓存失败",
        '013': "短信验证码发送失败",
        '015': "短信验证码失效",
        '100': "操作成功",
        '101': "未知错误",
        '102': "该会员帐号不存在",
        '110': "手机已被绑定",
        '111': "手机号非法",
        '121': "帐号被使用",
        '400': "退费金额大于'收费金额",
        '500': "库存药物数量小于发售数量",
        '610': "帐号使用时间到期",
        '611': "帐号被禁止使用",
    }
    codeImg();
    getProvince();
    //绑定事件
    $("input").on('focus', hideTips);
    $(".vCodeImg").on('click', codeImg);
    $("#vCodeImg").on('keyup', keySendMsg);
    $("#messageCode").on('keyup', keyConfirmMsg);
    $("#cellphone").on('blur', checkPhone);
    $("#realName").on('blur', checkRealName);
    $("#sendMessage").on('click', sendMessage);
    $("#btnPhone").on('click', checkMessage);
    $("#userName").on('blur', checkUserName);
    $("#password").on('blur', checkPassword);
    $("#id_card").on('blur', checkCardId);
    $("#email").on('blur', checkEmail);
    $("#secondPass").on('blur', checkSecondPass);
    $("#btnInfo").on('click', regist);
    $(".province").on('change', getcity);
    $(".province").on('click', checkProvince);
    $(".city").on('change', getArea);
    $(".dd-file-file").on('change', showImage);
    $("input:radio").on('change', showDiv);
    $(".register_time input").on('blur', showtips);

    function hideTips(e){
        var $tips=$(e.target).closest('dd').find('.tips:visible');
        $tips.addClass('hid');
    }
    function keySendMsg(e){
        if(e.keyCode==13){
            if( !$('#sendMessage').is('disabled')) {
                $('#sendMessage').trigger('click');
            }
        }
    }
    function keyConfirmMsg(e){
        if(e.keyCode==13){
                $('#btnPhone').trigger('click');
        }
    }
    //提示日期格式问题
    function showtips(e) {
        var type = $(e.target).attr("typename");
        var value = $(e.target).val();
        if (type == "year") {
            if (value < 1900 || value > 3000 || isNaN(value)) {
                $(".year_type").removeClass("hid");
                arrdate['year'] = '';
                return;
            } else {
                $(".year_type").addClass("hid");
                arrdate['year'] = value;
            }
        }
        if (type == "mon") {
            if (value < 1 || value > 12 || isNaN(value)) {
                $(".month_type").removeClass("hid");
                arrdate['mon'] = '';
                return;
            } else {
                $(".month_type").addClass("hid");
                arrdate['mon'] = value
            }
        }
        if (type == "day") {
            if (value < 1 || value > 31 || isNaN(value)) {
                $(".day_type").removeClass("hid");
                arrdate['day'] = '';
                return;
            } else {
                $(".day_type").addClass("hid");
                arrdate['day'] = value
            }
        }
    }

    //获取图片验证码
    function codeImg() {
        //获取随机数
        var charactors = "0123456789";
        var radom = '', i;
        for (var j = 0; j < 4; j++) {
            i = parseInt(10 * Math.random());
            radom = radom + charactors.charAt(i);
        }
        if (radom == "") {
            return;
        }
        //时间戳
        var time = new Date().getTime();
        md = hex_md5(radom + time), that = this;
        $.ajax({
            url: "http://114.55.85.57:8081/system/PicCode/NewCode",
            type: "post",
            headers: {
                'app-key': 'fb98ab9159f51fd1',
                'app-secret': '09f7c8cba635f7616bc131b0d8e25947s',
                'Authorization': '123456-01',
                'Content-Type': 'Application/json'
            },
            data: JSON.stringify({"md": md}),
            success: function (data) {
                if (data.resultCode == "100") {
                    $(".vCodeImg").attr("src", "http://114.55.85.57:8081" + data.imgidurl);
                }
            },
            error: function (data) {
                console.log(data);
            }
        })
    }

    //检验电话号码
    function checkPhone() {
        var phone = $("#cellphone").val().trim();
        $(".phone_success").addClass("hid");
        $(".phone_empty").addClass("hid");
        $(".phone_right").addClass("hid");
        $(".phone_duplicate").addClass("hid");
        if (phone == "") {
            $(".phone_empty").removeClass("hid");
        } else if (phone.match(/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/)) {
            $.ajax({
                url: "http://114.55.85.57:8081/system/BindPhone/phoneNo/10",
                type: "get",
                data:{phoneNo:phone},
                headers: {
                    'app-key': 'fb98ab9159f51fd1',
                    'app-secret': '09f7c8cba635f7616bc131b0d8e25947s',
                    'Authorization': '123456-01',
                    'Content-Type': 'Application/json'
                },
                success: function (data) {
                    if (data.resultCode == "100") {
                        $(".phone_success").removeClass("hid");
                    }
                    else if(data.resultCode == "110"){
                        $(".phone_duplicate").removeClass("hid");
                    }
                    else{
                        $(".phone_right").removeClass("hid");
                    }
                },
                error: function (data) {
                    console.log(data);
                }
            })
        } else {
            $(".phone_right").removeClass("hid");
        }
    }

    //发送短信验证码
    function sendMessage() {
        var codeValue = $("#vCodeImg").val(),
            $btn=$("#sendMessage")
        phone = $("#cellphone").val();
        $(".code_empty").addClass("hid");
        $(".code_false").addClass("hid");
        $(".code_send_false").addClass("hid");
        $(".code_send_success").addClass("hid");
        if (codeValue == "") {
            $(".code_empty").removeClass("hid");
            return;
        }
        $('#sendMessage').attr('disabled',true);
        $.ajax({
            type: "post",
            timeout: 30000,
            url: "http://114.55.85.57:8081/system/phone/messageCode",
            headers: {
                'app-key': 'fb98ab9159f51fd1',
                'app-secret': '09f7c8cba635f7616bc131b0d8e25947s',
                'Authorization': '123456-01',
                'Content-Type': 'Application/json'
            },
            data: JSON.stringify({"md": md, "idcode": codeValue, "phone": phone})
        }).done(function (data) {
            connection = true;
            if (data.resultCode !== "100") {
                $('#sendMessage').attr('disabled',false);
                $(".code_error").text(smsResultArr[data.resultCode]).removeClass("hid");
                codeImg();
            } else if (data.resultCode == "100") {
                var times = 60;
                var timer = null;
                $btn.attr("disabled", "true");
                $btn.html(60 + "秒后重试");
                timer = setInterval(function () {
                    times--;
                    if (times <= 0) {
                        $btn.html("发送验证码");
                        $btn.removeAttr("disabled");
                        clearInterval(timer);
                    } else {
                        $btn.html(times + "秒后重试");
                    }
                }, 1000);
                $(".code_send_success").removeClass("hid");
                $("#btnPhone").removeAttr("disabled");
                $("#btnPhone").removeClass("dis");
                $("#messageCode").focus();
            } else {
                $('#sendMessage').attr('disabled',false);
                alert("发送短信出错!")
                return;
            }
        }).fail(function () {
            $('#sendMessage').attr('disabled',false);
            alert("发送短信出错!")
            $(".code_send_false").removeClass("hid");
        })

    }

    //验证短信验证码
    function checkMessage() {
        var message = $("#messageCode").val();
        phone = $("#cellphone").val();
        $(".message_false").addClass("hid");
        $(".check_false").addClass("hid");
        $(".message_empty").addClass("hid");
        if (message == "") {
            $(".message_empty").removeClass("hid");
            return;
        }
        $.ajax({
            type: "post",
            url: "http://114.55.85.57:8081/system/phone/confirmMsgCode",
            data: JSON.stringify({"phoneidcode": message, "phone": phone}),
            headers: {
                'app-key': 'fb98ab9159f51fd1',
                'Authorization': '123456-01',
                'app-secret': '09f7c8cba635f7616bc131b0d8e25947s',
                'Content-Type': 'Application/json'
            },
            success: function (data) {
                $(".message_false").addClass("hid");
                if (data.resultCode == "100") {
                    gotoInfo();
                    codeImg();
                } else  {
                    $(".message_false").text('短信验证码验证失败！').removeClass("hid");
                }
            },
            error: function () {
                $(".message_false").text('发生未知错误！').removeClass("hid");
            }
        });
    }

    //切换页面
    function gotoInfo() {
        phone = $("#cellphone").val();
        sessionStorage.setItem("cellphone", phone);
        //菜单切换
        $("#phone").find(".action_step").removeClass("action_step");
        $("#phone span").last().removeClass("action_menu");
        $("#info").find(".step").addClass("action_step");
        $("#info span").last().addClass("action_menu");
        //内容切换
        $("#UserPhone").addClass("hid");
        $("#UserInfo").removeClass("hid");
    }

    //获取省份
    function getProvince() {
        var opt = "<option value=\"0\">请选择省份</option>";
        $.ajax({
            type: "get",
            url: "http://114.55.85.57:8081/jethis/registeration/getdictprovincebycountry",
            success: function (data) {
                for (var i = 0; i < data.rows.length; i++) {
                    opt += "<option value=\"" + data.rows[i][1] + "\">" + data.rows[i][2] + "</option>";
                }
                provinces = data.rows;
                $("#province").html(opt);
                $("#province1").html(opt);
            },
            error: function (error) {
                console.log("获取省份数据失败");
            }
        });
    }

    function checkProvince() {
        if (!provinces.length) {
            getProvince()
        }
    }

    //获取城市
    function getcity(e) {
        var opt = "<option value=\"0\">请选择城市</option>";
        var code = $(e.target).val();
        var next = $(e.target).next();
        var nexts = next.next();
        next.html("<option value=\"0\">请选择城市</option>");
        nexts.html("<option value=\"0\">请选择区县</option>");
        $.ajax({
            type: "get",
            url: "http://114.55.85.57:8081/jethis/registeration/getdictcitybyprovince?province_code=" + code,
            success: function (data) {
                for (var i = 0; i < data.rows.length; i++) {
                    opt += "<option value=" + data.rows[i][1] + ">" + data.rows[i][2] + "</option>";
                }
                next.html(opt);
            },
            error: function (error) {
                console.log("获取城市数据失败");
            }
        });
    }

    //获取区县
    function getArea(e) {
        var opt = "<option value=\"0\">请选择区县</option>";
        var code = $(e.target).val();
        var next = $(e.target).next();
        next.html("<option value=\"0\">请选择区县</option>");
        $.ajax({
            type: "get",
            url: "http://114.55.85.57:8081/jethis/registeration/getdictdistrictbycity?city_code=" + code,
            success: function (data) {
                for (var i = 0; i < data.rows.length; i++) {
                    opt += "<option value=" + data.rows[i][1] + ">" + data.rows[i][2] + "</option>";
                }
                next.html(opt);
            },
            error: function (error) {
                console.log("获取区县数据失败");
            }
        });
    }

    //检查姓名
    function checkRealName() {
        var name = $("#realName").val();
        $(".name_empty").addClass("hid");
        $(".name_china").addClass("hid");
        if (!name) {
            $(".name_empty").removeClass("hid");
        } else if (!name.match(/^[\u4e00-\u9fa5]+$/)) {
            $(".name_china").removeClass("hid");
        }
    }

    //检查用户名是否存在
    function checkUserName() {
        var user_name = $("#userName").val();
        $(".user_empty").addClass("hid");
        $(".user_exist").addClass("hid");
        $(".user_length").addClass("hid");
        $(".user_rule").addClass("hid");
        $(".user").addClass("hid");
        //为空
        if (user_name.length < 6 || user_name.length > 16) {
            $(".user_rule").removeClass("hid");
            isRight = false;
            return;
        }
        else if (!(user_name.match(/^(?!^\d+$)[A-Za-z0-9]{6,16}$/))) {
            //用户名为数字和字母的组合，6~16位
            $(".user_rule").removeClass("hid");
            isRight = false;
            return;
        } else {
            //是否存在
            $.ajax({
                type: "post",
                headers: {
                    'app-key': 'fb98ab9159f51fd1',
                    'app-secret': '09f7c8cba635f7616bc131b0d8e25947s',
                    'Authorization': '123456-01',
                    'Content-Type': 'application/json'
                },
                url: "http://114.55.85.57:8081/jethis/Jethis_User/checkaccount",
                data: JSON.stringify({
                    "account_id": user_name
                }),
                success: function (data) {
                    if (data.result == "av") {
                        $(".user").removeClass("hid");
                        nameCanUse = true;
                        isRight = true;
                    } else {
                        $(".user_exist").removeClass("hid");
                        nameCanUse = false;
                    }
                },
                error: function () {
                    $(".user_exist").removeClass("hid");
                    nameCanUse = false;
                }
            })
        }
    }

    //检查密码
    function checkPassword() {
        $(".pass_empty").addClass("hid");
        $(".pass_rule").addClass("hid");
        $(".pass").addClass("hid");
        var pass = $("#password").val();
        if (pass == "") {
            //为空
            $(".pass_empty").removeClass("hid");
        } else if (pass.length < 6) {
            //长度
            $(".pass_rule").removeClass("hid");
        } else if (!(pass.match(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/))) {
            //输入规则
            $(".pass_rule").removeClass("hid");
        } else {
            $(".pass").removeClass("hid");
        }
    }

    //再次确认密码
    function checkSecondPass() {
        var pass = $("#password").val();
        var secondPass = $("#secondPass").val();
        $(".second_empty").addClass("hid");
        $(".second_diff").addClass("hid");
        $(".second").addClass("hid");
        //为空
        if (secondPass == "") {
            $(".second_empty").removeClass("hid");
        } else if (pass != secondPass) {
            $(".second_diff").removeClass("hid");
        } else {
            $(".second").removeClass("hid");
        }
    }

    //验证邮箱
    function checkEmail() {
        var mail = $("#email").val();
        $(".emil_empty").addClass("hid");
        $(".emil_rule").addClass("hid");
        $(".mail").addClass("hid");
        if (mail == "") {
            $(".emil_empty").removeClass("hid");
        } else if (!(mail.match(/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/))) {
            $(".emil_rule").removeClass("hid");
        } else {
            $(".mail").removeClass("hid");
        }
    }

    //检查身份证号
    function checkCardId(e) {
        var cardId = $(e.target).val();
        if (cardId == "") {
            $(".cardId_empty").removeClass("hid");
            return;
        } else {
            $(".cardId_empty").addClass("hid");
        }
        if (!(cardId.match(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/))) {
            $(".cardId_rule").removeClass("hid");
        } else {
            $(".cardId_rule").addClass("hid");
            $(".cardId").removeClass("hid");
        }
    }

    //显示图片
    function showImage(event) {
        var file = event.target.files[0], url = null, name = file.name;
        if (window.createObjectURL != undefined) { // basic
            url = window.createObjectURL(file);
        } else if (window.URL != undefined) { // mozilla(firefox)
            url = window.URL.createObjectURL(file);
        } else if (window.webkitURL != undefined) { // webkit or chrome
            url = window.webkitURL.createObjectURL(file);
        }
        $(event.target).parent().parent().prev().find(".dd-img").attr("src", url);
        $(event.target).attr("filename", name);
        var id = $(event.target).parent().parent().prev().find(".dd-img").attr("id");
    }

    function showDiv(event) {
        var _this = $(event.target);
        var id = $(event.target).attr("value");
        if (id == "2") {
            $("#doctor").addClass("hid");
            $("#company").removeClass("hid");
            registType = "company";
        } else if (id == "1") {
            $("#company").addClass("hid");
            $("#doctor").removeClass("hid");
            registType = "doctor";
        }
        $("#submitBtn").removeClass("hid");
    }

    //注册
    function regist(events) {
        events.preventDefault();
        provinceCode = $("#province").val();
        province = provinceCode=='0'?'': $("#province").find("option:selected").text();
        cityCode = $("#city").val();
        city = cityCode=='0'?'': $("#city").find("option:selected").text();
        areaCode = $("#area").val();
        area = areaCode=='0'?'': $("#area").find("option:selected").text();
        realName = $("#realName").val().trim();
        sex = $("#sex").val().trim();
        userName = $("#userName").val().trim();

        //加密
        var strMD5Passwd = CryptoJS.MD5($("#password").val().trim()).toString();
        var mail = $("#email").val();
        var invitation = $("#invitation").val();
        street = $("#streat").val();
        address = $("#address").val();
        phone = sessionStorage.getItem("cellphone");
        if (!nameCanUse) {
            alert("用户名已存在，请重新输入用户名");
            return;
        }
        if (isRight) {
            if (realName != "" && userName != "" && strMD5Passwd != "" && mail != "") {
                $.ajax({
                    type: "post",
                    headers: {
                        'app-key': 'fb98ab9159f51fd1',
                        'Authorization': '123456-01',
                        'app-secret': '09f7c8cba635f7616bc131b0d8e25947s',
                        'Content-Type': 'application/json'
                    },
                    url: "http://114.55.85.57:8081/account/AccountInfo",
                    data: JSON.stringify({
                        "user_name": realName,
                        "user_sex": sex,
                        "account_id": userName,
                        "login_pwd": strMD5Passwd,
                        "user_email": mail,
                        "invitation_code": invitation,
                        "user_phone": phone,
                        "user_province": province,
                        "user_city": city,
                        "user_area": area,
                        "user_streat": street,
                        "user_addr": address
                    }),
                    success: function (data) {
                        if (data.resultCode == "100") {
                            //菜单切换
                            $("#info").find(".action_step").removeClass("action_step");
                            $("#info span").last().removeClass("action_menu");
                            $("#registFinish").find(".step").addClass("action_step");
                            $("#registFinish span").last().addClass("action_menu");
                            //内容切换
                            $("#UserInfo").addClass("hid");
                            $("#finish").removeClass("hid");
                            sessionStorage.setItem('registId', userName);
                            sessionStorage.setItem('registName', realName);
                            //重置
                            resetInput();
                        } else {
                            $(".message_false").text('短信验证失败').removeClass('hid');
                        }
                    },
                    error: function (error) {
                        console.log(error);
                    }
                });
                $(".completion").addClass("hid");
            } else {
                $(".completion").removeClass("hid");
            }
        }
    }

    function resetInput() {
        $("#province").val("");
        $("#city").val("");
        $("#area").val("");
        $("#realName").val("");
        $("#sex").val("");
        $("#userName").val("");
        $("#password").val("");
        $("#email").val("");
        $("#invitation").val("");
        $("#streat").val("");
        $("#address").val("");
        sessionStorage.removeItem("cellphone");
    }
});
