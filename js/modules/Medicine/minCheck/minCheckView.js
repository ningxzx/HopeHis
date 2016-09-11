define(['txt!../../Medicine/minCheck/minCheck.html',
        '../../Medicine/minStorage/inStorageModel',
        '../../Common/commonModel',
        '../../Medicine/minCheck/minCheckModel',
        'handlebars', 'backbone', 'bootstrapTable', "amazeui", "chosen", "jctLibs"],
    function (Template, inStorageModel, commonModel,minCheckModel, Handlebars, backbone, bt, ai, chosen, jctLibs) {
        var opt = function (value, row, index) {
            var arr = [
                '<a class="search_detail" href="javascript:void(0)" title="明细">',
                '明细',
                '</a>  '
            ];
            if (row['review_result'] == '00') {
                arr = arr.concat(['<a class="row_check" href="javascript:void(0)" title="审核">',
                    '审核',
                    '</a>  '])
            }
            return arr.join('');
        };

        function showState(value, row, index) {
            var state = {'00': '未审核', '10': '已通过', '20': '未通过'};
            return state[value];
        }

        var view = Backbone.View.extend({
            initialize: function () {
                //绑定入库记录集合
                this.inModel = new inStorageModel();
                this.model = new minCheckModel();
                this.commonModel=new commonModel();

                //侦听事件
                this.listenTo(this.inModel, "getResult", this.renderRecopient);
                this.listenTo(this.commonModel, "getRecord", this.renderRecord);
                this.listenTo(this.model, "getCheckRecords", this.renderRecord);
                this.listenTo(this.model, "getRecordDetails", this.renderDetail);
                this.listenTo(this.model, "getConfirmation", this.Confirmation);
            },
            Confirmation: function (res) {
                if(res.state!=='100') {
                    alert('审核失败')
                }
                $(this.el).find("#alert_modal").modal('close');
                this.inModel.getRecopient();
                this.model.getCheckRecord();
                //this.commonModel.search('admin.storate_record',{enterprise_id:sessionStorage.getItem('enterprise_id')},'getRecord');
            },
            events: {
                "click #search_storage": "searchCheck",
                "click .refresh_level": "searchCheck"
            },
            searchCheck: function () {
                var batchNo = $('#batch_no').val(),
                    startDate = $('.start_calender').val(),
                    endDate = $('.end_calender').val(),
                    state = $('#check_state').val(),
                    data = {};
                if (state !== 'all') {
                    data['review_result'] = state;
                }
                if (batchNo) {
                    data['batch_no'] = batchNo;
                }
                if (startDate) {
                    data['start_date_time'] = startDate;
                }
                if (endDate) {
                    data['end_date_time'] = endDate;
                }
                this.model.getCheckRecord(data);
                //this.commonModel.search('admin.storate_record',data,'getRecord');
            },
            renderRecopient: function (res) {
                if (res.errorNo === 0&&res.rows.length) {
                    res.rows.forEach(function (person) {
                        jctLibs.appendToChosen($("#recipient_person"), person['account_id'], person['user_name'])
                    })
                    $(this.el).find("#recipient_person").trigger("chosen:updated")
                }
            },
            renderRecord: function (result) {
                console.log(result)
                if (result.errorNo === 0) {
                    var records = result.rows;
                    $(this.el).find("#table_minStorage").bootstrapTable("load", records);
                }
                else {
                    $(this.el).find("#table_minStorage").bootstrapTable("load", []);
                }
                $(this.el).find("#detail_panel").addClass('am-hide');
            },
            renderDetail: function (res) {
                if (res.errorNo == 0) {
                    $(this.el).find("#detail_panel").removeClass('am-hide');
                    $(this.el).find("#table_minStorage_detail").bootstrapTable('load', res.rows)
                }
            },
            render: function () {
                var that = this;
                $(this.el).html(Template);
                $(this.el).find("input[type='checkbox'], input[type='radio']").uCheck();
                $(this.el).find("#recipient_person").chosen({width: "100%", disable_search_threshold: 100});
                $(this.el).find("#check_state").chosen({width: "100%", disable_search_threshold: 100});

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
                $(this.el).find("#table_minStorage").bootstrapTable({

                    columns: [
                        // {field: "", title: "", checkbox: true},
                        {field: "index", title: "序号", width: "5%", formatter: jctLibs.generateIndex},
                        {
                            field: 'opt', title: '操作', width: "15%", formatter: opt, events: {
                            "click .search_detail": function (e, value, row, index) {
                                that.model.getRecordDetail(row['record_id']);
                                $(that.el).find("#alert_info").modal({ width:960,});
                            },
                            "click .row_check": function (e, value, row, index) {
                                $(that.el).find("#submitCheck").off('click').on('click', function () {
                                    var link = $(that.el).find("input:radio:checked").val(),
                                        arr = [{
                                            review_memo: $("#Description_text").val(),
                                            order_no: row['record_id'],
                                            batch_no: row['batch_no']
                                        }];
                                    that.model.getConfirmation(link, arr);
                                })
                                $(that.el).find("#alert_modal").modal();
                            }
                        }
                        },
                        {field: 'batch_no', title: '批次号',width: "15%",},
                        {field: 'recipient_person_name', title: '入库员'},
                        {field: 'suppliers_name', title: '供应商',width: "20%"},
                        {field: 'need_pay_costs', title: '应付费用' },
                        {field: 'charge_costs', title: '实付费用'},
                        {field: 'storate_date', title: '入库时间', width: "10%",formatter:jctLibs.formatDate},
                        {field: 'review_date_time', title: '审核时间', width: "10%",formatter:jctLibs.formatDate},
                        {field: 'review_name', title: '审核人' },
                        {field: 'review_result', title: '审核状态', formatter: showState, width: "8%"},
                        {field: 'memo', title: '说明', width: "8%"},
                    ],
                    data: [],
                    sortName:'review_result',
                    //sortOrder:'desc',
                    rowStyle: function rowStyle(row, index) {
                        if (row['review_result'] == '00') {
                            return {
                                css: {"color": "red"}
                            }
                        }
                        else if (row['review_result'] == '20') {
                            return {
                                css: {"color": "orange"}
                            }
                        }
                        else {
                            return {
                                css: {"color": "black"}
                            }
                        }
                    }
                });

                $(this.el).find("#table_minStorage_detail").bootstrapTable({
                    columns: [
                        {field: "index", title: "序号",width: "5%",  formatter: jctLibs.generateIndex},
                        {field: 'goods_name',width: "20%", title: '名称'},
                        //{field: 'goods_type',width: "10%", title: '类型'},
                        //{field: 'goods_spec',width: "10%", title: '规格'},
                        {field: 'drug_type',width: "10%", title: '类别'},
                        {field: 'min_packing_unit',width: "10%", title: '单位'},
                        {field: 'producter_name',width: "10%", title: '生产厂家名称'},
                        {field: 'original_total_num',width: "5%", title: '应收总数'},
                        {field: 'actual_total_num',width: "5%",  title: '实收总数'},
                        //{field: 'max_packing_unit', title: '包装规格单位'},
                        //{field: 'max_packing_num', title: '包装规格数量'},
                        {field: 'total_charge_costs',width: "5%", title: '总费用'},
                        {field: 'unit_price',width: "5%", title: '成本单价'},
                        {field: 'storate_batch_no',width: "10%",  title: '入库批次'},
                        //{field: 'product_date_time', width: "10%", title: '生产日期'},
                        //{field: 'deadline_date_time', width: "10%", title: '失效日期'},
                        {field: 'user_name',width: "10%",  title: '入库员'},
                        {field: 'storate_date',width: "10%",  title: '入库时间'}
                    ],
                    data: [],
                    pageSize:5,
                    pagination:true,
                });
                this.inModel.getRecopient();
                this.model.getCheckRecord();
                //this.commonModel.search('admin.storate_record',{enterprise_id:sessionStorage.getItem('enterprise_id')},'getRecord');
                return this;
            },
        });
        return view;
    })
;
