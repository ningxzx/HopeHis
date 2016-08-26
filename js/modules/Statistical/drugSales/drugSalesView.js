define(['txt!../../Statistical/drugSales/drugSales.html',
        '../../Statistical/drugSales/drugSalesModel',
        'handlebars', 'backbone', 'bootstrapTable', 'jctLibs'],
    function (Template, drugSalesModel, Handlebars, backbone, jctLibs) {
        var tc_detail = [
            {field: 'item_name', title: '药品大类'},
            {field: 'item_code', title: '药品分类'},
            {field: 'item_size', title: '药品名称'},
            {field: 'item_discount', title: '规格'},
            {field: 'item_actul_fee', title: '数量'},
            {field: 'item_org_total_fee', title: '批发单价'},
            {field: 'item_org_total_fee', title: '批发总价'},
            {field: 'item_org_total_fee', title: '销售单价'},
            {field: 'item_org_total_fee', title: '销售总价'},
            {field: 'item_org_total_fee', title: '利润'},
            {field: 'item_org_total_fee', title: '日期'}
        ];
        var tc_rank = [
            {field: 'item_name', title: '排名'},
            {field: 'item_code', title: '药品大类'},
            {field: 'item_size', title: '药品分类'},
            {field: 'item_num', title: '药瓶名称'},
            {field: 'item_discount', title: '规格'},
            {field: 'item_actul_fee', title: '数量'},
            {field: 'item_org_total_fee', title: '总结(元)'}
        ];
        var otc_detail = [
            {field: 'item_name', title: '药品大类'},
            {field: 'item_code', title: '药品分类'},
            {field: 'item_size', title: '药品名称'},
            {field: 'item_num', title: '购买人'},
            {field: 'item_discount', title: '规格'},
            {field: 'item_actul_fee', title: '数量'},
            {field: 'item_org_total_fee', title: '批发单价'},
            {field: 'item_org_total_fee', title: '批发总价'},
            {field: 'item_org_total_fee', title: '销售单价'},
            {field: 'item_org_total_fee', title: '销售总价'},
            {field: 'item_org_total_fee', title: '利润'},
            {field: 'item_org_total_fee', title: '日期'}
        ];
        var otc_rank = [
            {field: 'item_name', title: '排名'},
            {field: 'item_code', title: '药品大类'},
            {field: 'item_size', title: '药品分类'},
            {field: 'item_num', title: '药瓶名称'},
            {field: 'item_discount', title: '规格'},
            {field: 'item_actul_fee', title: '数量'},
            {field: 'item_org_total_fee', title: '总结(元)'}
        ];
        var drug_sale = [
            {field: 'item_name', title: '排名'},
            {field: 'item_code', title: '药品大类'},
            {field: 'item_size', title: '药品分类'},
            {field: 'item_num', title: '药瓶名称'},
            {field: 'item_discount', title: '规格'},
            {field: 'item_actul_fee', title: '数量'},
            {field: 'item_org_total_fee', title: '总结(元)'}
        ];
        var view = Backbone.View.extend({
                initialize: function () {
                    this.drugSalesModel = new drugSalesModel();

                    this.listenTo(this.drugSalesModel, "searchResult", this.searchResult);
                },
                render: function () {
                    $(this.el).append(Template);

                    this.$el.find("#tc_detail_tbl").bootstrapTable({
                        columns: tc_detail
                    });
                    this.$el.find("#tc_rank_tbl").bootstrapTable({
                        columns: tc_rank
                    });
                    this.$el.find("#otc_detail_tbl").bootstrapTable({
                        columns: otc_detail
                    });
                    this.$el.find("#otc_rank_tbl").bootstrapTable({
                        columns: otc_rank
                    });
                    this.$el.find("#drug_sale_tbl").bootstrapTable({
                        columns: drug_sale
                    });

                    $(this.el).find(".calender").datepicker();
                    $(this.el).find("select").chosen({width: "100%", disable_search_threshold: 100});

                    return this;
                },
                events: {
                    "click .am-btn": "searchDetail"
                },
                searchDetail: function (e) {
                    var Id = $(e.target).attr("table"),
                        $table = $(Id);
                    var data = {
                        searchName: $table.find(".drug_search").val(),
                        start: $table.find(".start_calender").val(),
                        end: $table.find(".end_calender").val(),
                        drugClass: $table.find(".drug_class").val(),
                        table:Id
                    };
                    if ($table == "#otc_rank") {
                        data.buyer = $table.find(".buy_somebody").val()
                    }
                    this.drugSalesModel.searchDrug(data);

                    console.log(data);
                },
                searchResult: function (result) {
                    var data = jctLibs.listToObject(result['data'], "rows")['rows'];
                    $(this.el).find(result.table).bootstrapTable("load", data);
                    console.log(data);
                }
            })
            ;
        return view;
    })
;