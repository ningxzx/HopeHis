define(["backbone"], function (Backbone) {
    var rootUrl="http:192.168.0.220";
    var clinicFinancialModel = Backbone.Model.extend({
        search: function (table,data,evName) {
            var that = this;
            var param={};
            param.table=table;
            param.json=JSON.stringify(data);
            var result = {
                errorNo: 0,
                errorInfo: ""
            };
            $.ajax({
                type: "get",
                url: rootUrl+'/jethis/query/get',
                reset: true,
                data: param
            }).done(function (res) {
                result.errorNo = 0;
                result.rows = jctLibs.listToObject(res, 'rows')['rows'];
                that.trigger(evName, result);

            }).fail(function (err, response) {
                var responseText = $.parseJSON(err.responseText);
                result.errorNo = responseText.code;
                result.responseData = responseText.message;
                that.trigger(evName, result);

            })
        },
    });
    return clinicFinancialModel;

});