define(['txt!../../Regist/register/register.html',
        'txt!../../Regist/register/addPatient.html',
        '../../Common/patientModel',
        '../../Common/patientCollection',
        '../../Regist/register/registerModel',
        'jctLibs', 'bootstrapTable', 'handlebars', 'backbone', 'amazeui', 'printThis'],
    function (Template, addPatient, patientModel, patientCollection, registModel, jctLibs, bootstrapTable, Handlebars, backbone) {
        var view = Backbone.View.extend({
            initialize: function () {
                this.patientModel = new patientModel();
                this.rgtModel = new registModel();

                //监听model手动事件
                this.listenTo(this.rgtModel, 'regist_result', this.registResult);
                this.listenTo(this.patientModel, 'searchById', this.showPatientInfoById);
                this.listenTo(this.patientModel, 'searchByName', this.showPatientInfoByName);
                this.listenTo(this.patientModel, 'addPatientResult', this.addPatientResult);
                this.listenTo(this.rgtModel, 'getDoctorResult', this.getDoctorResult);
            },

            render: function () {
                $(this.el).html(Template);
                //重写查询条件
                $(this.el).find("select").chosen({
                    width: "100%",
                    no_results_text: '没有找到匹配的项！',
                    disable_search_threshold: 120
                });
                $(this.el).find("#birth").datepicker();
                $(this.el).find("#registDate").datepicker({
                    //设置不能选今天之前的日期
                    onRender: function (date, viewMode) {
                        var nowTemp = new Date();
                        var nowDay = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0).valueOf();
                        var nowMoth = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), 1, 0, 0, 0, 0).valueOf();
                        var nowYear = new Date(nowTemp.getFullYear(), 0, 1, 0, 0, 0, 0).valueOf();
                        // 默认 days 视图，与当前日期比较
                        var viewDate = nowDay;

                        switch (viewMode) {
                            // moths 视图，与当前月份比较
                            case 1:
                                viewDate = nowMoth;
                                break;
                            // years 视图，与当前年份比较
                            case 2:
                                viewDate = nowYear;
                                break;
                        }

                        return date.valueOf() < viewDate ? 'am-disabled' : '';
                    }
                });
                $(this.el).find("#patient_info").append(addPatient);
                $(this.el).find("select").chosen({width: "100%", disable_search_threshold: 100});
                $(this.el).find("#a_birth").datepicker();
                //传入日期（格式为yyyy-MM-dd）
                var now = new Date();
                var date = now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate();
                this.getDoctor(date);
                this.getProvince();
                return this;
            },

            events: {
                "click #registionFee": "RegistionFee",  //挂号并收费按钮
                "click #doctor_list li": "getDoctorInfo",  //点击医生头像
                "click #search_id": "searchId",         //查找患者ID
                "change #select_doctor": "searchDoctor", //查询医生
                "change #select_dept": "searchDept", //查询科室
                "click #a_regist": "aRegist",        //添加页面的注册按钮
                "changeDate.datepicker.amui #registDate": "RegistDate",    //挂号日期改变
                "click #reset": "resetEvent",        //重置事件
                "click #refresh": "refreshDoctor",      //点击刷新按钮
                "change #select_condition": "resetKeyWord",      //重置查询关键字
                "keyup #money": "changeFee",               //输入金额改变找零
                "keyup #keyword": "keySearchPat",               //输入金额改变找零
                "change #province": "getcity",//省份改变获取城市
                "change #city": "getArea",//城市改变获取区县
                "keydown #money": "moneyKey",//打印
                "change #a_card_id": "checkCardId",
                //"keydown body":"documentKey"
            },
            checkCardId: function () {
                var cardId = $("#a_card_id").val(), len = cardId.length;
                if (!(cardId.match(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/))) {
                    $("#tips").addClass("am-alert-warning").removeClass("am-alert-success hid").find("p").text("身份证号有误,请重新填写!");
                }
                else {
                    $("#tips").addClass("am-alert-warning");
                    var dateStr = "", year = "", month = "", day = "";
                    if (len == 15) {
                        year = '19' + cardId.slice(6, 8),
                            month = cardId.slice(8, 10),
                            day = cardId.slice(10, 12);
                        dateStr = year + '-' + month + '-' + day;
                    }
                    else {
                        year = cardId.slice(6, 10),
                            month = cardId.slice(10, 12),
                            day = cardId.slice(12, 14);
                        dateStr = year + '-' + month + '-' + day;
                    }
                    $('#a_birth').datepicker('setValue', new Date(dateStr))
                }
            },
            //打印
            moneyKey: function (e) {
                var $doctorImg = $('li.on_doctor div.b').find('img');
                var deptId = $doctorImg.attr('deptId');
                var deptName = $doctorImg.attr('deptName');
                if (e.keyCode == 13) {
                    var id = $(this.el).find("#id").val();
                    var fee = $(this.el).find("#change").text();
                    var money = $(this.el).find("#money").val();
                    var charges = $(this.el).find("#cost").text();
                    var enter_id = sessionStorage.getItem("enterprise_id");
                    var acc_id = $doctorImg.attr("account");
                    if (fee < 0) {
                        $(this.el).find("#money").focus();
                        return false;
                    } else if (money == "") {
                        $(this.el).find("#money").focus();

                        return false;
                    } else if (isNaN(money)) {
                        $(this.el).find("#money").focus();

                        return false;
                    } else {
                        var doc_id = $doctorImg.attr("alt");
                        this.rgtModel.regist(enter_id, id, doc_id, acc_id, deptId, deptName, charges);
                        $("#confirmFee").modal('close');
                    }
                }
            },
            //重置事件
            resetEvent: function () {
                $("#keyword").val("");
                $("#doctor_name").val("");
                $("#registDate").val("");
                //sessionStorage.clear();
                $("form")[0].reset();
                var lis = $("#doctor_list").children();
                for (var i = 0; i < lis.length; i++) {
                    $(lis[i]).find('div').removeClass("b");
                }
            },

            //重置表单
            //formReset: function () {
            //    $("form")[0].reset();
            //},

            //重置查询关键字
            resetKeyWord: function () {
                var condition = $('#select_condition').val();
                $('#search_pat_wrapper span').html(condition == 'id' ? '患者ID' : '患者姓名')
                $("#keyword").val("").focus();
            },

            //获取省份
            getProvince: function () {
                var opt = "<option value=\"0\">请选择省份</option>";
                $.ajax({
                    type: "get",
                    url: "http://114.55.85.57:8081/jethis/registeration/getdictprovincebycountry",
                    success: function (data) {
                        for (var i = 0; i < data.rows.length; i++) {
                            opt += "<option value=\"" + data.rows[i][1] + "\">" + data.rows[i][2] + "</option>";
                        }
                        //provinces = data.rows;
                        $("#province").html(opt);
                        $("#province").trigger('chosen:updated')
                    },
                    error: function (error) {
                        console.log("获取省份数据失败");
                    }
                });
            },

            //获取城市
            getcity: function (e) {
                var opt = "<option value=\"0\">请选择城市</option>";
                var code = $(e.target).val();
                var next = $("#city");
                next.html("<option value=\"0\">请选择城市</option>");
                $.ajax({
                    type: "get",
                    url: "http://114.55.85.57:8081/jethis/registeration/getdictcitybyprovince?province_code=" + code,
                    success: function (data) {
                        for (var i = 0; i < data.rows.length; i++) {
                            opt += "<option value=" + data.rows[i][1] + ">" + data.rows[i][2] + "</option>";
                        }
                        next.html(opt);
                        next.trigger('chosen:updated')
                    },
                    error: function (error) {
                        console.log("获取城市数据失败");
                    }
                });
            },

            //获取区县
            getArea: function (e) {
                var opt = "<option value=\"0\">请选择区县</option>";
                var code = $(e.target).val();
                var next = $("#area");
                next.html("<option value=\"0\">请选择区县</option>");
                $.ajax({
                    type: "get",
                    url: "http://114.55.85.57:8081/jethis/registeration/getdictdistrictbycity?city_code=" + code,
                    success: function (data) {
                        for (var i = 0; i < data.rows.length; i++) {
                            opt += "<option value=" + data.rows[i][1] + ">" + data.rows[i][2] + "</option>";
                        }
                        next.html(opt);
                        next.trigger('chosen:updated')
                    },
                    error: function (error) {
                        console.log("获取区县数据失败");
                    }
                });
            },
            keySearchPat: function (e) {
                if (e.keyCode == 13) {
                    this.searchId();
                }
                return false;
            },
            //挂号并收费按钮
            RegistionFee: function () {
                var that = this;
                $("#regist_success").addClass("hid");
                var $doctorImg = $('li.on_doctor div.b').find('img');
                var name = $(this.el).find("#name").val();
                if (name == "") {
                    $(this.el).find("#confirm_hd").text("提示信息");
                    $(this.el).find("#confirm_bd").html("请先提取患者信息");
                    return;
                } else if ($doctorImg.length == 0) {
                    $(this.el).find("#confirm_hd").text("提示信息");
                    $(this.el).find("#confirm_bd").html("请选择挂号医生");
                    return;
                } else {
                    var cardId = $(this.el).find("#cardId").val();
                    var id = $(this.el).find("#id").val();
                    var age = $(this.el).find("#age").val();
                    var gender = {'M': '男', "F": "女"}[$(this.el).find("#gender").val()];
                    var birth = $(this.el).find("#birth").val();
                    var phone = $(this.el).find("#phone").val();
                    var address = $(this.el).find("#address").val();
                    var dept = $doctorImg.attr('deptName');
                    var name = $doctorImg.attr('name');
                    var userName = sessionStorage.getItem('user_name');
                    var fee = $doctorImg.attr('fee');
                    $(this.el).find("#confirm_hd").text("请核对挂号信息并收费");
                    $(this.el).find("#confirm_bd").html(
                        "<ul class=\"am-list am-list-static am-list-striped\">" +
                        "<li>姓名：" + name + "</li>" +
                        "<li>身份证号：" + cardId + "</li>" +
                        "<li>性别：" + gender + "</li>" +
                        "<li>挂号科室：" + dept + "</li>" +
                        "<li>医生：" + name + "</li>" +
                        "<li>挂号员：" + userName + "</li>" +
                        "<li>挂号费：" + fee + "元</li>" +
                        "</ul>"
                    );
                    $(this.el).find("#printArea").html("<ul class=\"am-list am-list-static am-list-striped\">" +
                        "<li>姓名：" + name + "</li>" +
                        "<li>身份证号：" + cardId + "</li>" +
                        "<li>性别：" + gender + "</li>" +
                        "<li>挂号科室：" + dept + "</li>" +
                        "<li>医生：" + name + "</li>" +
                        "<li>挂号员：" + userName + "</li>" +
                        "<li>挂号费：" + fee + "元</li>" +
                        "</ul>")
                }

                //确定按钮
                $("#confirm").off("click").on('click', function () {
                    var name = $(that.el).find("#name").val();
                    var $doctorImg = $('li.on_doctor div.b').find('img');
                    var deptId = $doctorImg.attr('deptId');
                    var deptName = $doctorImg.attr('deptName');
                    if (name == "") {
                        $("#registConfirm").modal('close');
                    } else {
                        $("#registConfirm").modal('close');
                        $("#confirmFee").modal('open');
                        $(that.el).find("#cost").text(fee);
                        $(that.el).find("#money").val(fee);
                        $(that.el).find("#change").text(0);
                        $(that.el).find("#fee_tips").text("");
                        //off事件可以阻止默认窗口关闭事件
                        $("#getFee").off("click").on("click", function () {
                            var id = $(that.el).find("#id").val();
                            var fee = $(that.el).find("#change").text();
                            var money = $(that.el).find("#money").val();
                            var charges = $(that.el).find("#cost").text();
                            var enter_id = sessionStorage.getItem("enterprise_id");
                            var acc_id = $doctorImg.attr("account");
                            if (fee < 0) {
                                $(that.el).find("#money").focus();
                                return false;
                            } else if (money == "") {
                                $(that.el).find("#money").focus();

                                return false;
                            } else if (isNaN(money)) {
                                $(that.el).find("#money").focus();

                                return false;
                            } else {
                                var doc_id = $doctorImg.attr("alt");
                                that.rgtModel.regist(enter_id, id, doc_id, acc_id, deptId, deptName, charges);
                                $("#confirmFee").modal('close');
                            }
                        });
                    }
                });
            },

            //应找金额
            changeFee: function () {
                var money = $(this.el).find("#money").val();
                var cost = $(this.el).find("#cost").text();
                var fee = parseFloat(money) - parseFloat(cost);
                $(this.el).find("#change").text(fee);
                if (parseFloat(fee) < 0) {
                    $(this.el).find("#fee_tips").text("提示：应找金额不能为负值");
                } else if (money == "") {
                    $(this.el).find("#fee_tips").text("提示：实收金额不能为空值");
                } else if (isNaN(money)) {
                    $(this.el).find("#fee_tips").text("提示:只能输入数字");
                } else {
                    $(this.el).find("#fee_tips").text("");
                }
            },

            //挂号处理
            registResult: function (result) {
                if (result.errorNo != 0) {
                    $("#regist_success").removeClass("hid am-alert-success").find("p").text(result.msg);
                } else {
                    this.resetEvent();
                    $("#printArea").printThis({
                        importCSS: false
                    });
                    $("#regist_success").removeClass("hid am-alert-danger").find("p").text(result.msg);
                }
                setTimeout(function () {
                    $("#regist_success").addClass('hid')
                },200)
            },

            //获取医生信息
            getDoctorInfo: function (event) {
                var lis = $("#doctor_list").children();
                for (var i = 0; i < lis.length; i++) {
                    $(lis[i]).find('div').removeClass("b");
                }
                var $item = $(event.target).closest(".on_doctor>div");
                $item.addClass("b");
            },

            //查询是否存在患者
            searchId: function () {
                var that = this;
                $("#regist_tip").addClass("hid");
                $(this.el).find("#names").addClass("hid");
                var select_condition = $("#select_condition").val();
                var $keyword = $("#keyword").val().trim();
                var enterprise_id = sessionStorage.getItem("enterprise_id");
                if ($keyword == "") {
                    alert('请输入查询关键字');
                    $("#keyword").focus();
                    return;
                }
                if (select_condition == "id") {
                    //发送ID查询
                    that.patientModel.searchPatientById("", $keyword);
                } else if (select_condition == "name") {
                    //发送NAME查询
                    that.patientModel.searchPatientByName("", $keyword);
                }
            },

            //通过ID显示患者信息
            showPatientInfoById: function (result) {
                if (result.errorNo == "0") {
                    var data = result.obj;
                    $("#id").val(data.patient_id);
                    $("#name").val(data.patient_name);
                    $("#cardId").val(data.card_id);
                    $("#birth").val(data.patient_birth);
                    $("#gender").val(data.patient_sex).trigger('chosen:updated');
                    var now = new Date();
                    var age = now.getFullYear() - data.patient_birth.substring(0, 4);
                    $("#age").val(age);
                    $("#address").val(data.province + "-" + data.city + "-" + data.area + "-" + data.addr);
                    $("#phone").val(data.patient_phone);
                    sessionStorage.removeItem("doc_id");
                    this.refreshDoctor();
                } else if (result.errorNo == "-2") {
                    //切换至注册页面
                    //TODO:提示信息错误(还未理清暂停修改)
                    $("#rgt").tabs('open', 1);
                    $("#tips").removeClass("hid").find("p").text("无患者信息，请注册后再进行挂号");
                } else {
                    $("form")[0].reset();
                    alert("查询失败，请重新确认患者编号");
                }
            },

            //通过姓名显示患者信息
            showPatientInfoByName: function (result) {
                var that = this;
                if (result.errorNo == 0 && result.obj.length !== 0) {
                    var data = result.obj;
                    if (data == "") {
                        return;
                    } else if (data.length == 1) {
                        that.showPatInfo(data[0]);
                    } else {
                        $("#names").removeClass("hid");
                        $("#patient_names").bootstrapTable({
                            data: data,
                            onClickRow: function (row) {
                                that.showPatInfo(row);
                            },
                            formatShowingRows: function () {
                            }
                        });
                    }
                    //this.refreshDoctor();
                } else {
                    $("form")[0].reset();
                    $("#names").addClass("hid");
                    $("#regist_tip").removeClass("hid").find("p").text("查询失败!");
                }
            },

            showPatInfo: function (row) {
                $("#id").val(row.patient_id);
                $("#name").val(row.patient_name);
                $("#cardId").val(row.card_id);
                $("#birth").val(row.patient_birth);
                $("#gender").val(row.patient_sex).trigger('chosen:updated');
                var now = new Date();
                var age = row.patient_birth?(now.getFullYear() - row.patient_birth.substring(0, 4)):"";
                $("#age").val(age);
                $("#address").val(row.addr);
                $("#phone").val(row.patient_phone);
                $("#names").addClass("hid");
                sessionStorage.removeItem("doc_id");
            },

            //将医生列表加载到页面
            getDoctor: function (date) {
                //默认查询当日上班的医生
                this.rgtModel.getDoctor(date);
            },

            //获取医生列表结果
            getDoctorResult: function (result) {
                $(this.el).find("#doctor_list li").remove(".on_doctor");
                $(this.el).find("#select_dept option").remove();
                $(this.el).find("#select_doctor option").remove();
                $(this.el).find("#tip").addClass("hid");
                if (result.errorNo == 0) {
                    $(this.el).find("#tip").addClass("hid");
                    var data = result.doctors;
                    var count = data.length;
                    var listDept = [], listName = [], lis = "";
                    jctLibs.appendToChosen($("#select_dept"), "all", "全部");
                    jctLibs.appendToChosen($("#select_doctor"), "all", "全部");

                    for (var i = 0; i < count; i++) {
                        var reg_type = {"pt": '普通号', "zj": "专家号"}[data[i]['register_type']]
                        var info = [data[i].department_name, data[i].doctor_name, reg_type].join('-');
                        //医生列表
                        lis += "<li class='am-u-md-2 am-u-end on_doctor'><div><img src='http://114.55.85.57:8081" + data[i].user_icon +
                            "' name='" + data[i].doctor_name +
                            "' alt='" + data[i].doctor_id +
                            "' account='" + data[i].account_id +
                            "' deptName='" + data[i].department_name +
                            "' fee='" + data[i].register_fee +
                            "' deptId='" + data[i].department_id +
                            "'/><span class='font-center'>" + info +
                            "</span></div></li>";
                        //姓名列表
                        if ($("#select_doctor")) {
                            jctLibs.appendToChosen($("#select_doctor"), data[i].doctor_id, data[i].doctor_name);
                        }
                        if (listDept.indexOf(data[i].department_id) == -1) {
                            jctLibs.appendToChosen($("#select_dept"), data[i].department_id, data[i].department_name);
                            listDept.push(data[i].department_id);
                        }
                    }
                    $("#doctor_list").append(lis);
                } else if (result.errorNo == -1) {
                    $("#tip").removeClass("hid").find("p").text(result.msg);
                } else if (result.errorNo == 1) {
                    $("#tip").removeClass("hid").find("p").text(result.msg);
                }
            },

            //刷新医生页面
            refreshDoctor: function () {
                $(this.el).find("#registDate").val("");
                var now = new Date();
                var date = now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate();
                this.getDoctor(date);
            },

            //筛选科室
            searchDept: function () {
                var dept_code = $("#select_dept option:selected").html();
                if (dept_code == "全部") {
                    this.refreshDoctor();
                    return;
                }
                var date = $("#registDate").val();
                if (!date) {
                    var now = new Date();
                    date = now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate();
                }
                //将从后台获取的数据进行筛选显示
                var lis = $("#doctor_list").find("li");
                for (var i = 0; i < lis.length; i++) {
                    $(lis[i]).removeClass("hid");
                    var name = $(lis[i]).find('img').attr("deptname");
                    if (name != dept_code) {
                        $(lis[i]).addClass("hid");
                    }
                }
            },

            //筛选医生
            searchDoctor: function () {
                var doctorName = $("#select_doctor option:selected").html();
                var deptName = $("#select_dept option:selected").html();
                var lis = $("#doctor_list").find("li");
                if (doctorName == "全部") {
                    $(lis).removeClass("hid");
                    for (var i = 0; i < lis.length; i++) {
                        var dpName = $(lis[i]).find('img').attr("deptname");
                        if (dpName != deptName && deptName != '全部') {
                            $(lis[i]).addClass("hid");
                        }
                    }
                } else {
                    for (var j = 0; j < lis.length; j++) {
                        var docName = $(lis[j]).find('img').attr("name");
                        var dpName = $(lis[j]).find('img').attr("deptname");
                        $(lis[j]).removeClass("hid");
                        if (docName != doctorName || (dpName != deptName && deptName != '全部')) {
                            $(lis[j]).addClass("hid");
                        }
                    }
                }
            },

            //添加用户注册按钮
            aRegist: function () {
                $("#tips").addClass("hid");
                var province=$('#province').val(),
                 city=$('#city').val(),
                 area=$('#area').val();
                this.patientModel.set({
                    //enterprise_id: sessionStorage.getItem("enterprise_id"),
                    patient_name: $("#a_name").val().trim(),
                    patient_sex: $("#a_gender").val(),
                    patient_birth: $("#a_birth").val().trim() ? $("#a_birth").val().trim() : "null",
                    marry_state: $("#a_marry").val(),
                    card_id: $("#a_card_id").val().trim(),
                    patient_phone: $("#a_cellphone").val().trim(),
                    patient_tel: $("#a_phone").val().trim(),
                    patient_qq: $("#a_qq").val().trim(),
                    patient_wechet: $("#a_wechat").val().trim(),
                    patient_email: $("#a_email").val().trim(),
                    //nationaloty: $("#my_address").find("option:checked").text(),
                    province: province=='0'?"":$("#province").find("option:checked").text(),
                    city:  city=='0'?"":$("#city").find("option:checked").text(),
                    area:  area=='0'?"":$("#area").find("option:checked").text(),
                    //street: $("#a_detail").val(),
                    addr: $("#a_detail").val().trim(),
                    next_of_kin: $("#f_name").val().trim(),
                    next_of_kin_phone: $("#f_phone").val().trim()
                });

                this.patientModel.addPatient();
            },

            //添加患者结果
            addPatientResult: function (result) {
                if (result.errorNo == 0) {
                    $("#tips").addClass("am-alert-success").removeClass("am-alert-warning hid").find("p").text("注册成功，患者ID：" + result.obj);
                }
                else if (result.errorNo == -2) {
                    $("#tips").addClass("am-alert-warning").removeClass("am-alert-success hid").find("p").text("注册失败，请重新注册");
                }
            },

            //挂号日期改变进行的筛选
            RegistDate: function () {
                var rgtDate = $("#registDate").val();
                this.getDoctor(rgtDate);
            }
        });

        return view;
    });
