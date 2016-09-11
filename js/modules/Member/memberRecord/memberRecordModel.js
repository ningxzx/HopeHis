/**
 * Created by insomniahl on 16/7/25.
 */
define(['jquery', "backbone", 'jctLibs'],function($, Backbone, jctLibs) {
    var rootUrl = "http://192.168.0.220:8081";
    // 会员Model，包含会员的基本信息
    var memberRecordModel = Backbone.Model.extend({
        searchRecord: function (data) {
            var that = this;
            var result = {};
            var params=data||{};
            //params['enterprise_id']=sessionStorage.getItem('enterprise_id');
            $.ajax({
                type: "get",
                url: rootUrl + "/jethis/Statistics/GetChargeInfo",
                data: $.param(params)
            }).done(function (data) {
                if(data.length != 0){
                    result.errorNo = 0;
                    result.data = data;
                }else{
                    result.errorNo = 1;
                }
                that.trigger("searchResult", result);

            }).fail(function (error) {
                result.data = error;
                result.errorNo = -1;
                that.trigger("searchResult", result);
            });
        }
    });


    return memberRecordModel;

});


