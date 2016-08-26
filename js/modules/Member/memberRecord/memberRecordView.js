define(['txt!../../Member/memberRecord/memberRecord.html',
        "../../Member/memberRecord/memberRecordModel",
        'handlebars', 'backbone', '../../Common/basicTable', "jctLibs"],
    function (Template, mRecordModel, Handlebars, backbone, basicTable, jctLibs) {
        var view = Backbone.View.extend({
            initialize: function () {
                this.model = new mRecordModel();

                this.listenTo(this.model, "searchResult", this.recordResult);
            },
            render: function () {
                var that = this;
                $(this.el).append(Template);

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
                $(this.el).find("#record_tbl").bootstrapTable({
                    columns: [
                        {field: "index", title: "序号", formatter: jctLibs.generateIndex},
                        {field: 'member_id', title: '会员编号', width: "18%"},
                        {field: 'patient_name', title: '会员姓名'},
                        {field: 'patient_phone', title: '手机号',width:'10%'},
                        {field: 'wechat_pay', title: '微信金额'},
                        {field: 'ali_pay', title: '支付宝支付'},
                        {field: 'cash_pay', title: '会员卡支付'},
                        {field: 'total_charges', title: '充值总计'},
                        {field: 'charge_date_time', title: '充值时间',width:'15%',formatter:jctLibs.formatDate},
                        {field: 'account_id', title: '操作人'},
                    ],
                    data: []
                });
                this.model.searchRecord();
                return this;
            },
            events: {
                "click #search_btn": "searchBtn"
            },
            searchBtn: function () {
                var param = {};
                var patient_name = $(".member_name").val(),
                    patient_phone = $(".member_phone").val(),
                    user_name = $(".opt_name").val(),
                    account_id = $(".opt_id").val(),
                    patient_id = $(".member_id").val(),
                    start_date_time = $(".start_calender").val();
                if(patient_name){
                    param['patient_name']=patient_name;
                }
                if(patient_phone){
                    param['patient_phone']=patient_phone;
                }
                if(user_name){
                    param['user_name']=user_name;
                }
                if(account_id){
                    param['account_id']=account_id;
                }
                if(patient_id){
                    param['patient_id']=patient_id;
                }
                if(start_date_time){
                    param['start_date_time']=start_date_time;
                }
                this.model.searchRecord(param);
            },
            recordResult: function (result) {
                if (result.errorNo == 0) {
                    $("#record_tbl").bootstrapTable("load", result.data);
                } else {
                    $("#record_tbl").bootstrapTable("load", []);
                }
            }
        });
        return view;
    });
