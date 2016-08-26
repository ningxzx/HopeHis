/**
 * Created by xzx on 2016-05-24.
 */
define(['txt!../../Bill/retailDrugRecord/retailDrugRecord.html',
        '../../Common/commonModel',
    '../../Bill/retailDrugRecord/retailDrugRecordModel',
        'jquery', 'jctLibs', 'backbone', 'bootstrapTable'],
    function (Template, commonModel,retailDrugRecordModel, $, jctLibs, backbone) {
        var formatRegFee = function (value, row) {
            return value || '无'
        }
        var formatOpt = function (value, row, index) {
            return [
                '<a class="search_detail" href="javascript:void(0)" title="detail">',
                '明细',
                '</a>  ',
            ].join('');
        };
        var view = backbone.View.extend({
            initialize: function () {
                this.commonModel = new commonModel();
                this.modelRetail = new retailDrugRecordModel();
                this.listenTo(this.commonModel, "searchinfo", this.Searchinfo);
                this.listenTo(this.modelRetail, "getrender", this.GetRender);
            },
            Searchinfo:function(data){
                //console.log(data)
                $(this.el).find("#retail_detail_tbl").bootstrapTable('load',data.rows);
            },
            GetRender:function(data){

                var arr=data['rows'].dataList;
                //console.log(arr);
                $(this.el).find("#retail_tbl").bootstrapTable('load', arr)
            },
            render: function () {
                var _this = this;
                $(this.el).html(Template);
                //初始化日期组件,结束日期必须在初始日期以前
                $(this.el).find(".start").each(function (i, elem) {
                    $(elem).datepicker({
                        onRender: function (date, viewMode) {
                            var endDate = $($(_this.el).find(".end")[i]).val()
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
                    })
                });
                $(this.el).find(".end").each(function (i, elem) {
                    $(elem).datepicker({
                        onRender: function (date, viewMode) {
                            var startDate = $($(_this.el).find(".start")[i]).val();
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
                    })
                });
                $(this.el).find("#retail_tbl").bootstrapTable({
                    columns: [
                        {field: 'sell_order_no', title: '销售票号',width:'15%'},
                        {field: 'patient_name', title: '患者姓名',width:'10%'},
                        {field: 'member_id', title: '会员号',width:'15%'},
                        {field: 'discount', title: '折扣', formatter: formatRegFee,width:'5%'},
                        {field: 'original_total_charges', title: '应收金额',width:'5%'},
                        {field: 'actual_total_charges', title: '实收金额',width:'5%'},
                        {field: 'cash_pay', title: '现金收入',width:'5%'},
                        {field: 'wechat_pay', title: '微信收入',width:'5%'},
                        {field: 'ali_pay', title: '支付宝收入',width:'5%'},
                        {field: 'heath_card_pay', title: '医保收入',width:'5%'},
                        {field: 'recharge_card_pay', title: '会员余额收入',width:'5%'},
                        {field: 'sell_date_time', title: '销售日期',width:'15%',sortable:true},
                        {field: 'operation', title: '操作', formatter: formatOpt,events:{
                            "click .search_detail": function (e, value, row, index) {
                                var data={
                                    'enterprise_id': sessionStorage.getItem('enterprise_id'),
                                    'sell_order_no':row.sell_order_no
                                };
                                $(_this.el).find("#retail_detail_wrapper").removeClass('am-hide');
                                _this.commonModel.search("trading.drug_sell_detail",data,"searchinfo");
                                //this.commonModel.search('comm.suppliers_dict', {'enterprise_id': sessionStorage.getItem('enterprise_id')}, 'getSupplier')

                            }
                        }}
                    ],
                    sortName:'sell_date_time',
                    sortOrder:'desc',
                    pagination:true,
                    pageSize:5,
                    data: []
                });
                $(this.el).find("#retail_detail_tbl").bootstrapTable({
                    columns: [
                        //{field: "checked", title: "", checkbox: true},
                        {field: 'drug_name', title: '药品名称'},
                        {field: 'drug_spec', title: '药品规格'},
                        //{field: 'producter_name', title: '产商', width: '30%'},
                        {field: 'sell_num', title: '销售数量'},
                        {field: 'unit_price', title: '单价'},
                        {field: 'original_total_charges', title: '应收总金额'},
                        {field: 'actual_total_charges', title: '实收总金额'},
                    ],
                    data: [{}],
                    pagination:true,
                    pageSize:5,
                });
                //this.model.searchRetail();
                this.modelRetail.getrender();
                return this;
            },
            events: {
                "click #search_retail_record": "searchRetail",
            },

            searchRetail: function () {
                var name = $('#pat_name').val(),
                    medicineName = $('#medicine_name').val(),
                    startTime = $('.start').val(),
                    endTime = $('.end').val();
                this.modelRetail.getrender(name,medicineName,startTime,endTime);

            },
        });
        return view;
    });

