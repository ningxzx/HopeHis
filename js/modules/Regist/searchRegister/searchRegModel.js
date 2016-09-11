/**
 * Created by insomniahl on 15/11/24.
 */
define(['jquery',"backbone","jctLibs"], function ($,Backbone,jctLibs) {
    var searchRegModel = Backbone.Model.extend({
        getRegInfo: function (data) {
            var that = this,param=data||{},date=jctLibs.getDateStr(new Date());
            if(!param['endDateTime']) {
                param['endDateTime'] = date;
            }
            param['enterprise_id']=sessionStorage.getItem('enterprise_id');
            var result = {
                errorNo: 0,
                obj: {}
            };
            $.ajax({
                url: "http://192.168.0.220:8081/jethis/Patient/RegisterRecord",
                type:'get',
                data: $.param(param)
            }).done(function (res) {
                result.errorNo = 0;
                result.rows= res;
                that.trigger("getRegInfo", result);
            }).fail(function (err, response) {
                result.errorNo = -1;
                result.msg = "获取医生列表失败";
                that.trigger("getRegInfo", result);
            });
        },
        chargeRecord:function (data) {
            var that = this,param=data||{},result={};
            $.ajax({
                url: "http://192.168.0.220:8081/jethis/registeration/NewChargeRecord",
                type:'patch',
                data: JSON.stringify(param),
                success:function (res) {
                    if(res.register_id!=-1){
                        result.errorNo=0;
                        result.register_id=res.register_id;
                    }
                    else{
                        result.errorNo=-1;
                    }
                    that.trigger("chargeReg", result);
                }
            })
        }
    });

    return searchRegModel;
});
