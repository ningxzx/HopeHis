/**
 * Created by insomniahl on 15/12/21.
 */
define(['jctLibs', "backbone"], function (jctLibs, Backbone) {
    // 患者医生关系Model
    var patientGroupModel = Backbone.Model.extend({
        defaults: {
            group_id:"",//分组ID
            group_name:"",//分组名称
            group_code:"",//分组拼音码
            group_condition:"",//分组条件
            create_group_date:"",//创建分组的时间
            doctor_id:"",//创建分组医生ID
            doctor_name:"",//创建分组医生全名
            doctor_code:"",//创建分组医生拼音码
            enterprise_id:"",//所属机构ID
            enterprise_name:"",//所属机构名称
            enterprise_code:"",//所属机构拼音码
            department_id:"",//所属科室ID
            department_name:"",//所属科室名称
            department_code:"",//所属科室拼音码
            group_level:"",//分组权限级别
            create_ip:"",//记录创建IP
            create_date_time:"",//记录创建时间
            change_info_ip:"",//修改记录的IP
            update_date_time:"",//修改记录的时间
            change_oper_id:"",//修改记录操作人员的ID
            is_delete:"",//是否删除
            del_ip:"",//删除时的IP
            del_date:"",//删除时间
            del_oper_id:""//删除操作人员ID
        },
        url: "http://URL/patient_groups",

        //获取患者分组名称
        getGroupName: function (enter_id, dept_id, doc_id) {
            var that = this, result = new jctLibs.jetHisResult;
            this.url = "http://192.168.0.220:8081/JetHis/Get/Group";
            this.fetch({
                data: $.param({
                    //参数
                    enterprise_id: enter_id,
                    department_id: dept_id,
                    doctor_id: doc_id
                }),
                success: function (model, response) {
                    if (enter_id != "" && dept_id == "" && doc_id == "") {
                        result = {
                            errorNo: 1,
                            //TODO:根据返回值来输入obj
                            //resData: jctLibs.listToObject(response[obj], "data")["data"],
                            errorInfo: "医院分组"
                        };
                    } else if (enter_id != "" && dept_id != "" && doc_id == "") {
                        result = {
                            errorNo: 2,
                            //resData: jctLibs.listToObject(response[obj], "data")["data"],
                            errorInfo: "科室分组"
                        };
                    } else if (enter_id != "" && dept_id != "" && doc_id != "") {
                        result = {
                            errorNo: 3,
                            //resData: jctLibs.listToObject(response[obj], "data")["data"],
                            errorInfo: "个人分组"
                        };
                    }else{
                        result = {
                            errorNo: 0,
                            //resData: jctLibs.listToObject(response[obj], "data")["data"],
                            errorInfo: "出了点小问题"
                        };
                    }
                    that.trigger("groupNameResult", result);
                },
                error: function (err, response) {
                    result = {
                        errorNo: -1,
                        resData: response,
                        errorInfo: "获取患者分组失败" + err
                    };
                    that.trigger("groupNameResult", result);
                }
            })
        },

        //获取患者分组
        getPatientGroup: function (enter_id, dept_id, doc_id, group_name, type) {
            var that = this, result = new jctLibs.jetHisResult;
            this.url = "http://192.168.0.220:8081/JetHis/Create/Group/";
            this.fetch({
                data: $.param({
                    //参数
                    enterprise_id: enter_id,
                    dept_id: dept_id,
                    doctor_id: doc_id,
                    group_name: group_name,
                    group_level: type
                }),
                success: function (model, response) {
                    //patientModel=model;
                    //console.log(model);
                    if (enter_id != "" && dept_id == "" && doc_id == "") {
                        result = {
                            errorNo: 1,
                            //TODO:根据返回值来输入obj
                            resData: jctLibs.listToObject(response[obj], "data")["data"],
                            errorInfo: "医院分组"
                        };
                    } else if (enter_id != "" && dept_id != "" && doc_id == "") {
                        result = {
                            errorNo: 2,
                            resData: jctLibs.listToObject(response[obj], "data")["data"],
                            errorInfo: "科室分组"
                        };
                    } else if (enter_id != "" && dept_id != "" && doc_id != "") {
                        result = {
                            errorNo: 3,
                            resData: jctLibs.listToObject(response[obj], "data")["data"],
                            errorInfo: "个人分组"
                        };
                    }else{
                        result = {
                            errorNo: 0,
                            resData: jctLibs.listToObject(response[obj], "data")["data"],
                            errorInfo: "出了点小问题"
                        };
                    }
                    that.trigger("groupResult", result);
                },
                error: function (err, response) {
                    result = {
                        errorNo: -1,
                        resData: response,
                        errorInfo: "获取患者分组失败" + err
                    };
                    that.trigger("groupResult", result);
                }
            })
        },

        //创建患者分组
        createGroup: function (enter_id, enter_name, dept_id, dept_name, doc_id, doc_name, data, type) {
            var that = this, result = new jctLibs.jetHisResult();
            this.url = "http://192.168.0.220:8081/JetHis/Create/Group/";
            this.save({
                enterprise_id: enter_id,
                enterprise_name:enter_name,
                department_id:dept_id,
                department_name:dept_name,
                doctor_id:doc_id,
                doctor_name:doc_name,
                group_name: data[0],
                sex:data[1],
                minAge:data[2],
                maxAge:data[3],
                group_condition:data[4],
                group_level:type
            },{
                success: function (model, response) {
                    if(response){
                        result = {
                            errorNo: 0,
                            errorInfo:"获取患者信息成功",
                            resData:response
                        }
                    }
                    that.trigger("getAllPatient", result);
                },
                error: function (err, response) {
                    result = {
                        errorNo: -1,
                        errorInfo:"获取患者信息成功",
                        resData:response
                    };
                    that.trigger("getAllPatient", result);
                }
            });
        }

    });

    return patientGroupModel;

});
