

/**
 * Created by xzx on 2016/5/5.
 */
define(['jquery', "backbone", 'jctLibs'], function ($, Backbone, jctLibs) {
    var rootUrl = "http://192.168.0.220:8081";
    // 获取诊疗项目
    var retailDrugRecordM = Backbone.Model.extend({
        getrender: function (name,medicineName,startTime,endTime) {
            var _this = this, result = {};
            $.ajax({
                url: rootUrl+"/jethis/DrugSell/SellMainRecord",
                type: 'get',
                data:{
                    patient_name:name,
                    drug_name:medicineName,
                    start_date_time:startTime,
                    end_date_time:endTime,
                },
                success: function (res) {
                    result.errorNo = 0;
                    result.rows = res;
                    _this.trigger("getrender", result);
                },
                error: function (err) {
                    var responseText = $.parseJSON(err.responseText);
                    result.errorNo = responseText.code;
                    result.responseData = responseText.message;
                    _this.trigger("getrender", result);
                }
            })
        },
    });


    return retailDrugRecordM;

});