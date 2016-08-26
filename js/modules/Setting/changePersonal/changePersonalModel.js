define(['jquery', "backbone", 'jctLibs'], function ($, Backbone, jctLibs) {
    var personalModel = Backbone.Model.extend({
        //获取用户所有基本信息
        getInfos: function () {
            var that=this;
            $.ajax({
                type: "get",
                url: "http://192.168.0.220:8081/jethis/user/getuserinfo"
            }).done(function (res) {
                that.trigger("personInfo", res);
            }).fail(function (err, response) {
                var responseText = $.parseJSON(err.responseText);
                result.errorNo = responseText.code;
                result.responseData = responseText.message;
                that.trigger("personInfo", result);

            })
        },
        //更改用户信息
        changeInfos: function (datas) {
            var that=this;
            $.ajax({
                type: "patch",
                url: "http://192.168.0.220:8081/jethis/user/modifyinfo",
                data: JSON.stringify(datas)
            }).done(function (res) {
                that.trigger("changeInfo", res);
            }).fail(function (err, response) {
                var responseText = $.parseJSON(err.responseText);
                result.errorNo = responseText.code;
                result.responseData = responseText.message;
                that.trigger("changeInfo", result);

            })
        },
        //更改密码
        changePwd:function(mes){
            var that=this;
            $.ajax({
                type: "post",
                url: "http://192.168.0.220:8081/jethis/user/changepass",
                data: JSON.stringify({
                    old_passwd:mes[0],
                    new_passwd:mes[1]
                })
            }).done(function (res) {
                debugger
                that.trigger("changepwd", res);

            }).fail(function (err, response) {
                var responseText = $.parseJSON(err.responseText);
                result.errorNo = responseText.code;
                result.responseData = responseText.message;
                that.trigger("changepwd", result);

            })
        },
        //获取短信验证码
        getmessage:function(mes){
            var that=this;
            $.ajax({
                type: "post",
                url: "http://192.168.0.220:8081/jethis/BindNewPhone/sendSMS/10",
                data:JSON.stringify({"phoneNo":mes})
            }).done(function (res) {
                that.trigger("getmes", res);
            }).fail(function (err, response) {
                var responseText = $.parseJSON(err.responseText);
                result.errorNo = responseText.code;
                result.responseData = responseText.message;
                that.trigger("getmes", result);
            })
        },
        //更改绑定手机
        changePhone:function(mes){
            var that=this;
            $.ajax({
                type: "get",
                url: "http://192.168.0.220:8081/jethis/user/changephone/10?phone="+mes[1]+"&phonecode="+mes[0],
            }).done(function (res) {
                that.trigger("changephone", res);
            }).fail(function (err, response) {
                var responseText = $.parseJSON(err.responseText);
                result.errorNo = responseText.code;
                result.responseData = responseText.message;
                that.trigger("changephone", result);
            })
        }
    });
    return personalModel;

});
