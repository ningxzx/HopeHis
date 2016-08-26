/**
 * Created by insomniahl on 15/12/17.
 */
define(['txt!../../Patient/addpatient/addpatient.html',
        '../../Common/patientModel',
        '../../Common/patientCollection',
        '../../Common/doctorModel',
        'jctLibs', 'bootstrapTable', 'handlebars', 'backbone', 'amazeui', 'printThis'],
    function (Template, patientModel, patientCollection, doctorModel, jctLibs, bootstrapTable, Handlebars, backbone) {
        var view = Backbone.View.extend({
            initialize: function () {
                this.doctorModel = new doctorModel();
                this.patientModel = new patientModel();

                //监听model手动事件
                this.listenTo(this.patientModel, 'searchById', this.showPatientInfoById);
                this.listenTo(this.patientModel, 'searchByName', this.showPatientInfoByName);
                this.listenTo(this.patientModel, 'addPatientResult', this.addPatientResult);
                this.listenTo(this.doctorModel, 'getDoctorResult', this.getDoctorResult);
                this.listenTo(this.doctorModel, 'getDeptDoctorResult', this.getDeptDoctorResult);
            },
            render: function () {
                $(this.el).html(Template);
                $(this.el).find("select").chosen({width: "100%", disable_search_threshold: 100});
                $(this.el).find("#a_birth").datepicker();
                this.getProvince();
                return this;
            },
            events: {
                "click #registionFee": "RegistionFee",  //挂号并收费按钮
                "click #doctor_list li": "getDoctorInfo",  //点击医生头像
                "click #search_id": "searchId",         //查找患者ID
                "change #a_card_id": "checkCardId", //身份证号自动生成出生日期
                "change #select_doctor": "searchDoctor", //查询医生
                "change #select_dept": "searchDept", //查询科室
                "click #a_regist": "aRegist",        //添加页面的注册按钮
                "changeDate.datepicker.amui #registDate": "RegistDate",    //挂号日期改变
                "blur #keyword": "formReset",       //重置form表单
                "click #reset": "resetEvent",        //重置事件
                "click #refresh": "refreshDoctor",      //点击刷新按钮
                "change #select_condition": "resetKeyWord",      //重置查询关键字
                "keyup #money": "changeFee",               //输入金额改变找零
                "change #province": "getcity",//省份改变获取城市
                "change #city": "getArea",//城市改变获取区县
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
            //重置事件
            resetEvent: function () {

                $("#keyword").val("");
                $("#doctor_name").val("");
                $("#registDate").val("");
                //sessionStorage.clear();
                $("form")[0].reset();
                var lis = $("#doctor_list").children();
                for (var i = 0; i < lis.length; i++) {
                    lis.removeClass("b");
                }
            },

            //重置表单
            formReset: function () {
                $("form")[0].reset();
            },

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
                    url: "http://192.168.0.220:8081/jethis/registeration/getdictprovincebycountry",
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
                    url: "http://192.168.0.220:8081/jethis/registeration/getdictcitybyprovince?province_code=" + code,
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
                    url: "http://192.168.0.220:8081/jethis/registeration/getdictdistrictbycity?city_code=" + code,
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


            //查询是否存在患者
            searchId: function () {
                var that = this;
                $("#regist_tip").addClass("hid");
                $(this.el).find("#names").addClass("hid");
                var select_condition = $("#select_condition").val();
                var $keyword = $("#keyword").val();
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


            showPatInfo: function (row) {
                $("#id").val(row.patient_id);
                $("#name").val(row.patient_name);
                $("#cardId").val(row.card_id);
                $("#birth").val(row.patient_birth);
                $("#gender").val(row.patient_sex).trigger('chosen:updated');
                var now = new Date();
                var age = now.getFullYear() - row.patient_birth.substring(0, 4);
                $("#age").val(age);
                $("#address").val(row.province + "-" + row.city + "-" + row.area + "-" + row.addr);
                $("#phone").val(row.patient_phone);
                $("#names").addClass("hid");
                sessionStorage.removeItem("doc_id");
            },


            //添加用户注册按钮
            aRegist: function () {

                $("#tips").addClass("hid");
                this.patientModel.set({
                    //enterprise_id: sessionStorage.getItem("enterprise_id"),
                    patient_name: $("#a_name").val().trim(),
                    patient_sex: $("#a_gender").val(),
                    patient_birth: $("#a_birth").val().trim(),
                    marry_state: $("#a_marry").val(),
                    card_id: $("#a_card_id").val().trim(),
                    patient_phone: $("#a_cellphone").val().trim(),
                    patient_tel: $("#a_phone").val().trim(),
                    patient_qq: $("#a_qq").val().trim(),
                    patient_wechet: $("#a_wechat").val().trim(),
                    patient_email: $("#a_email").val().trim(),
                    //nationaloty: $("#my_address").find("option:checked").text(),
                    province: $("#province").find("option:checked").text(),
                    city: $("#city").find("option:checked").text(),
                    area: $("#area").find("option:checked").text(),
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
                } else if (result.errorNo == -2) {
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