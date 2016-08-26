define(['jquery', "backbone", 'jctLibs'],function($, Backbone, jctLibs) {
    var rootUrl = "http://192.168.0.220:8081";
    // 会员Model，包含会员的基本信息
    var memberModel = Backbone.Model.extend({
        //默认查询
        getMembers: function (entityid) {
            var that = this;
            var result = {
                errorNo: 0,//0为正确的值，其余值为错误
                errorInfo: ""
            };
            $.ajax({
                type: "get",
                url: rootUrl+'/jethis/members/all',
                reset: true,
                data: {
                    entity_id:entityid
                }
            }).done(function (res) {
                //console.log(res)
                result.errorNo = 0;
                if(res.rows){
                    result.depts = jctLibs.listToObject(res, 'rows')['rows'];
                }else{
                    result.depts=res;
                }

                that.trigger("deptsGetted", result);

            }).fail(function (err, response) {
                var responseText = $.parseJSON(err.responseText);
                result.errorNo = responseText.code;
                result.responseData = responseText.message;
                that.trigger("deptsGetted", result);

            })
        },

        //按照条件查询
        conditionMember: function (customerid,customername,customertel,memberlevel,memberstate) {
            var that = this;
            var result = {
                errorNo: 0,//0为正确的值，其余值为错误
                errorInfo: ""
            };
            $.ajax({
                type: "post",
                url: rootUrl+'/jethis/members/select',
                reset: true,
                data: JSON.stringify({
                    customer_id:customerid,
                    customer_name:customername,
                    customer_tel:customertel,
                    member_level:memberlevel,
                    member_state:memberstate
                })
            }).done(function (res) {

                result.errorNo = 0;
                //result.depts = jctLibs.listToObject(res, 'rows')['rows'];
                result.data=res;
                that.trigger("conditionMember", result);

            }).fail(function (err, response) {
                var responseText = $.parseJSON(err.responseText);
                result.errorNo = responseText.code;
                result.responseData = responseText.message;
                that.trigger("conditionMember", result);

            })
        },

        //新增保存
        addMember: function (memberId,entityid,entityname,customerid,customername,customertel,customercardid,memberlevel,memberpoints,cardmoney,memberstate,discount,isusemoneypoor) {
            var that = this;
            var result = {
                errorNo: 0,//0为正确的值，其余值为错误
                errorInfo: ""
            };
            $.ajax({
                type: "post",
                url:rootUrl+'/jethis/members/add',
                reset: true,
                data: JSON.stringify({
                    "member_id":memberId,
                    "entity_id":entityid,
                    "entity_name":entityname,
                    "customer_id":customerid,
                    "customer_name":customername,
                    "customer_tel":customertel,
                    "customer_card_id":customercardid,
                    "member_level":memberlevel,
                    "member_points":memberpoints,
                    "card_money":cardmoney,
                    "member_state":memberstate,
                    "discount":discount,
                    "isuse_money_poor":isusemoneypoor
                })
            }).done(function (res) {
                result.errorNo = 0;
                //result.depts = jctLibs.listToObject(res, 'rows')['rows'];
                result.depts=res;
                that.trigger("addMember", result);

            }).fail(function (err, response) {
                var responseText = $.parseJSON(err.responseText);
                result.errorNo = responseText.code;
                result.responseData = responseText.message;
                that.trigger("addMember", result);

            })
        },

        //编辑
        PATCHedit: function (memberID,entityid,entityname,customerid,customername,customertel,customercardid,memberlevel,memberpoints,cardmoney,memberstate,discount,isusemoneypoor) {
            var that = this;
            var result = {
                errorNo: 0,//0为正确的值，其余值为错误
                errorInfo: ""
            };
            $.ajax({
                type: "PATCH",
                url:rootUrl+'/jethis/members/edit/'+memberID,
                reset: true,
                data: JSON.stringify({
                    "entity_id":entityid,
                    "entity_name":entityname,
                    "customer_id":customerid,
                    "customer_name":customername,
                    "customer_tel":customertel,
                    "customer_card_id":customercardid,
                    "member_level":memberlevel,
                    "member_points":memberpoints,
                    "card_money":cardmoney,
                    "member_state":memberstate,
                    "discount":discount,
                    "isuse_money_poor":isusemoneypoor
                })
            }).done(function (res) {
                result.errorNo = 0;
                //result.depts = jctLibs.listToObject(res, 'rows')['rows'];
                result.depts=res;
                that.trigger("PATCHedit", result);

            }).fail(function (err, response) {
                var responseText = $.parseJSON(err.responseText);
                result.errorNo = responseText.code;
                result.responseData = responseText.message;
                that.trigger("PATCHedit", result);

            })
        },
        //删除
        delmember: function (memberID) {
            var that = this;
            var result = {
                errorNo: 0,//0为正确的值，其余值为错误
                errorInfo: ""
            };
            $.ajax({
                type: "delete",
                url:rootUrl+'/jethis/members/del/'+memberID,
                reset: true,

            }).done(function (res) {
                result.errorNo = 0;
                //result.depts = jctLibs.listToObject(res, 'rows')['rows'];
                result.depts=res;
                that.trigger("delmember", result);

            }).fail(function (err, response) {
                var responseText = $.parseJSON(err.responseText);
                result.errorNo = responseText.code;
                result.responseData = responseText.message;
                that.trigger("delmember", result);

            })
        },
        chargeMember: function (member_id,param) {
            var that = this;
            var result = {
                errorNo: 0,//0为正确的值，其余值为错误
                errorInfo: ""
            };
            /**
             * patient_id:患者ID
             total_charges:充值金额
             cash_pay:现金支付
             wechat_pay:微信支付
             ali_pay:支付宝支付
             bank_card_pay:银行卡支付
             */
            $.ajax({
                type: "post",
                url:rootUrl+'/jethis/Member/MemberCharging/'+member_id,
                reset: true,
                data:JSON.stringify(param)
            }).done(function (res) {
                result.errorNo = 0;
                result.status=res.resultCode;
                that.trigger("memberCharged", result);
            }).fail(function (err, response) {
                var responseText = $.parseJSON(err.responseText);
                result.errorNo = responseText.code;
                result.responseData = responseText.message;
                that.trigger("memberCharged", result);

            })
        },
        postExcel:function (data) {
            var that = this;
            var result = {
                errorNo: 0,//0为正确的值，其余值为错误
                errorInfo: ""
            };
            $.ajax({
                type: "post",
                url: rootUrl + '/jethis/File/UpLoadExcel',
                reset: true,
                data: data,
                processData: false,
                contentType: false,
                success: function (res) {
                    result.errorNo = 0;
                    result.status = res.resultCode;
                    that.trigger("postMemberExcel", result);
                },
                error: function (err, response) {
                    var responseText = $.parseJSON(err.responseText);
                    result.errorNo = responseText.code;
                    result.responseData = responseText.message;
                    that.trigger("postMemberExcel", result);
                }
            })
        }

    });


    return memberModel;

});


