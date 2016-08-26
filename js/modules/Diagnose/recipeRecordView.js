define(['txt!../Diagnose/recipeRecord.html',
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
            {field: "group_no", width: "5%", title: "组号"},
            {field: "take_spec", width: "8%", title: "单次用量"},
            {field: "take_way", width: "10%", title: "用法"},
            {field: "packing_spec", width: "12%", title: "最小包装规格"},
            {field: "take_times", width: "15%", title: "频度"},
            {field: "drug_num", width: "6%", title: "总量"},
            //TODO:根据单位修改价格
            {field: "unit", width: "4%", title: "单位"},
            {field: "price", width: "8%", title: "单价", formatter: jctLibs.generateDrugPrice},
            {
                field: "", title: "删除", width: "8%", events: {
                'click .table_remove': function (e, value, row, index) {
                    var $table = $(e.target).closest("table");
                    $table.bootstrapTable('remove', {
                        field: 'drug_name',
                        values: [row.drug_name]
                    });
                }
            }, formatter: jctLibs.deleteFormatter
            }
        ];
        var wmedicineColumns2 = [
            {field: "", title: "序号", width: "5%", formatter: jctLibs.generateIndex},
            {field: "drug_name", width: "13%", title: "名称"},
            //{field: "group_no", width: "5%", title: "组号"},
            //{field: "take_spec", width: "8%", title: "单次用量"},
            //{field: "take_way", width: "10%", title: "用法"},
            //{field: "packing_spec", width: "12%", title: "最小包装规格"},
            //{field: "take_times", width: "15%", title: "频度"},
            {field: "drug_num", width: "6%", title: "总量"},
            //TODO:根据单位修改价格
            //{field: "unit", width: "4%", title: "单位"},
            {field: "price", width: "8%", title: "单价", formatter: jctLibs.generateDrugPrice},
            {
                field: "", title: "删除", width: "8%", events: {
                'click .table_remove': function (e, value, row, index) {
                    var $table = $(e.target).closest("table");
                    $table.bootstrapTable('remove', {
                        field: 'drug_name',
                        values: [row.drug_name]
                    });
                }
            }, formatter: jctLibs.deleteFormatter
            }
        ];
        var recipeRecordView = Backbone.View.extend({
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
                var $table = $(this.el).find(".recipe_record_table");
                $table.bootstrapTable({
                    columns: wmedicineColumns,
                    //data:[{}]
                });
                $(this.el).find(".recipe_table").bootstrapTable({
                    columns: wmedicineColumns2,
                });
                $table.find("tr.no-records-found td").hide();
                return this;
            }
        });
        return recipeRecordView;
    });
