/**
 * Created by insomniahl on 16/4/25.
 */
define(["jquery","backbone"], function ($,Backbone) {
    var rootUrl = "http://192.168.0.220:8081";
    var mverifyModel = Backbone.Model.extend({
        getrendeMy: function (chinesename) {
            var that = this;
            var result = {};
            var params={
                chinese_name:chinesename
            };
            $.ajax({
                type: "get",
                url: rootUrl + "/jethis/drug/drugBaseInfo/10",
                data: params
            }).done(function (rows) {
                result.errorNo = 0;
                result.rows = rows;
                that.trigger("getrendeMy", result);

            }).fail(function (error) {
                result.data = error;
                result.errorNo = -1;
                that.trigger("getrendeMy", result);
            });
        },

        //盘点提交
        postSubmission: function (time,row) {
            var arr=[];
            for(var i=0;i<row.length;i++){
                var data={
                    goods_id:row[i].goods_id,
                    goods_name:row[i].goods_name,
                    goods_input_code:row[i].goods_input_code,
                    storate_batch_no:row[i].batch_no,
                    before_change_num:row[i].current_num,
                    min_packing_unit:row[i].min_packing_unit,
                    after_change_num:parseInt(row[i].profit_num)

                };
                arr.push(data);
            }
            var that = this;
            var result = {};
            var params={
                setDateTime:time,
                item:arr,
            };

            $.ajax({
                type: "post",
                url: rootUrl + "/jethis/goods/newSetPoint",
                data: JSON.stringify(params)
                //data:params
            }).done(function (rows) {
                result.errorNo = 0;
                result.rows = rows;
                that.trigger("postSubmission", result);

            }).fail(function (error) {
                result.data = error;
                result.errorNo = -1;
                that.trigger("postSubmission", result);
            });
        },

        //postSubmission: function (data) {
        //    var that = this;
        //    $.ajax({
        //        type: "post",
        //        data: JSON.stringify({
        //            "drug_name": data.drugName,//药品名称
        //            "drug_way": "2",
        //            "drug_type": "ZY",
        //            "enterprise_id": data.enterpriseId,//机构ID
        //            "add_account_id": data.addAccountId,//添加药品的帐号ID
        //            "drug_parts": data.drugParts,//药品成分
        //            "memo": data.memo,    //说明
        //            "drug_status": data.drugStatus,//药品状态
        //            "drug_spec": data.drugSpec,//药物规格
        //            "min_packing_unit":data.drugUnit//最小包装规格单位
        //        }),
        //        url: rootUrl + "/jethis/drug/addNewDrug"
        //    }).done(function (data) {
        //        if(data.state == "100")
        //            console.log(data);
        //    }).fail(function (error) {
        //        console.log(error);
        //    });
        //},
    });


    return mverifyModel;
});
