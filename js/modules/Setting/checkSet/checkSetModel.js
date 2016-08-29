define(['jquery', "backbone", 'jctLibs'],function($, Backbone, jctLibs) {
    var rootUrl = "http://114.55.85.57:8081";
    var checkSetModel = Backbone.Model.extend({
        //检查添加
        postcheckSetnew: function (rows) {
            var that = this;
            var result = {};
            //var params=data||{};
            //params['enterprise_id']=sessionStorage.getItem('enterprise_id');
            var params={
                tableName:rows.erp,
                check_name:rows.checkName,
                check_price:rows.Checkunit,
                remark:rows.Remarks,
                dgns_treat_name:rows.dgns_name,
                dgns_treat_price:rows.dgns_unit,
                inspection_name:rows.inspectionName,
                inspection_price:rows.inspection_unit,

            };
            $.ajax({
                type: "post",
                url: rootUrl + "/jethis/Item/AddNewItem/",
                data: JSON.stringify(params)
            }).done(function (data) {
                result.errorNo = 0;
                //result.rows = jctLibs.listToObject(data, 'rows')['rows'];
                result.rows=data;
                that.trigger("postcheckSetnew", result);

            }).fail(function (error) {
                result.data = error;
                result.errorNo = -1;
                that.trigger("postcheckSetnew", result);
            });
        },
        //修改
        PatchcheckSet: function (rows) {
            var that = this;
            var result = {};
            //var params=data||{};
            //params['enterprise_id']=sessionStorage.getItem('enterprise_id');
            var params={
                tableName:rows.erp,
                check_name:rows.checkName,
                check_price:rows.Checkunit,
                remark:rows.Remarks,
                dgns_treat_name:rows.dgns_name,
                dgns_treat_price:rows.dgns_unit,
                inspection_name:rows.inspectionName,
                inspection_price:rows.inspection_unit,
            };
            $.ajax({
                type: "PATCH",
                url: rootUrl + "/jethis/Item/UpdateItemInfo/"+rows.record_id,
                data: JSON.stringify(params)
            }).done(function (data) {
                result.errorNo = 0;
                //result.rows = jctLibs.listToObject(data, 'rows')['rows'];
                result.rows=data;
                that.trigger("PatchcheckSet", result);

            }).fail(function (error) {
                result.data = error;
                result.errorNo = -1;
                that.trigger("PatchcheckSet", result);
            });
        },

        //删除
        deleteCheckSet: function (rows) {
            var that = this;
            var result = {};
            //var params=data||{};
            //params['enterprise_id']=sessionStorage.getItem('enterprise_id');
            var params={
                tableName:rows.erp,
            };
            $.ajax({
                type: "delete",
                url: rootUrl + "/jethis/Item/UpdateItemInfo/"+rows.record_id,
                data: params
            }).done(function (data) {
                result.errorNo = 0;
                //result.rows = jctLibs.listToObject(data, 'rows')['rows'];
                result.rows=data;
                that.trigger("deleteCheckSet", result);

            }).fail(function (error) {
                result.data = error;
                result.errorNo = -1;
                that.trigger("deleteCheckSet", result);
            });
        },
    });



    return checkSetModel;
});
