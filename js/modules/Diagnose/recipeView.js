define(['txt!../Diagnose/recipe.html',
        '../Diagnose/diagnoseView',
        '../Common/patientModel',
        'amazeui', 'handlebars', 'backbone', "jctLibs"],
    function (recipe, diagView, patModel, ai, Handlebars, backbone, jctLibs) {
        Handlebars.registerHelper('year', function (birth) {
            if (birth) {
                return new Date().getFullYear() - birth.substring(0, 4);
            }
        });
        Handlebars.registerHelper('gender', function (sex) {
            if (sex == "M") {
                return "男";
            } else if (sex == "F") {
                return "女";
            }
        });
        var wmedicineColumns = [
            {field: "", title: "序号", width: "5%", formatter: jctLibs.generateIndex},
            {field: "drug_name", width: "13%", title: "名称"},
            {field: "group_no", width: "5%", title: "组号", events: jctLibs.changeGroupNo, formatter: jctLibs.generateDrugGroup},
            {field: "take_spec", width: "8%", title: "单次用量", events: jctLibs.changeTakeNum, formatter: jctLibs.generateTakeNum},
            {field: "take_way", width: "10%", title: "用法", events: jctLibs.changeWay, formatter: jctLibs.generateTakeWay},
            {field: "packing_spec", width: "12%", title: "最小包装规格", events: jctLibs.changeRemark},
            {field: "take_times", width: "15%", title: "频度", events: jctLibs.changeTimes, formatter: jctLibs.generateFreq},
            {field: "drug_num", width: "6%", title: "总量", events: jctLibs.changeTotal, formatter: jctLibs.generateDrugNum},
            //TODO:根据单位修改价格
            {field: "unit", width: "4%", title: "单位"},
            {field: "price", width: "8%", title: "单价", formatter: jctLibs.generateDrugPrice},
            {field: "delete", title: "删除", width: "8%", events: {
                'click .drug_remove': function (e, value, row, index) {
                    var $table = $(e.target).closest("table");
                        $table.bootstrapTable('remove', {
                            field: 'drug_name',
                            values: [row.drug_name]
                        });
                    }
            }, formatter: function (value, row, index) {
                return [
                    '<a class="drug_remove" href="javascript:void(0)" title="Remove">',
                    '<i class="am-icon-remove"></i>',
                    '</a>'
                ].join('');
    }}
        ];
        var recipeView = Backbone.View.extend({
            className: "recipe_wrapper",
            initialize: function () {
                this.pat = new patModel;
            },
            render: function (data) {
                var patInfo = {}, that = this;
                if (data) {
                    patInfo = data.pat || {};
                }
                var temp = Handlebars.compile(recipe);
                var recipeHtml = temp(patInfo);
                $(this.el).html(recipeHtml);
                var $table = $(this.el).find(".recipe_table");
                $table.bootstrapTable({
                    columns: wmedicineColumns,
                    onPostBody: function () {
                        var xy_data= $(that.el).find("#recipe_table").bootstrapTable('getData');
                        if(Array.isArray(xy_data)) {
                            var xy_total = xy_data.reduce(function (a, row) {
                                return a + parseFloat(row['price'] * row['drug_num']);
                            }, 0);
                            $(that.el).find('.xy_cost').val(xy_total.toFixed(2));
                        }
                        var zy_data= $(that.el).find("#zy_table").bootstrapTable('getData');
                        if(Array.isArray(zy_data)) {
                            var zy_total = zy_data.reduce(function (a, row) {
                                return a + parseFloat(row['price'] * row['drug_num']);
                            }, 0);
                            $(that.el).find('.zy_cost').val(zy_total.toFixed(2));
                        }
                        var total = parseFloat($(that.el).find('.xy_cost').val()) + parseFloat($(that.el).find('.zy_cost').val());
                        $(that.el).find('.total_cost').val(total.toFixed(2));
                    }
                });
                $table.find("tr.no-records-found td").hide();
                return this;
            }
        });
        return recipeView;
    });
