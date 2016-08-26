define(['txt!../../Medicine/purchaseReturn/purchaseReturn.html',
        'handlebars','backbone','jctLibs','bootstrapTable'],
    function (Template,Handlebars,backbone,jctLibs){
        var view = Backbone.View.extend({
            render:function() {
                var that=this;
                $(this.el).html(Template);

                //初始化日期组件,结束日期必须在初始日期以前
                $(this.el).find(".start").datepicker({
                    onRender: function (date, viewMode) {
                        var endDate = $(that.el).find(".end").val();
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
                $(this.el).find(".end").datepicker({
                    onRender: function (date, viewMode) {
                        var startDate = $(that.el).find(".start").val();
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
                $(this.el).find("#Purchasereturn_tbl").bootstrapTable({
                    columns: [
                        {field: "", title: "", checkbox: true},
                        {field: "index", title: "序号", width: "5%", formatter: jctLibs.generateIndex},
                        {field: 'batch_no', title: '批次号'},
                        {field: 'recipient_person_name', title: '入库员'},
                        {field: 'suppliers_name', title: '供应商'},
                        {field: 'goods_total_costs', title: '货物总费用'},
                        {field: 'need_pay_costs', title: '应付费用'},
                        {field: 'charge_costs', title: '实付费用'},
                        {field: 'storate_date', title: '入库时间', width: '10%'},
                        {field: 'review_date_time', title: '审核时间'},
                        {field: 'review_name', title: '审核人'},
                        {field: 'review_result', title: '审核状态', },
                    ],
                    data: [],
                });
                return this;
            }
        });
        return view;
    });
