/**
 * Created by xzx on 2016/5/3.
 */
define(["jquery", "backbone"],
    function ($, Backbone) {
        var rootUrl = "http://114.55.85.57:8081";
        var minCheckModel = Backbone.Model.extend({
            getCheckRecord: function (data) {
                var that = this;
                var result = {};
                var params=data||{};
                params['enterprise_id']=sessionStorage.getItem('enterprise_id');
                $.ajax({
                    type: "get",
                    url: rootUrl + "/jethis/storate/storateRecordInfo",
                    data: params
                }).done(function (rows) {
                    result.errorNo = 0;
                    result.rows = rows;
                    that.trigger("getCheckRecords", result);

                }).fail(function (error) {
                    result.data = error;
                    result.errorNo = -1;
                    that.trigger("getCheckRecords", result);
                });
            },
            getRecordDetail: function (storate_record_id) {
                var that = this;
                var result = {};
                var params={storate_record_id:storate_record_id};
                $.ajax({
                    type: "get",
                    url: rootUrl + "/jethis/storate/storateDetailItemInfo",
                    data: params
                }).done(function (rows) {
                    result.errorNo = 0;
                    result.rows = rows;
                    that.trigger("getRecordDetails", result);

                }).fail(function (error) {
                    result.data = error;
                    result.errorNo = -1;
                    that.trigger("getRecordDetails", result);
                });
            },
            //提交审核
            submitInfo: function (data) {
                var that = this;
                $.ajax({
                    type: "post",
                    url: rootUrl + "/jethis/storate/newStorateRecord",
                    data: JSON.stringify({
                        "storateRecord": {
                            "enterprise_id": data.enterpriseId,
                            "oper_account_id": data.operAccountId,
                            "suppliers_name": data.suppliersName,
                            "contact_person": data.contactPerson,
                            "contact_person_tel": data.contactPersonTel,
                            "delivery_company": data.deliveryCompany,
                            "delivery_person": data.deliveryPerson,
                            "delivery_person_tel": data.deliveryPersonTel,
                            "recipient_date": data.recipientDate,
                            "storate_date": data.storateDate,
                            "goods_total_costs": data.totalCosts,
                            "need_pay_costs": data.payCosts,
                            "charge_costs": data.chargeCosts,
                            "recipient_person_id": data.recipientPerson,
                            "recipient_person_name": data.recipientPersonId,
                            "recipient_person_code": data.recipientPersonCode,
                            "delivery_detail": data.deliveryDetail,
                            "recipient_detail": data.recipientDetail,
                            "storate_state": data.storateState,
                            "delivery_list_scan": data.deliveryList,
                            "storate_type": data.storateType
                        }, "storateDetailRecord": data.details
                    })
                }).done(function (data) {
                    var result = {};
                    if (data.state == "100") {
                        result.errorNo = 0;
                        that.trigger("saveResult", result);
                    }
                }).fail(function (error) {
                    var result = {};
                    result.data = error;
                    result.errorNo = -1;
                    that.trigger("saveResult", result);
                });
            },
            //审核确认
            getConfirmation: function (reviewresult,reviewid) {
                var that = this;
                var result = {};
                var params={
                    review_result:reviewresult,
                    review_id:reviewid
                };
                $.ajax({
                    type: "post",
                    url: rootUrl + "/jethis/review/reviewRecord/10",
                    data:  JSON.stringify(params)
                }).done(function (res) {
                    result.errorNo = 0;
                    result.state = res.state;
                    that.trigger("getConfirmation", result);
                }).fail(function (error) {
                    result.data = error;
                    result.errorNo = -1;
                    that.trigger("getConfirmation", result);
                });
            },
        });
        return minCheckModel;
    });
