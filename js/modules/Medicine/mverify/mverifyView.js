define(['txt!../../Medicine/mverify/mverify.html',
        '../../Medicine/mverify/mverifyModel',
        'handlebars', 'backbone', 'bootstrapTable', 'amazeui', 'chosen', 'jctLibs'],
    function (Template, mverifyModel, Handlebars, backbone, bootstrapTable, amazeui, chosen, jctLibs) {
        var columnNames2 = [
            //{field: "", title: "", checkbox: true},
            {
                field: "index", title: "序号", formatter: jctLibs.generateIndex,
                footerFormatter: function (data) {
                    return "合计";
                }
            },
            {field: 'goods_name', title: '货物名称'},
            {field: 'producter', title: '货物生产商'},
            {field: 'goods_spec', title: '货物规格'},
            {field: 'current_num', title: '货物数量'},

            {
                field: 'profit_num', title: '盘点后数量', formatter: function (value, row, index) {
                if (value) {
                    return "<input style='width: 60px; margin-left: 10px;' class='am-form-field small_unit' type='text' value='" + value + "' />";
                } else {
                    return "<input style='width: 60px; margin-left: 10px;' class='am-form-field small_unit' type='text' />";
                }
            }, events: {
                'change .small_unit': function (e, value, row, index) {

                    row.profit_num = $(e.target).closest('.small_unit').val();
                    if (row.profit_num) {
                        //row.profit_num = parseFloat($(".big_unit").val() ? $(".big_unit").val() : 0) + parseFloat($(".small_unit").val() ? $(".small_unit").val() : 0) - parseFloat(row["current_num"]);
                        row.profit_cost = (parseFloat(row.profit_num) * parseFloat(row.goods_cost_price) - parseFloat(row.total_costs)).toFixed(2);
                        row.profit_sell = (parseFloat(row.profit_num) * parseFloat(row.goods_sell_price) - parseFloat(row.total_sell)).toFixed(2);
                        //row.profit_num = data;
                        $("#table_mverify").bootstrapTable("updateRow", {index: index, row: row});

                    } else {
                        //row.profit_num = 0;
                        //row.profit_cost = 0;
                        //row.profit_sell =0;
                        //$("#table_mverify").bootstrapTable("updateRow", {index: index, row: row});
                    }
                }
            }
            },
            //{field: 'good_unit', title: '货物单位'},
            {field: 'goods_cost_price', title: '货物成本'},
            {field: 'goods_sell_price', title: '货物销售价'},
            {
                field: 'total_costs', title: '成本总额', formatter: function (value, row, index) {
                row.total_costs = (parseFloat(row["current_num"]) * parseFloat(row["goods_cost_price"])).toFixed(2);
                return (row.total_costs);
            }, footerFormatter: function (data) {
                return data.reduce(function (pre, current) {
                    return (pre + parseFloat(current["total_costs"]));
                }, 0)
            }
            },
            //{field: 'total_costs', title: '成本总额', formatter:totalCost},
            {
                field: 'total_sell', title: '销售总额', formatter: function (value, row, index) {
                row.total_sell = (parseFloat(row["current_num"]) * parseFloat(row["goods_sell_price"])).toFixed(2);
                return (row.total_sell);
            }, footerFormatter: function (data) {
                return data.reduce(function (pre, current) {
                    return (pre + parseFloat(current["total_sell"]));
                }, 0)
            }
            },
            {field: 'profit_cost', title: '盈亏批发额', footerFormatter:function (data) {
                return '<span class="footerTotal">'+data.reduce(function(pre, current){
                        return pre+ ((+current['profit_cost'])||0);
                    },0).toFixed(2)+'</span>'
            }},
            {field: 'profit_sell', title: '盈亏销售额', footerFormatter:function (data) {
                return '<span class="footerTotal">'+data.reduce(function(pre, current){
                        return pre+ ((+current['profit_sell'])||0);
                    },0).toFixed(2)+'</span>'
            }},

        ];
        var mverifyView = Backbone.View.extend({
            initialize: function () {
                this.mvModel = new mverifyModel();
                this.listenTo(this.mvModel, "getrendeMy", this.getRendeMy);
                this.listenTo(this.mvModel, 'postSubmission', this.refreshLevel)
            },
            getRendeMy: function (data) {
                //console.log(data)
                if (data.errorNo == 0) {
                    $(this.el).find("#table_mverify").bootstrapTable('load', data.rows.dataList);
                }

            },
            render: function () {
                $(this.el).html(Template);
                $(this.el).find("input[type='radio']").uCheck();
                $(this.el).find("#med_class").chosen({
                    width: "100%",
                    disable_search_threshold: 100
                });
                $(this.el).find("#table_mverify").bootstrapTable({
                    columns: columnNames2,
                    sortName: 'goods_name',
                    sorter: function (a, b) {
                        return parseInt(a) > parseInt(b);
                    },
                    data: [],
                    //showFooter: true,
                    pageSize: 5,
                    pagination: true,
                    pageList: [5],
                    rowStyle: function rowStyle(row, index) {
                        if (row['profit_cost'] < 0) {
                            return {
                                css: {"color": "red"}
                            }
                        }
                        else if (row['profit_cost'] > 0) {
                            return {
                                css: {"color": "green"}
                            }
                        }
                        else {
                            return {
                                css: {"color": "black"}
                            }
                        }
                    }
                });
                $(this.el).find("#pdtime").datepicker();
                $(this.el).find(".am-g :checkbox").uCheck('enable');
                this.mvModel.getrendeMy();

                return this;
            },
            events: {
                "click #show_range": "showRange",
                "click #mv_sub": "mvsub",
                "click #refresh_level": "refreshLevel"
            },
            refreshLevel: function () {
                this.mvModel.getrendeMy();
            },
            mvsub: function () {
                var data = $(this.el).find("#table_mverify").bootstrapTable('getData');
                data.forEach(function (row) {
                    row['profit_num'] = row['profit_num'] || row['current_num'];
                })
                this.mvModel.postSubmission('', data);
            },
            showRange: function () {
                if ($("[name='range']").hasClass("hid")) {
                    $("[name='range']").removeClass("hid");
                    $("#show_range").text("隐藏排序");
                } else {
                    $("[name='range']").addClass('hid');
                    $("#show_range").text("显示排序");
                }
            }
        });
        return mverifyView;
    });
