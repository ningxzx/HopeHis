define(['txt!../../Statistical/yearReport/yearReport.html',
        '../../Statistical/statisticalModel',
        "chart",
        'handlebars', 'backbone', 'bootstrapTable'],
    function (Template, statisticalModel, chart, Handlebars, backbone) {

        var MonthlyStatistics = [
            {field: 'timeKeyValue', title: '月度',width:'15%'},
            {field: 'diagnosis_nums', title: '就诊人次'},
            //{field:'item_size',title:'应收金额'},
            {field: 'cash_pay', title: '现金收入'},
            {field: 'recharge_card_pay', title: '会员支付'},
            {field: 'social_security_pay', title: '医保卡支付'},
            {field: 'wechat_pay', title: '微信支付'},
            {field: 'ali_pay', title: '支付宝支付'},
            //{field:'item_size',title:'优惠金额'},
            // {field: 'credit_pay', title: '赊账金额'},
            //{field:'item_discount',title:'还款金额'},
            //{field:'item_name',title:'舍入金额'},
            {field: 'total_charges', title: '总收入'},
        ];

        var annualStatistics = [
            {field: 'timeKeyValue', title: '年度'},
            {field: 'total_charges', title: '总收入'},
            {field: 'cash_pay', title: '现金收入'},
            {field: 'recharge_card_pay', title: '会员支付'},
            {field: 'social_security_pay', title: '医保卡支付'},
            {field: 'wechat_pay', title: '微信支付'},
            {field: 'ali_pay', title: '支付宝支付'},
            {field: 'diagnosis_nums', title: '就诊人次'},
            //{field:'item_discount',title:'所占年度比例'},

        ];

        var view = Backbone.View.extend({
            render: function () {
                var $el = $(this.el), _this = this;
                var a = new Date(), m = a.getMonth() + 1, year = a.getFullYear(), d = a.getDate();
                $(this.el).append(Template);
                this.$el.find("#Monthly_statistics").bootstrapTable({
                    columns: MonthlyStatistics,
                    data: []
                });
                this.$el.find("#annual_statistics").bootstrapTable({
                    columns: annualStatistics,
                    data: []
                });
                $(this.el).find("select").chosen({width: "100%", disable_search_threshold: 100});
                var param={};
                param['start_date_time']=year + '-' + 1 + '-' + 1;
                param['end_date_time']=year + '-' + m + '-' + d;
                this.model.getrendeMy(param);
                this.model.getYear(year);
                $(this.el).find('.chart_wrapper').hide();
                return this;
            },
            initialize: function () {
                this.model = new statisticalModel();

                this.listenTo(this.model, "getrendeMy", this.GetrendeMy);
                this.listenTo(this.model, "getYear", this.GetYear);
            },
            GetYear: function (data) {
                $(this.el).find("#annual_statistics").bootstrapTable("load", data.rows);
            },
            GetrendeMy: function (data) {
                $(this.el).find("#Monthly_statistics").bootstrapTable("load", data.rows);
                var srcData=data.rows.map(function (month) {
                    var arr=month['timeKeyValue'].split('-');
                    arr[1]=arr[1]-1;
                    return [Date.UTC.apply(null,arr),month['total_costs']];
                })
                $(this.el).find("#chart").highcharts({
                    chart: {
                        zoomType: 'x'
                    },
                    title: {
                        text: '医脉 <span style="color: red">月度收入</span> 数据统计'
                    },
                    subtitle: {
                        text: document.ontouchstart === undefined ?
                            '点击并拖拽可进入相应区间' : 'Pinch the chart to zoom in'
                    },
                    xAxis: {
                        type: 'datetime'
                    },
                    yAxis: {
                        title: {
                            text: '收入'
                        },
                        floor:0
                    },
                    legend: {
                        enabled: false
                    },
                    plotOptions: {
                        area: {
                            fillColor: {
                                linearGradient: {
                                    x1: 0,
                                    y1: 0,
                                    x2: 0,
                                    y2: 1
                                },
                                stops: [
                                    [0, Highcharts.getOptions().colors[0]],
                                    [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                                ]
                            },
                            marker: {
                                radius: 2
                            },
                            lineWidth: 1,
                            states: {
                                hover: {
                                    lineWidth: 1
                                }
                            },
                            threshold: null
                        }
                    },

                    series: [{
                        type: 'area',
                        name: '统计数量',
                        data: srcData
                    }]
                });

            },
            events: {
                "click #Monthly_btn": "MonthlyBtn",
                "click #annual_btn": "annualBtn",
                "click #show_graphic":"showGraphic",
                "click .month_panel .refresh_tool":"MonthlyBtn",
                "click .year_panel .refresh_tool":"annualBtn"
            },
            showGraphic: function () {
                $('.chart_wrapper').toggle();
                $('.table_wrapper').toggle();
            },
            annualBtn: function () {
                var curYear=(new Date()).getFullYear();
                var year = $(this.el).find("#ddlYears").val();
                this.model.getYear(year||curYear);
            },
            MonthlyBtn: function () {
                var start = $(this.el).find(".start").val(), end = $(this.el).find(".end").val(),param={};
                if(start){
                    param['start_date_time']=start;
                }
                if(end){
                    param['end_date_time']=end;
                }
                if(!start&&!end){
                    var a = new Date(), m = a.getMonth() + 1, year = a.getFullYear(), d = a.getDate();
                    param['start_date_time']=year + '-' + 1 + '-' + 1;
                    param['end_date_time']=year + '-' + m + '-' + d;
                }
                this.model.getrendeMy(param);
            }
        });
        return view;
    });
