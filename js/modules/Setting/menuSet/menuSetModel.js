/**
 * Created by xzx on 2016/5/3.
 */
define(['jquery', "backbone", 'jctLibs'], function ($, Backbone, jctLibs) {
    var rootUrl = "http://114.55.85.57:8081";
    var menuSetModel = Backbone.Model.extend({
        submitRole: function (type, param,evName,id) {
            var that = this, result = {};
            var url='/jethis/role/NewRole';
            if(type=='patch') {
                url='/jethis/role/updateRoleInfo/'+id;
            }
            $.ajax({
                type: type,
                url: rootUrl + url,
                data: JSON.stringify(param),
                success: function (res) {
                    result.data = res;
                    result.errorNo = 0;
                    result.state = res.state;
                    that.trigger(evName, result);
                },
                error: function (err) {
                    var responseText = $.parseJSON(err.responseText);
                    result.errorNo = responseText.code;
                    result.responseData = responseText.message;
                    that.trigger(evName, result);
                }
            })
        },
        deleteRole: function (id) {
            var that = this;
            var result = {
                errorNo: 0,//0为正确的值，其余值为错误
                errorInfo: ""
            };
            $.ajax({
                type: 'delete',
                url: rootUrl +'/jethis/role/deleteRoleRecord/'+id,
            }).done(function (res) {
                result = res;
                result.errorNo = 0;
                result.state = res.state;
                that.trigger('deleteRole', result);
            }).fail(function (err) {
                var responseText = $.parseJSON(err.responseText);
                result.errorNo = responseText.code;
                result.responseData = responseText.message;
                that.trigger('deleteRole', result);

            })
        },
    });
    return menuSetModel;
});
