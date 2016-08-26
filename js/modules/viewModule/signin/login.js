$(function () {
    var username = $('#username').val();
    var password = $('#password').val();
    var $loginBtn = $('#loginBtn');
    var randomKey = function (length) {
        //var chars = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ0123456789`=//[];',./~!@#$%^&*()_+|{}:<>?";
        var chars = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ0123456789";

        var s = "";

        for (var i = 0; i < length; i++) {
            s += chars.charAt(Math.ceil(Math.random() * 1000) % chars.length);
        }
        return s;
    };
    var ZeroPadding = {
        left: function (str, length) {
            if (str.length >= length)
                return str;
            else
                return ZeroPadding.left("0" + str, length);
        },
        right: function (str, length) {
            if (str.length >= length)
                return str;
            else
                return ZeroPadding.right(str + "0", length);
        }
    };
    var localDataStorage = {
        setItem: function (key, value) {
            sessionStorage.setItem(key, value);
        },
        getItem: function (key) {
            return sessionStorage.getItem(key);
        },
        setObject: function (key, value) {
            sessionStorage.setItem(key, JSON.stringify(value));
        },
        getObject: function (key) {
            return JSON.parse(sessionStorage.getItem(key));
        },
        removeItem: function (key) {
            return sessionStorage.removeItem(key);
        },
        clearItem: function () {
            sessionStorage.clear();
        }

    };
    $('#username').on('blur', function(){
        var username = $("#username").val().trim();
        if(username!==''&&!/^[A-Za-z0-9]{6,16}$/gi.test(username)) {
            $('#username').css('color', 'red');
            alert("用户名为6-16位的大小写字母、数字组合！");
            return;
        }
        userName();
    });
    $('#username').on('focus', function(e){
        $('#username').css('color','#000')
    });
    $('#password').on('keydown', function (event) {
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if (e.keyCode == '13') {
            loginSystem();
        }
    });


    function userName() {
        var username = $("#username").val().trim();
        if (username.trim() !== '') {
            $.ajax({
                type: "get",
                url: "http://192.168.0.220:8081/account/jethis/ConnEnterpriseInfo",
                headers: {
                    "app-key": "fb98ab9159f51fd1",
                    "app-secret": "09f7c8cba635f7616bc131b0d8e25947s",
                    "authorization": "1"
                },
                data: {account_id: username}
            }).done(function (response) {
                var listData = response.rows;
                $("#hos_sel").val("");
                if (!listData||listData.length == 0) {
                    $("#username").css("color", 'red');
                    alert("用户名不存在");
                } else {
                    $("#username").css("color", '#000');
                    var arrayData = [];
                    for (var i = 0; i < listData.length; i++) {
                        arrayData[i] = {};
                        for (var j = 0; j < listData[i].length; j++) {
                            arrayData[i][response.struct.split(",")[j]] = listData[i][j];
                        }
                    }
                    var hos = arrayData[0];
                    $("#hos_sel").val(hos.enterprise_name)
                        .attr("ep_code", hos["enterprise_input_code"])
                        .attr("ep_id", hos.enterprise_id);
                }

            }).fail(function (response) {
                $("#username").css("color", 'red');
                alert("用户名不存在");
            });
        }
    }

    $("#registerBtn").on('click', function () {
        window.location.href = 'regist.html';
    });
    $(".forget_password").on('click', function () {
        window.location.href = 'resetPwd.html';
    });

    $loginBtn.on('click', function () {
        loginSystem()
    });
    function loginSystem() {
        var username = $('#username').val().trim();
        var password = $('#password').val().trim();
        var ep_id = $("#hos_sel").attr("ep_id").trim();
        if (!username || !ep_id) {
            alert("用户名不能为空");
            return;
        }
        if (!password) {
            alert("密码不能为空");
            return;
        }
        var ep_name = $("#hos_sel").find('option:selected').text();
        //给用户名、密码，加密
        var strMD5Passwd = CryptoJS.MD5(password).toString();
        var strRandomIV = randomKey(16);
        var strData = '192.168.1.220';
        var imei = '000000000000000';
        var key = CryptoJS.enc.Utf8.parse(strMD5Passwd);
        var iv = CryptoJS.enc.Utf8.parse(strRandomIV);
        var strAesEncrypted = CryptoJS.AES.encrypt(strData, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.ZeroPadding
        });
        var strUserName = username;
        var strUserNameLength = ZeroPadding.left(strUserName.length, 3);
        var strDataPacket = strRandomIV + strUserNameLength + strAesEncrypted + strUserName;
        strDataPacket += new Array((4 - (strDataPacket.length % 4)) % 4 + 1).join('=');
        var url = '192.168.1.220';
        strDataPacket = url + '/10' + "/" + imei + "/" + Base64.encode(strDataPacket);
        $.ajax({
            type: "get",
            url: "http://192.168.0.220:8081/account/jethis/login/" + strDataPacket + '/?enterprise_id=' + ep_id,
            headers: {
                'app-key': 'fb98ab9159f51fd1',
                'app-secret': '09f7c8cba635f7616bc131b0d8e25947s'
            }
        }).done(function (response) {
            if (response['resultCode']=='100') {
                sessionStorage.setItem("token", response["token"]);
                sessionStorage.setItem("user_id", response["account_id"]);
                sessionStorage.setItem("user_name", response["user_name"]);
                sessionStorage.setItem("doctor_id", response["doctor_id"]);
                sessionStorage.setItem("doctor_name", response["doctor_name"]);
                sessionStorage.setItem("enterprise_id", ep_id);
                sessionStorage.setItem("enterprise_name", ep_name);
                sessionStorage.setItem("role", response["role"]);
                sessionStorage.setItem("department_id", response["department_id"]||"");
                sessionStorage.setItem("department_name", response["department_name"]||"");
                sessionStorage.setItem("menu_path", response["path"]);
                window.location.href = 'jethis.html';
            } else if(response['resultCode']=='603'){
                alert("用户名、密码错误，请重试！！");
            }
            else{
                alert("登录出错，请重试");
            }
        }).fail(function (response) {
            alert("账户密码错误!");
        })
    }
    $('#username').focus()
})

