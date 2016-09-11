/**
 * Created by xiangzx on 15-11-23.
 */
define(["jquery","backbone", 'jctLibs'], function ($,Backbone, jctLibs) {
    // 患者Model，包含药物的基础属性
    var urlRoot= "http://192.168.0.220:8081";
    var patientModel = Backbone.Model.extend({
        getPat: function (patient_id) {
            var that = this, result = {};
            $.ajax({
                url: urlRoot + "/jethis/query/get",
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
            $.ajax({
                url: urlRoot + "/jethis/registeration/query_patient",
                data: $.param(param),
                type:'get',
                success: function (response) {
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
                error: function (response) {
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
            $.ajax({
                type:'get',
                url: urlRoot + "/jethis/registeration/query_patient",
                data: $.param(param),
                success: function (response) {
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
                error: function (response) {
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
        addPatient: function (param) {
            var that = this;
            var result = {
                errorNo: -1,
                msg: "",
                obj: {}
            };
            $.ajax({
                type:'post',
                url: urlRoot + "/jethis/registeration/addpatientinfo",
                data: JSON.stringify(param),
                success: function (response) {
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
                error: function (response) {
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
            $.ajax({
                url: urlRoot + "/jethis/registeration/query_patient",
                type:'get',
                data: $.param({
                    enterprise_id: enter_id,
                    dept_id: dept_id
                }),
                success: function ( response) {
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
