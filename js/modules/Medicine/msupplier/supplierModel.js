define(['jquery', "backbone", "jctLibs"], function ($, Backbone, jctLibs) {
    //供应商model
    var supplierModel = Backbone.Model.extend({
        addSupplier: function (param) {
            var that = this, result = new jctLibs.jetHisResult();
            $.ajax({
                type:'post',
                url: "http://114.55.85.57:8081/jethis/suppliers/newSupplier ",
                data: JSON.stringify(param),
            }).done(function (res) {
                result.errorNo = 0;
                //返回sql语句执行状态,0为失败,1为成功
                result.state = res.state;
                that.trigger("addSupplier", result);

            })
        },
        editSupplier: function (id,param) {
            var that = this, result = new jctLibs.jetHisResult();
            $.ajax({
                type:'patch',
                url: "http://114.55.85.57:8081/jethis/suppliers/updateSupplierInfo/"+id,
                data: JSON.stringify(param),
            }).done(function (res) {
                result.errorNo = 0;
                //返回sql语句执行状态,0为失败,1为成功
                result.state = res.state;
                that.trigger("addSupplier", result);

            })
        },
        deleteSupplier: function (id) {
            var that = this, result = new jctLibs.jetHisResult();
            $.ajax({
                type:'delete',
                url: "http://114.55.85.57:8081/jethis/suppliers/deleteSupplier/"+id,
            }).done(function (res) {
                result.errorNo = 0;
                //返回sql语句执行状态,0为失败,1为成功
                result.state = res.state;
                result.type='delete';
                that.trigger("addSupplier", result);

            })
        }
    });
    return supplierModel;
})
