define(["backbone"], function (Backbone) {
    var drugSalesModel = Backbone.Model.extend({
        searchDrug: function (data) {
            var that = this, result = {};
            $.ajax({
                url: "",
                type: "",
                data: ""
            }).done(function (response) {
                result.errorNo = 0;
                result.data = response;
                result.table = data.table;
            }).fail(function (error) {
                result.errorNo = 1;
                result.data = error;
                result.errorInfo = "there's must be somgthing wrong!";
            });

            this.trigger("searchResult", result);
        }
    });
    return drugSalesModel;

});