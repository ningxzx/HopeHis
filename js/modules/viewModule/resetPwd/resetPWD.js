/**
 * Created by leo007 on 16-7-20.
 */
$(function () {

    var $tool = $("#UserTool");
    var validate = false,
        psdRight = false,
        md = 0,
        timer = null;
    codeImg();

    $tool.find("#subimmt").on("click", subimt);
    $tool.find("#sigIn").on("click", sigIn);
    $tool.find("#cellphone").on('blur', checkPhone);
    $tool.find(".vCodeImg").on('click', codeImg);
    $tool.find("#sendMessage").on('click', sendMessage);
    $tool.find("#messageCode").on('blur', checkMessage);
    $tool.find("#password").on('blur', checkPassword);
    $tool.find("#secondPass").on('blur', checkSecondPass);

    //再次确认密码
    function checkSecondPass() {
        var pass = $tool.find("#password").val();
        var secondPass = $tool.find("#secondPass").val();
        $tool.find(".second_empty").addClass("hid");
        $tool.find(".second_diff").addClass("hid");
        $tool.find(".second").addClass("hid");
        //为空
        if (secondPass == "") {
            $tool.find(".second_empty").removeClass("hid");
        } else if (pass != secondPass) {
            $tool.find(".second_diff").removeClass("hid");
        } else {
            $tool.find(".second").removeClass("hid");
            psdRight = true;
        }
    }

    //检查密码
    function checkPassword() {
        $tool.find(".pass_empty").addClass("hid");
        $tool.find(".pass_rule").addClass("hid");
        $tool.find(".pass").addClass("hid");
        var pass = $tool.find("#password").val();
        if (pass == "") {
            //为空
            $tool.find(".pass_empty").removeClass("hid");
        } else if (pass.length < 6) {
            //长度
            $tool.find(".pass_rule").removeClass("hid");
        } else if (!(pass.match(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/))) {
            //输入规则
            $tool.find(".pass_rule").removeClass("hid");
        } else {
            $tool.find(".pass").removeClass("hid");
        }
    }

    function sigIn(e) {
        window.location.href = 'SignIn.html';
    }

    function subimt(e) {
        var that = this;
        if(validate && psdRight){
            var phone = $("#cellphone").val();
            var pwd = CryptoJS.MD5($("#password").val().trim()).toString();
            $.ajax({
                url: "http://192.168.0.220:8081/jethis/Account/ResettingPwd",
                type: "patch",
                headers: {
                    'app-key': 'fb98ab9159f51fd1',
                    'app-secret': '09f7c8cba635f7616bc131b0d8e25947s',
                    'Authorization': '123456-01',
                    'Content-Type': 'Application/json'
                },
                data: JSON.stringify({"phone_no": phone, "new_pwd": pwd}),
                success: function (data) {
                    if (data.result == "100") {
                        if(confirm("恭喜您注册成功!现在是否跳转至登录页面?")){
                            window.location.href = "SignIn.html";
                        } else {
                            $("input").val("");
                            $("dd span").addClass("hid");
                            clearInterval(timer);
                            $("#sendMessage").val("发送验证码");
                            that.codeImg();
                        }
                    }
                },
                error: function (data) {
                    alert("提交失败请重试! \n" + data);
                }
            })
        } else {
            alert("请先验证短信并确保密码输入正确");
        }
    }


    //检验电话号码
    function checkPhone() {
        var phone = $tool.find("#cellphone").val();
        $tool.find(".phone_success").addClass("hid");
        $tool.find(".phone_empty").addClass("hid");
        $tool.find(".phone_right").addClass("hid");
        if (phone == "") {
            $tool.find(".phone_empty").removeClass("hid");
        } else if (!(phone.match(/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/))) {
            $tool.find(".phone_right").removeClass("hid");
        } else {
            $tool.find(".phone_success").removeClass("hid");
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
        var time = new Date().getTime(),
            that = this;
        md = hex_md5(radom + time),
        $.ajax({
            url: "http://192.168.0.220:8081/system/PicCode/NewCode",
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
                    $tool.find(".vCodeImg").attr("src", "http://192.168.0.220:8081" + data.imgidurl);
                }
            },
            error: function (data) {
                console.log(data);
            }
        })
    }


    //发送短信验证码
    function sendMessage() {
        var codeValue = $tool.find("#vCodeImg").val(),
            phone = $tool.find("#cellphone").val();
        $tool.find(".code_empty").addClass("hid");
        $tool.find(".code_false").addClass("hid");
        $tool.find(".code_send_false").addClass("hid");
        $tool.find(".code_send_success").addClass("hid");
        if (codeValue == "") {
            $tool.find(".code_empty").removeClass("hid");
            return;
        }
        $.ajax({
            type: "post",
            timeout: 30000,
            url: "http://192.168.0.220:8081/jethis/Jethis_User/sendSMS",
            headers: {
                'app-key': 'fb98ab9159f51fd1',
                'app-secret': '09f7c8cba635f7616bc131b0d8e25947s',
                'Authorization': '123456-01',
                'Content-Type': 'Application/json'
            },
            data: JSON.stringify({"md": md, "idcode": codeValue, "phone": phone})
        }).done(function (data) {
            if (data.resultCode == "110") {
                alert('该号码已绑定，请重新选择号码！！')
                $('#cellphone').val('');
                codeImg();
            } else if (data.result == "2") {
                $tool.find(".code_send_false").removeClass("hid");
                codeImg();
            } else if (data.resultCode == "100") {
                var times = 60;
                $tool.find("#sendMessage").attr("disabled", "true");
                timer = setInterval(function () {
                    times--;
                    if (times <= 0) {
                        $tool.find("#sendMessage").val("发送验证码");
                        $tool.find("#sendMessage").removeAttr("disabled");
                        clearInterval(timer);
                    } else {
                        $tool.find("#sendMessage").val(times + "秒后重试");
                    }
                }, 1000);
                $tool.find(".code_send_success").removeClass("hid");
            }
        }).fail(function () {
            $tool.find(".code_send_false").removeClass("hid");
        })
    }


    //验证短信验证码
    function checkMessage() {
        var message = $tool.find("#messageCode").val(),
            phone = $("#cellphone").val();
        $tool.find(".message_false").addClass("hid");
        $tool.find(".check_false").addClass("hid");
        $tool.find(".message_empty").addClass("hid");
        $tool.find(".message_pass").addClass("hid");
        if (message == "") {
            $tool.find(".message_empty").removeClass("hid");
            return;
        }
        $.ajax({
            type: "post",
            url: "http://192.168.0.220:8081/jethis/Jethis_User/commitphone",
            data: JSON.stringify({"phoneidcode": message, "phone": phone}),
            headers: {
                'app-key': 'fb98ab9159f51fd1',
                'Authorization': '123456-01',
                'app-secret': '09f7c8cba635f7616bc131b0d8e25947s',
                'Content-Type': 'Application/json'
            },
            success: function (data) {
                $tool.find(".message_false").addClass("hid");

                if (data.result == "2") {
                    $tool.find(".check_false").removeClass("hid");
                } else if (data.result == "OK") {
                    $tool.find(".message_pass").removeClass("hid");
                    validate = true;
                }
            },
            error: function () {
                $tool.find(".message_false").removeClass("hid");
            }
        });
    }


});