define(['txt!../../Medicine/mWarning/mWarning.html',
        '../../Medicine/mWarning/mWarningModel',
        '../../Common/commonModel',
        'handlebars', 'backbone', 'bootstrap', 'bootstrapTable', "amazeui", "chosen", "jctLibs", "bt_switch"],
    function (Template, mWarningModel,commonModel, Handlebars, backbone, b, bt, ai, chosen, jctLibs, bt_switch) {
        var view = Backbone.View.extend({
                initialize: function () {
                    //绑定入库记录集合
                    this.Model = new mWarningModel();
                    this.commonModel = new commonModel();

                    //侦听事件
                    this.listenTo(this.Model, "getDrugmwarning", this.renderDetail);
                    this.listenTo(this.Model, "minStorageResult", this.minStorageResult);
                    this.listenTo(this.Model, "stockResult", this.stockResult);
                    this.listenTo(this.Model, "fsPost", this.postCallback);
                    this.listenTo(this.Model, "getSetting", this.renderSetting);
                    this.listenTo(this.commonModel, "getSupplier", this.getCallBack)
                },
                getCallBack: function (res) {
                    $('#supplier').html("");
                    if (res.errorNo == 0) {
                        var rows=res.rows;
                        rows.forEach(function(row){
                            jctLibs.appendToChosen($('#supplier'),row['suppliers_name'],row['suppliers_name'])
                        })
                    }
                    else {}
                },
                minStorageResult: function (result) {
                    if (result.errorNo == "0") {
                        this.Model.getDrugmwarning();
                    } else {
                        alert("报损失败，请重试");
                    }
                },
                stockResult: function (result) {
                    if (result.errorNo == "0") {
                        this.Model.getDrugmwarning();
                    } else {
                        alert("报损失败，请重试");
                    }
                },
                renderDetail: function (data) {
                    if (data) {
                        var data = data.rows;
                        for (var i = 0; i < data.length; i++) {
                            if (data[i].goods_type == 10) {
                                data[i].goods_type = '中药';
                            } else if (data[i].goods_type == 20) {
                                data[i].goods_type = '西药';
                            } else if (data[i].goods_type == 30) {
                                data[i].goods_type = '医疗器械';
                            }

                            if (data[i].goods_way == 10) {
                                data[i].goods_way = '采购入库';
                            } else if (data[i].goods_way == 20) {
                                data[i].goods_way = '自定义添加';
                            }
                        }
                        $(this.el).find("#table_minStorage").bootstrapTable('load', data);

                        $(this.el).find("#Stock_Tbl").bootstrapTable('load', data);
                    }

                },
                renderSetting: function (res) {
                    var $el=$(this.el);
                    if (res.errorNo == 0) {
                        var warningSets = res['setting'];
                        if (warningSets&&warningSets['FUN0002']) {
                            var sets = warningSets['FUN0002'],
                                dateState = sets['DATE']['status'],
                                numState = sets['NUM']['status'];
                            $el.find('#user_phone').val(sets['TEL']);
                           if(sets['TEL']!=""){
                               $('#phone_section').addClass("form-section-active")
                           }
                           $el.find('#out_num').val(sets['NUM']['num']);
                            $el.find('#diy_date').removeClass('am-hide');
                            $el.find('#diy_date .out_calender').val(sets['DATE']['out_date']);
                            $el.find('#switch_time_warning').bootstrapSwitch('state', dateState);
                            $el.find('#switch_num_warning').bootstrapSwitch('state', numState);
                            this.toggleTimeWarning();
                            this.toggleNumWarning();
                            $el.find('#out_date_type').val('all').trigger('chosen:updated');
                            if(dateState||numState){
                                $el.find('#show_warning_info').removeClass('am-btn-danger').addClass('am-btn-success').html('已设置自动预警提示');
                            }
                            else{
                                $el.find('#show_warning_info').removeClass('am-btn-success').addClass('am-btn-danger').html('开启自动预警提示');
                            }
                        }
                    }
                },
                events: {
                    "click #search_btn": "searchBtn",
                    "change #recipient_person": "recipientPerson",
                    "change #Stock_early": "recipientPerson",
                    "click #searchBtn": "searchBtn",
                    "click .am-tabs ul li": "amTabs",
                    "click .refresh_level": "refreshlevel",
                    "click .refresh_level2": "refreshlevel",
                    'click #show_warning_info': 'showWarningInfo',
                    "click #post_setting": "postSetting",
                    "focus #user_phone": "showPlaceHolder",
                    "blur #user_phone": "hidePlaceHolder",
                    "change #out_date_type": "showOutDate",
                    "switchChange.bootstrapSwitch #switch_time_warning": "toggleTimeWarning",
                    "switchChange.bootstrapSwitch #switch_num_warning": "toggleNumWarning",
                },
                toggleTimeWarning: function () {
                    var state = $('#switch_time_warning').bootstrapSwitch('state'),
                        $wrapper = $('#out_date_type_wrapper'),
                        $datepicker = $('#diy_date');
                    if (state) {
                        $wrapper.removeClass('am-hide');
                        $('#out_date_type').val(7).trigger('chosen:updated');
                    }
                    else {
                        $wrapper.addClass('am-hide');
                        $datepicker.addClass('am-hide');
                    }
                },
                toggleNumWarning: function () {
                    var state = $('#switch_num_warning').bootstrapSwitch('state'),
                        $wrapper = $('#out_num_wrapper');
                    if (state) {
                        $wrapper.removeClass('am-hide');
                    }
                    else {
                        $wrapper.addClass('am-hide');
                    }
                },
                showOutDate: function () {
                    var dateType = $('#out_date_type').val();
                    if (dateType == 'all') {
                        $('#diy_date').removeClass('am-hide')
                    }
                    else {
                        $('#diy_date').addClass('am-hide')
                    }
                },
                showPlaceHolder: function () {
                    $('#phone_section').addClass("form-section-focus").addClass("form-section-active")
                },
                hidePlaceHolder: function () {
                    var phone = $('#user_phone').val().trim();
                    if (phone == '' || !phone) {
                        $('#phone_section').removeClass("form-section-focus").removeClass("form-section-active");
                    }
                    else {
                        $('#phone_section').removeClass("form-section-focus")
                    }
                },
                postSetting: function () {
                    var dateStr = "", dateType = $('#out_date_type').val(), tempDate = new Date();
                    if (dateType == 'all') {
                        dateStr = $('#diy_date').val();
                    }
                    else {
                        dateStr = jctLibs.getDateStr(new Date(tempDate.setDate(tempDate.getDate() + parseInt(dateType))));
                    }
                    this.Model.postSetting({
                        enterprise_id: sessionStorage.getItem('enterprise_id'),
                        setting_result: JSON.stringify({
                            'FUN0002': {
                                "DATE": {
                                    status: $('#switch_time_warning').bootstrapSwitch('state'),
                                    out_date: dateStr
                                },
                                "NUM": {
                                    status: $('#switch_num_warning').bootstrapSwitch('state'),
                                    num: $('#out_num').val() || 20
                                },
                                "TEL": $('#user_phone').val() || ""
                            }
                        })
                    })
                },
                postCallback: function (res) {
                    if (res.status == 'OK') {
                        $('#warning_info').modal('close');
                        this.Model.getSetting();
                        alert('自动预警设置成功！')
                    }
                },
                showWarningInfo: function () {
                    $('#warning_info').modal({
                        closeViaDimmer: false,
                        width: 960
                    })
                },
                refreshlevel: function () {
                    this.Model.getDrugmwarning();
                },
                recipientPerson: function (e) {
                    var $target = $(e.target),
                        $start = $target.closest('.warning_search_wrapper').find('.start_calender'),
                        $end = $target.closest('.warning_search_wrapper').find('.end_calender');
                    var data = $(this.el).find("#recipient_person").val();
                    //var data2=$(this.el).find("#Stock_early").val();

                    time(data);

                    function time(data) {
                        var a = new Date(),
                            y = a.getFullYear(),
                            m = a.getMonth() + 1,
                            d = a.getDate();
                        var nowTemp = new Date();
                        var nowDay = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0).valueOf();
                        var nowMoth = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), 1, 0, 0, 0, 0).valueOf();
                        var nowYear = new Date(nowTemp.getFullYear(), 0, 1, 0, 0, 0, 0).valueOf();
                        if (data == 'all') {
                            $start.datepicker('setValue', 0);
                            var newD = nowDay + 7 * 24 * 60 * 60 * 1000000;
                            $end.datepicker('setValue', newD);
                        } else if (data == '1') {
                            $start.datepicker('setValue', nowDay);
                            var newD = nowDay + 7 * 24 * 60 * 60 * 1000;
                            $end.datepicker('setValue', newD);
                        } else if (data == '2') {
                            $start.datepicker('setValue', nowMoth);
                            var newD = a.setFullYear(y, m, 1);
                            $end.datepicker('setValue', newD);
                        } else if (data == '3') {
                            $start.datepicker('setValue', nowMoth);
                            var newD = a.setFullYear(y, m + 1, 1);
                            $end.datepicker('setValue', newD);
                        } else if (data == '4') {
                            $start.datepicker('setValue', nowMoth);
                            var newD = a.setFullYear(y, m + 5, 1);
                            $end.datepicker('setValue', newD);
                        }
                    }
                },
                searchBtn: function (e) {
                    var $target = $(e.target);
                    var $start = $target.closest("button").attr("id");
                    var goodsname, goodstype, storatebatchno, stockSt, stockEd;

                    if ($start == 'search_btn') {
                        var stat = $(this.el).find(".start_calender").val(),
                            end = $(this.el).find(".end_calender").val(),
                            suppliersname = $(this.el).find("#supplier").val(),
                        goodsname = $(this.el).find("#medicine_name").val();
                        goodstype = $(this.el).find("#medicine_type").val();
                        storatebatchno = $(this.el).find("#batch_no").val();
                    } else if ($start == 'searchBtn') {
                        goodsname = $(this.el).find("#Stock_name").val();
                        goodstype = $(this.el).find("#Stock_type").val();
                        storatebatchno = $(this.el).find("#Stock_no").val();
                        //stockcbox=$(this.el).find("#stock_cbox").val();
                        stockSt = $(this.el).find(".stock-start").val();
                        stockEd = $(this.el).find(".stock-end").val();
                    }
                    this.Model.getDrugmwarning(stat, end, goodsname, goodstype, storatebatchno, suppliersname, stockSt, stockEd);
                },
                render: function () {
                    var that = this;
                    $(this.el).html(Template);
                    $(this.el).find("input[type='checkbox'], input[type='radio']").uCheck();
                    $(this.el).find("select").chosen({width: "100%", disable_search_threshold: 100});
                    $(this.el).find(".out_calender").datepicker();

                    //默认查询
                    this.Model.getDrugmwarning();
                    $(this.el).find("#table_minStorage").bootstrapTable({
                        columns: [
                            {field: "", title: "", checkbox: true},
                            {field: "index", title: "序号", width: "5%", formatter: jctLibs.generateIndex},
                            {
                                field: 'opt', title: '操作', width: "5%", formatter: function () {
                                return [
                                    '<a class="minStorage_bad" href="javascript:void(0)" title="minStorage_bad">',
                                    '报损',
                                    '</a>'
                                ].join("");
                            }, events: {
                                'click .minStorage_bad': function (e, value, row, index) {
                                    if (confirm("是否进行报损")) {
                                        that.Model.minStorageBad(row);
                                    }
                                }
                            }
                            },
                            {field: 'batch_no', title: '药品批次'},
                            {field: 'goods_name', title: '药品名称'},
                            {field: 'goods_type', title: '药品分类'},
                            {field: 'goods_way', title: '药品来源'},
                            {field: 'producter_name', title: '生产厂家'},
                            {field: 'goods_id', title: '药品批号'},
                            {field: 'min_packing_unit', title: '剂量单位', width: '10%'},
                            {field: 'current_num', title: '库存'},
                            {field: 'product_date_time', title: '生产日期'},
                            {field: 'deadline_date_time', title: '过期日期'},
                        ],
                        data: [],
                        pagination: true,
                        pageSize: 10,
                        pageList: [5, 10],
                        rowStyle: function (row,index) {
                            if(row['current_num']<=0){
                                return {
                                    css:{color:"red"}
                                }
                            }
                            else{
                                return {
                                    css:{color:"black"}
                                }
                            }
                        }
                    });

                    $(this.el).find("#Stock_Tbl").bootstrapTable({
                        columns: [
                            {field: "", title: "", checkbox: true},
                            {field: "index", title: "序号", width: "5%", formatter: jctLibs.generateIndex},
                            {field: 'batch_no', title: '药品批次'},
                            {field: 'goods_name', title: '药品名称'},
                            {field: 'goods_type', title: '药品分类'},
                            {field: 'goods_way', title: '药品来源'},
                            {field: 'producter_name', title: '生产厂家'},
                            {field: 'goods_id', title: '药品批号'},
                            {field: 'min_packing_unit', title: '剂量单位', width: '10%'},
                            {field: 'current_num', title: '库存'},
                            {field: 'product_date_time', title: '生产日期'},
                            {field: 'deadline_date_time', title: '过期日期'},
                        ],
                        data: [],
                        pagination: true,
                        pageSize: 10,
                        pageList: [5, 10]
                    });
                    $(this.el).find('input[name="switch_warning"]').bootstrapSwitch({
                        size: 'small',
                        onText: '启用',
                        offText: '停用',
                        offColor: 'danger',
                        onColor: 'success'
                    });
                    this.Model.getSetting();
                    this.commonModel.search('comm.suppliers_dict', {'enterprise_id': sessionStorage.getItem('enterprise_id')}, 'getSupplier')
                    return this;
                }
            })
            ;
        return view;
    })
;
