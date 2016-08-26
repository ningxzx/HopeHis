define(['txt!../../Member/memberStatistics/memberStatistics.html',
        '../../Member/memberStatistics/memberStatisticsModel',
        'handlebars', 'backbone', 'bootstrapTable'],
    function (Template, memberStatisticsModel, Handlebars, backbone) {
        var columns = [

            {field: "index", title: "序号", width: "5%"},
            {field: 'opt', title: '操作'},
            {field: 'customer_id', title: '会员卡号'},
            {field: 'member_level', title: '会员等级'},
            //{field: 'customer_name', title: '会员姓名'},
            {field: 'customer_name', title: '患者姓名'},
            {field: 'customer_tel', title: '消费项目'},
            {field: 'pay_type', title: '消费类型'},
            {field: 'discount', title: '折扣'},
            {field: 'pay_fee', title: '消费金额'},
            {field: 'customer_tel', title: '优惠金额'},
            //{field: 'member_points', title: '会员支付金额'},
            {field: 'member_points', title: '本次积分'},
            {field: 'pay_date_time', title: '消费日期'},
            {field: 'create_oper_name', title: '操作人'},

        ];
        var Integral = [
            {field: "index", title: "序号", width: "5%"},
            {field: 'opt', title: '操作'},
            {field: 'customer_id', title: '会员卡号'},
            {field: 'member_level', title: '会员等级'},
            //{field: 'customer_name', title: '会员姓名'},
            {field: 'customer_name', title: '患者姓名'},
            {field: 'customer_tel', title: '消费项目'},
            {field: 'pay_type', title: '消费类型'},
            {field: 'discount', title: '折扣'},
            {field: 'pay_fee', title: '消费金额'},
            {field: 'customer_tel', title: '优惠金额'},
            //{field: 'member_points', title: '会员支付金额'},
            {field: 'member_points', title: '本次积分'},
            {field: 'pay_date_time', title: '消费日期'},
            {field: 'create_oper_name', title: '操作人'},
        ];
        var view = Backbone.View.extend({
            initialize: function () {
                this.model = new memberStatisticsModel();
                //侦听事件
                this.listenTo(this.model, "getconsumption", this.getConsumption);
                this.listenTo(this.model, "getexchange", this.getExchange);
            },
            events: {

                //"click #Consumption_btn":"ConsumptionBtn",
                //"click #Recharge_btn":"Rechargebtn",
                "click #Integral_btn": "Integralbtn"
            },
            getExchange: function (data) {
                if (data.errorNo == 0) {
                    var arr = data.rows;
                    this.$el.find("#Integral_statistics").bootstrapTable('load', arr);
                }
            },
            Integralbtn: function () {

            },
            getConsumption: function (data) {
                //console.log(data)
                if (data.errorNo == 0) {
                    var arr = data.rows;
                    this.$el.find("#Consumption_statistics").bootstrapTable('load', arr);
                }

            },
            //ConsumptionBtn:function(){
            //    alert()
            //},
            //Rechargebtn:function(){
            //
            //},
            render: function () {
                var that = this;
                $(this.el).html(Template);

                //初始化日期组件,结束日期必须在初始日期以前
                $(this.el).find(".start_calender").datepicker({
                    onRender: function (date, viewMode) {
                        var endDate = $(that.el).find(".end_calender").val();
                        if (endDate) {
                            var inTime = new Date(endDate);
                            var inDay = inTime.valueOf();
                            var inMoth = new Date(inTime.getFullYear(), inTime.getMonth(), 1, 0, 0, 0, 0).valueOf();
                            var inYear = new Date(inTime.getFullYear(), 0, 1, 0, 0, 0, 0).valueOf();
                            // 默认 days 视图，与当前日期比较
                            var viewDate = inDay;

                            switch (viewMode) {
                                // moths 视图，与当前月份比较
                                case 1:
                                    viewDate = inMoth;
                                    break;
                                // years 视图，与当前年份比较
                                case 2:
                                    viewDate = inYear;
                                    break;
                            }

                            return date.valueOf() >= viewDate ? 'am-disabled' : '';
                        }

                    }
                });
                $(this.el).find(".end_calender").datepicker({
                    onRender: function (date, viewMode) {
                        var startDate = $(that.el).find(".start_calender").val();
                        if (startDate) {
                            var inTime = new Date(startDate);
                            var inDay = inTime.valueOf();
                            var inMoth = new Date(inTime.getFullYear(), inTime.getMonth(), 1, 0, 0, 0, 0).valueOf();
                            var inYear = new Date(inTime.getFullYear(), 0, 1, 0, 0, 0, 0).valueOf();
                            // 默认 days 视图，与当前日期比较
                            var viewDate = inDay;

                            switch (viewMode) {
                                // moths 视图，与当前月份比较
                                case 1:
                                    viewDate = inMoth;
                                    break;
                                // years 视图，与当前年份比较
                                case 2:
                                    viewDate = inYear;
                                    break;
                            }

                            return date.valueOf() <= viewDate ? 'am-disabled' : '';
                        }

                    }
                });
                this.$el.find("#Consumption_statistics").bootstrapTable({
                    columns: columns,
                    data: []
                });
                this.$el.find("#Recharge_statistics").bootstrapTable({
                    columns: columns,
                    data: []
                });
                this.$el.find("#Integral_statistics").bootstrapTable({
                    columns: Integral,
                    data: []
                });


                $(this.el).find(".member_level_select").chosen({width: "100%", disable_search_threshold: 100});
                $(this.el).find(".bill_type_select").chosen({width: "100%", disable_search_threshold: 100});
                this.model.getconsumption();
                this.model.getexchange();
                return this;
            },
        });
        return view;
    });
