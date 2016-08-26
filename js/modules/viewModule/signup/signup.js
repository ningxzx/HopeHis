/**
 * Created by xiangzx on 15-11-4.
 */
$(function () {
    var arrdate = {};
    //绑定事件
    $("#regist_submit").on('click', registAuth);
    //$("#iflegal").on('click', showblow);
    $(".register_time input").on('blur', showtips);

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

    //显示法人信息
    //function showblow() {
    //    $("#legal").toggle();
    //}

    //提交数据
    function registAuth(events) {
        events.preventDefault();
        var _this = $(events.target);
        $("#regist_submit").attr("disabled", true);
        var cardId = $("#id_card").val();
        if ($('#card_photo')[0].files.length == 0 || $('#e_license_photo')[0].files.length == 0) {
            alert("请上传图片");
            $("#regist_submit").attr("disabled", false);
            return;
        }
        var epInfo = new FormData();
        var province1 = $("#province1").find("option:selected").text();
        var city1 = $("#city1").find("option:selected").text();
        var area1 = $("#area1").find("option:selected").text();
        //var street1 = $("#streat1").val();
        //var address1 = $("#address1").val();

        epInfo.append('corporation_name', sessionStorage.getItem('registName'));
        epInfo.append('corporation_no', cardId);
        epInfo.append('corporation_photo', $('#card_photo')[0].files[0], $('#card_photo').attr('filename'));
        epInfo.append('enterprise_name', $('#enterprise_name').val());
        epInfo.append('admin_id', sessionStorage.getItem('registId'));
        epInfo.append('license_no', $("#e_license_no").val());
        epInfo.append('license_photo', $('#e_license_photo')[0].files[0], $('#e_license_photo').attr('filename'));
        epInfo.append('register_time', arrdate['year'] + '-' + arrdate['mon'] + '-' + arrdate['day']);
        epInfo.append('province', province1);
        epInfo.append('city', city1);
        epInfo.append('area', area1);
        $.ajax({
            url: 'http://192.168.0.220:8081/account/jethis/NewEnterprise',
            type: 'POST',
            headers: {
                'app-key': 'fb98ab9159f51fd1',
                'app-secret': '09f7c8cba635f7616bc131b0d8e25947s',
                'Authorization': '123456-01',
            },
            cache: false,
            data: epInfo,
            processData: false,
            contentType: false
        }).done(function (data) {
            if (data.resultCode== '100') {
                alert("提交成功");
                $("#regist_submit").attr("disabled", false);
                setTimeout(window.location.href = "http://www.jethis.cn", 2000);
            }
            else{
                $("#regist_submit").attr("disabled", false);
            }
        }).fail(function (error) {
            console.log(error);
            $("#regist_submit").attr("disabled", false);
        })
    }
});
