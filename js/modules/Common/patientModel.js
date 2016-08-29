/**
 * Created by xiangzx on 15-11-23.
 */
define(["backbone", 'jctLibs'], function (Backbone, jctLibs) {
    // 患者Model，包含药物的基础属性
    var patientModel = Backbone.Model.extend({
        defaults: {
            patient_id: "",//患者ID
            patient_name: "",//患者姓名
            patient_sex: "",//患者性别
            patient_birth: "",//患者生日
            marry_state: "",//患者婚姻状态
            card_id: "",//患者身份证号
            nationality: "",//患者国籍
            patient_phone: "",//患者手机号
            //patient_tel:"",//患者座机号
            phone_number_business: "",//单位电话号码
            patient_qq: "",//患者QQ号
            patient_wechet: "",//患者微信号
            patient_email: "",//患者邮箱
            province: "",//患者常住省
            city: "",//患者常住市
            area: "",//患者常住区
            //street:"",//患者常住街道
            addr: "",//患者常住地址
            next_of_kin: "",//第二联系人
            next_of_kin_phone: "",//第二联系人电话号码
            //next_of_kin_province:"",//第二联系人常住省
            //next_of_kin_city:"",//第二联系人常住市
            //next_of_kin_area:"",//第二联系人常住区
            //next_of_kin_street:"",//第二联系人常住街道
            //next_of_kin_detail:"",//第二联系人常住详细地址
            //isalive:"",//是否死亡
            //daed_area:"",//死亡地点
            //dead_time:"",//死亡时间
            //dead_reason:""//死亡原因
        },
        url: "http://114.55.85.57:8081/jetHis/patient",
        urlRoot: "http://114.55.85.57:8081",
        getPat: function (patient_id) {
            var that = this, result = {};
            $.ajax({
                url: that.urlRoot + "/jethis/query/get",
                type: "get",
                data: $.param({
                    "table": "customer.patient",
                    "json": JSON.stringify({
                        "patient_id": patient_id
                    })
                })
            }).done(function (response) {
                if (response.rows) {
                    result = {
                        errorNo: 0,
                        data: jctLibs.listToObject(response, "rows")["rows"]
                    };
                }
                that.trigger("patGetted", result);
            }).fail(function (error) {
                var responseText = $.parseJSON(error.responseText);
                result = {
                    errorNo :responseText.code,
                    errorInfo :responseText.message
                };
                that.trigger("patGetted", result);
            });
        },

        initialize: function () {
            this.on("invalid", function (model, error) {

                $("#tips").addClass("am-alert-warning").removeClass("am-alert-success hid").find("p").text(error);
            });
        },
        validate: function (attrs, options) {
            if (!attrs.patient_name) {
                return "姓名不能为空";
            }else if (!attrs.card_id || !(attrs.card_id.length == 18 || attrs.card_id.length == 15)) {
                    return "请输入正确的15或18位身份证号码";
            }
            //if (!attrs.patient_name) {
            //    return "姓名不能为空";
            //} else if (!attrs.patient_birth) {
            //    return "出生日期不能为空";
            //} else if (!attrs.card_id || !(attrs.card_id.length == 18 || attrs.card_id.length == 15)) {
            //    return "请输入正确的15或18位身份证号码";
            //} else if (!attrs.patient_phone.match(/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/)) {
            //    return "请输入正确的11位手机号码";
            //} else if (!attrs.patient_email || !attrs.patient_email.match(/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/)) {
            //    return "请输入正确的邮箱";
            //} else if (!attrs.province || !attrs.city || !attrs.area || !attrs.addr) {
            //    return "请填写地址信息";
            //} else if (!attrs.next_of_kin_phone.match(/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/)) {
            //    return "请输入第二联系人正确的11位手机号码";
            //}
        },

        //通过ID查询患者
        searchPatientById: function (enter_id, patient_id) {
            var that = this,param={};
            var result = {
                errorNo: -1,
                msg: "",
                obj: {}
            };
            if(enter_id){
                param['enterprise_id']=enter_id
            }
            if(patient_id.indexOf('PAT')==-1){
                param['patient_id']='PAT'+patient_id
            }
            else{
                param['patient_id']=patient_id
            }
            this.url = "http://114.55.85.57:8081/jethis/registeration/query_patient";
            this.fetch({
                async: true,
                data: $.param(param),
                success: function (model, response) {
                    if (response.rows.length != "0") {
                        result = {
                            errorNo: 0,
                            msg: "获取患者信息成功",
                            obj: jctLibs.listToObject(response, "rows")["rows"][0]
                        }
                    } else {
                        result = {
                            errorNo: -1,
                            msg: "获取患者信息失败",
                            obj: {}
                        }
                    }
                    that.trigger("searchById", result);
                },
                error: function (err, response) {
                    result = {
                        errorNo: -2,
                        msg: "获取患者信息失败",
                        obj: {}
                    };
                    that.trigger("searchById", result);
                }
            });
        },

        //通过姓名查询患者
        searchPatientByName: function (enter_id, patient_name) {
            var that = this,param={};
            var result = {
                errorNo: -1,
                msg: "",
                obj: {}
            };
            if(enter_id){
                param['enterprise_id']=enter_id
            }
            if(patient_name){
                param['patient_name']=patient_name
            }
            this.url = "http://114.55.85.57:8081/jethis/registeration/query_patient";
            this.fetch({
                async: true,
                data: $.param(param),
                success: function (model, response) {
                    if (response.rows.length != "0") {
                        result = {
                            errorNo: 0,
                            msg: "获取患者信息成功",
                            obj: jctLibs.listToObject(response, "rows")["rows"]
                        }
                    } else {
                        result = {
                            errorNo: 1,
                            msg: "获取患者信息失败"
                        }
                    }
                    that.trigger("searchByName", result);
                },
                error: function (err, response) {
                    result = {
                        errorNo: -1,
                        msg: "获取患者信息成功",
                        obj: response
                    };
                    that.trigger("searchByName", result);
                }
            });
        },

        //添加用户
        addPatient: function () {
            var that = this;
            var result = {
                errorNo: -1,
                msg: "",
                obj: {}
            };
            this.url = "http://114.55.85.57:8081/jethis/registeration/addpatientinfo";
            this.save({}, {
                success: function (model, response) {
                    if (response.resultCode == "101") {
                        result = {
                            errorNo: -2,
                            msg: "患者注册失败!",
                            obj: response.patient_id
                        };
                    }
                    else if (response.resultCode == "100") {
                        result = {
                            errorNo: 0,
                            msg: "注册成功!",
                            obj: response.patient_id
                        };
                    }
                    that.trigger("addPatientResult", result);
                },
                error: function (err, response) {
                    result = {
                        errorNo: -2,
                        msg: "保存数据失败。",
                        obj: response
                    };
                    that.trigger("addPatientResult", result);
                }
            });
        },

        //查询所有用户
        allPatient: function (enter_id, dept_id) {
            var that = this, result = new jctLibs.jetHisResult();
            this.url = "http://114.55.85.57:8081/jethis/registeration/query_patient";
            this.fetch({
                async: true,
                data: $.param({
                    enterprise_id: enter_id,
                    dept_id: dept_id
                }),
                success: function (model, response) {
                    if (response) {
                        result = {
                            errorNo: 0,
                            errorInfo: "获取患者信息成功",
                            resData: response
                        }
                    }
                    that.trigger("getAllPatient", result);
                },
                error: function (err, response) {
                    result = {
                        errorNo: -1,
                        errorInfo: "获取患者信息成功",
                        resData: response
                    };
                    that.trigger("getAllPatient", result);
                }
            });
        }

    });

    return patientModel;

});
