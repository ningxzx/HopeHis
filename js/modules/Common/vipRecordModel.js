/**
 * Created by insomniahl on 15/12/21.
 */
define(['backbone','jctLibs'], function (Backbone,jctLibs) {
    var vipRecordModel = Backbone.Model.extend({
        defaults:{
            vip_no:"", //VIP号
            entity_id:"", //实体ID
            entity_name:"", //实体名称
            entity_code:"", //实体拼音码
            customer_id:"", //客户ID
            customer_name:"", //客户名称
            customer_cod:"", //客户拼音码
            customer_tel:"", //客户手机号
            customer_card_id:"", //客户身份证号
            vip_discoun:"", //VIP折扣
            created_ip:"", //VIP创建的IP
            create_date_time:"", //VIP创建的时间
            change_info_ip:"", //修改还款记录的IP
            update_date_time:"", //修改还款记录的时间
            change_oper_id:"", //修改还款记录操作人员的ID
            is_del:"", //是否删除
            del_ip:"", //删除时的IP
            del_date:"", //删除时间
            del_oper_id:"" //删除操作人员ID
        },
        url:"http://URL/vip_records",

        //查询所有VIP患者
        getAllVip: function (enter_id) {
            var that = this, result = new jctLibs.jetHisResult();
            this.url = "http://114.55.85.57:8081/JetHis/Get/VIP/entity_id/vip_no";
            this.fetch({
                data: $.param({
                    //参数
                    enterprise_id: enter_id,
                    selectType:1
                }),
                success: function (model, response) {
                    console.log(response);
                    if(response!=null){
                        result = {
                            errorNo: 0,
                            //TODO:将response转换成json
                            resData:response,
                            errorInfo:"查询Vip成员成功"
                        }
                    }else{
                        result = {
                            errorNo: -1,
                            resData:response,
                            errorInfo:"增加Vip成员失败"
                        }
                    }
                    that.trigger("VipResult", result);
                },
                error: function (err, response) {
                    result={
                        errorNo: -2,
                        resData:response,
                        errorInfo:"增加Vip成员失败"+response
                    };
                    that.trigger("VipResult", result);
                }
            });
        },

        //添加VIP患者
        addVip: function (enter_id, row, vipNo) {
            var that = this, result = new jctLibs.jetHisResult();
            this.url = "http://114.55.85.57:8081/JetHis/Create/VIP/";
            this.fetch({
                data: $.param({
                    //参数
                    entity_id: enter_id,
                    vip_no: vipNo,
                    entity_name:"",
                    customer_id:"",
                    customer_name:"",
                    customer_tel:"",
                    customer_card_id:""
                }),
                success: function (model, response) {
                    if(response.code == 0){
                        result = {
                            errorNo: 0,
                            resData:row,
                            errorInfo:"增加Vip成员成功"
                        }
                    }else{
                        result = {
                            errorNo: -1,
                            resData:{},
                            errorInfo:"增加Vip成员失败"
                        }
                    }
                    that.trigger("addVipResult", result);
                },
                error: function (err, response) {
                    result={
                        errorNo: -2,
                        resData:response,
                        errorInfo:"增加Vip成员失败"+response
                    };
                    that.trigger("addVipResult", result);
                }
            });
        },

        //批量删除VIP
        removeVips: function (enter_id,rows) {
            var ids = [];
            for(var i = 0;i<rows.length;i++){
                if(ids.indexOf(rows[i].patient_id) != -1){
                    ids.push(rows[i].patient_id);
                }
            }
            var that = this, result = new jctLibs.jetHisResult();
            this.url = "http://114.55.85.57:8081/JetHis/Delete/VIP";
            this.fetch({
                data: $.param({
                    //参数
                    enterprise_id: enter_id,
                    idList: ids,
                    deleteType:0
                }),
                success: function (model, response) {
                    if(response.code == 0){
                        result = {
                            errorNo: 0,
                            resData:rows,
                            errorInfo:"批量删除Vip成员成功"
                        }
                    }else{
                        result = {
                            errorNo: -1,
                            resData:response,
                            errorInfo:"批量删除Vip成员失败"
                        }
                    }
                    that.trigger("removeVipResultes", result);
                },
                error: function (err, response) {
                    result={
                        errorNo: -2,
                        resData:response,
                        errorInfo:"批量删除Vip成员失败"+response
                    };
                    that.trigger("removeVipResultes", result);
                }
            });
        }
    });

    return vipRecordModel;
});
