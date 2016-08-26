define(['txt!../../Medicine/minStorage/minStorage.html',
        '../../Medicine/minStorage/inStorageModel',
        '../../Medicine/minCheck/minCheckModel',
        '../../Common/commonModel',
        'handlebars', 'backbone', "jctLibs", 'bootstrapTable', "amazeui"],
    function (Template, inStorageModel, minCheckModel, commonModel, Handlebars, backbone, jctLibs, bootstrapTable) {
        var opt = function (value, row, index) {
            return [
                '<a class="row_update" href="javascript:void(0)" title="update">',
                '修改',
                '</a>  ',
                '<a class="row_remove" href="javascript:void(0)" title="Remove">',
                '删除',
                '</a>'
            ].join('');
        };
        var showDetail = function (value, row, index) {
            return [
                '<a class="search_detail" href="javascript:void(0)" title="detail">',
                '明细',
                '</a>  '
            ].join('');
        };
        var showCosts = function (value, row, index) {
            return value || 0;
        };

        function showState(value, row, index) {
            var state = {'00': '未审核', '10': '已通过', '20': '未通过'};
            return state[value];
        }

        //入库表字段
        var cols0 = [
            {field: "", checkbox: true},
            {field: "index", title: "序号", width: "5%", formatter: jctLibs.generateIndex},
            {field: 'drug_code', title: '药品本位码'},
            {field: 'chinese_name', title: '中文名称'},
            {field: 'dosage_form', title: '剂型'},
            {field: 'drug_type', title: '类别'},
            {field: 'producter', title: '生产厂家', width: "20%",},
            //{field: 'current_approval_no', title: '当前批准文号'},
            //{field: 'special_memo', title: '特别说明'},
            {field: 'approval_date', title: '批准日期'},
            {field: 'goods_spec', title: '药品规格'}
        ];
        var cols1 = [
            {field: "", checkbox: true},
            {field: "index", title: "序号", width: "5%", formatter: jctLibs.generateIndex},
            {field: 'drug_code', title: '药品本位码'},
            {field: 'chinese_name', title: '中文名称'},
            {field: 'dosage_form', title: '剂型'},
            {field: 'drug_type', title: '类别'},
            {field: 'producter', title: '生产厂家', width: "20%",},
            //{field: 'current_approval_no', title: '当前批准文号'},
            //{field: 'special_memo', title: '特别说明'},
            {field: 'approval_date', title: '批准日期'},
            {field: 'drug_spec', title: '药品规格'}
        ];
        //未入库表格明细字段
        var cols2 = [
            //{field: "", checkbox: true, width:""},
            {field: "index", title: "序号", width: "3%", formatter: jctLibs.generateIndex},
            //{field: 'drug_code', width: "10%", title: '药品本位码'},
            {field: 'chinese_name', width: "12%", title: '中文名称'},
            {field: 'dosage_form', width: "5%", title: '剂型'},
            {field: 'drug_spec', width: "9%", title: '规格'},
            //{field: 'producter', width: "8%", title: '生产厂家'},
            //{field: 'approval_date', width: "5%", title: '批准日期'},
            {field: 'drug_type', width: "5%", title: '类型'},
            {field: 'min_packing_unit', width: "5%", title: '单位', events: jctLibs.returnUnit, formatter: jctLibs.generateSelect},
            {field: 'original_total_num', width: "4%", title: '应收数量', events: jctLibs.returnNum, formatter: jctLibs.generateDrugNum},
            {field: 'actual_total_num', width: "4%", title: '实收数量', events: jctLibs.returnActual, formatter: jctLibs.generateDrugNum},
            {field: 'unit_price', width: "5%", title: '成本价', events: jctLibs.rUnitPrice, formatter: jctLibs.generatePrices},
            {field: 'sell_price', width: "5%", title: '售药价', events: jctLibs.rSellPrice, formatter: jctLibs.generatePrices},
            {field: 'pesc_price', title: '处方价', width: "6%", events: jctLibs.rPescPrice, formatter: jctLibs.generatePrices},
            {field: 'product_date_time', title: '生产日期', width: "10%", events: jctLibs.rProductTime, formatter: jctLibs.generateDate},
            {field: 'deadline_date_time', title: '过期日期', width: "10%", events: jctLibs.rDeadlineTime, formatter: jctLibs.generateDate},
            {field: 'total_costs', title: '批发额', width: "4%", formatter: showCosts},
            {field: 'total_recipe_costs', title: '处方额', width: "4%", formatter: showCosts},
            {field: "del", title: "删除", width: "5%", events: jctLibs.deleteRow, formatter: jctLibs.deleteFormatter}
        ];
        var view = Backbone.View.extend({
            initialize: function () {
                this.inStorageModel = new inStorageModel();
                this.inCheckModel = new minCheckModel();
                this.commonModel = new commonModel();
                //初始化请求
                this.inStorageModel.getRecopient();
                //侦听事件
                this.listenTo(this.inStorageModel, "getResult", this.renderRecopient);
                this.listenTo(this.inStorageModel, "getGunCode", this.addDetail);
                this.listenTo(this.inStorageModel, "saveResult", this.saveResult);
                this.listenTo(this.inStorageModel, "getMedicine0", this.renderMedicine0);
                this.listenTo(this.inStorageModel, "getMedicine1", this.renderMedicine1);
                this.listenTo(this.inStorageModel, "getOwnCheckRecord", this.renderRecord);
                this.listenTo(this.inCheckModel, "getRecordDetails", this.renderDetail);
                this.listenTo(this.commonModel, "getSupplier", this.renderSupplier)
            },
            events: {
                "click #submit_check": "submitCheck",
                "click #add_detail": "showModel",
                "click #ins_selDrugs": "showModel",
                "click #add": "appendTable",
                "click #medicine_tabs .am-close": "closeModal",
                "click #reset_main": "resetMain",
                "click #reset_detail": "resetDetail",
                "click #reset_table": "resetTable",
                "click #add_recipe_detail1": "submitm1",
                "click #add_recipe_detail2": "submitm2",
                'click #search_medicine1': 'searchUmedicine',
                'click #search_medicine2': 'searchHmedicine',
                'keydown #search_u_input': 'searchKeyUmedicine',
                'keydown #search_h_input': 'searchKeyHmedicine',
                'change #select_supplier': 'editSelect',
                'click #search_code_gun':"startCodeGun",
                'change #gun_num':'inputDrugCode',
                'blur #gun_num':'restartCodeGun',
            },
            startCodeGun:function () {
                $('#search_code_gun').removeClass('am-btn-secondary').addClass('am-btn-success').html('扫码中').off('click');
                $('#gun_num').removeClass('am-hide').focus();
            },
            inputDrugCode:function () {
                var code = $('#gun_num').val().trim();
                this.inStorageModel.searchMedicineByGun(code);
            },
            addDetail:function (res) {
                $('#gun_num').val("");
                if(res.errorNo==0) {
                    this.addetailtb(res.rows);
                }
            },
            restartCodeGun:function () {
                $('#gun_num').addClass('am-hide').val("");
                $('#search_code_gun').addClass('am-btn-secondary').removeClass('am-btn-success').html('开始扫码').off('click').on('click',this.startCodeGun);
            },
            editSelect: function () {
                var value = $('#select_supplier').val();
                if (value == 'edit') {
                    $('.supplier_choose_wrapper').html(' <span class="am-input-group-label"><i class="am-icon-h-square"></i> 供应商</span><input type="text" class="am-form-field" id="select_supplier" placeholder="供应商必填" ><span class="required_span">*</span>');
                    $('#sup_name').val('');
                    $('#sup_tel').val('');
                    $('#select_supplier').focus();
                }
                else {
                    var arr = value.split('-');
                    $('#sup_name').val(arr[1]);
                    $('#sup_tel').val(arr[2]);
                }
            },
            searchUmedicine: function () {
                var name = $('#search_u_input').val();
                this.inStorageModel.searchMedicine0(name);
            },
            searchHmedicine: function () {
                var name = $('#search_h_input').val();
                this.inStorageModel.searchMedicine1(1, 5, name);
            },
            searchKeyUmedicine: function (e) {
                if (e.keyCode == '13') {
                    this.searchUmedicine();
                }
            },
            searchKeyHmedicine: function (e) {
                if (e.keyCode == '13') {
                    this.searchHmedicine();
                }
            },
            //关闭modal
            closeModal: function () {
                $("#medicine_modal").modal('close');
                $('#medicine_tabs').tabs('refresh');
            },
            //显示model
            showModel: function () {
                var that = this;
                $('#medicine_tabs').tabs('refresh')
                this.inStorageModel.searchMedicine0();
                this.inStorageModel.searchMedicine1(1, 5);
                $("#medicine_modal").modal({
                    width: '960px'
                });
            },
            submitm1: function () {
                var rows = $("#medicine_tb1").bootstrapTable("getAllSelections");
                $("#medicine_modal").modal("close");
                this.addetailtb(rows);
                $("#medicine_tb1").bootstrapTable("uncheckAll");
            },
            //选中药品
            submitm2: function () {
                var rows = $("#medicine_tb2").bootstrapTable("getAllSelections");
                $("#medicine_modal").modal("close");
                //var tab=$("#table_minStorage table");
                //tab.bootstrapTable({
                //    columns: cols2,
                //    clickToSelect: true,
                //    data: []
                //})
                this.addetailtb(rows);
                $("#medicine_tb2").bootstrapTable("uncheckAll");
            },
            //提交明细表
            addetailtb: function (rows) {
                var $table = $(this.el).find("#table_minStorage");
                var foreData = $table.bootstrapTable("getData");
                var codes = foreData.map(function (drug) {
                    return drug['drug_code']
                });
                rows.forEach(function (row) {
                    if (codes.indexOf(row['drug_code']) == -1) {
                        row['drug_spec']=row['drug_spec']||row['goods_spec'];
                        foreData.push(row);
                    }
                })
                //添加药物到处方的药物表
                $table.bootstrapTable("load", foreData);
                $table.bootstrapTable("uncheckAll");
            },
            //提交审核
            submitCheck: function () {
                var data = {};
                var curDate = new Date();
                var curYear = curDate.getFullYear();    //获取完整的年份(4位,1970-????)
                var tomoYear = curDate.getFullYear() + 1;
                var curMonth = curDate.getMonth() + 1;       //获取当前月份(0-11,0代表1月)
                var curDay = curDate.getDate();        //获取当前日(1-31)
                var curDateStr = curYear + '-' + curMonth + '-' + curDay;
                var tomoDateStr = tomoYear + '-' + curMonth + '-' + curDay;
                //var dataDetail= $("#table_minStorage").bootstrapTable("getSelections");
                var dataDetail = $("#table_minStorage").bootstrapTable("getData");
                var arr = [];
                for (var i = 0; i < dataDetail.length; i++) {
                    var drug = dataDetail[i];
                    var unit_price = drug.unit_price;
                    var sell_price = drug.sell_price;
                    var pesc_price = drug.pesc_price;
                    if (!unit_price || unit_price <= 0) {
                        this.showErrorAlert('药品【' + drug.chinese_name + '】成本价有误，请重新输入药品成本价！')
                        return;
                    }
                    if (!sell_price || sell_price <= 0) {
                        this.showErrorAlert('药品【' + drug.chinese_name + '】售价有误，请重新输入药品售价！')
                        return;
                    }
                    if (!pesc_price || pesc_price <= 0) {
                        this.showErrorAlert('药品【' + drug.chinese_name + '】处方价有误，请重新输入药品处方价！')
                        return;
                    }
                    var datas = {
                        goods_id: drug.drug_code,
                        goods_name: drug.chinese_name,
                        goods_input_code: drug.drug_input_code,
                        goods_spec: drug.drug_spec,
                        drug_type: drug.drug_type,
                        min_packing_unit: drug.min_packing_unit ? drug.min_packing_unit : "瓶",
                        producter_name: drug.producter,
                        original_total_num: drug.original_total_num || 1,
                        actual_total_num: drug.actual_total_num || 1,
                        product_date_time: drug.product_date_time || curDateStr,
                        deadline_date_time: drug.deadline_date_time || tomoDateStr,
                        unit_price: parseFloat(unit_price),
                        sell_price: parseFloat(sell_price),
                        pesc_price: parseFloat(pesc_price),
                        total_charge_costs: parseFloat(drug.total_costs) || 0
                    }
                    arr.push(datas)
                }
                var suppliers_name = $("#select_supplier").val().split('-')[0];
                var contact_person = $("#sup_name").val();
                var contact_person_tel = $("#sup_tel").val();
                var delivery_person = $("#delivery_name").val();
                var delivery_person_tel = $("#delivery_tel").val();
                var recipient_date = $("#recipient_date").val();
                var storate_date = $("#storate_date").val();
                if (!suppliers_name) {
                    this.showErrorAlert('供应商有误，请选择供应商！')
                    return;
                }
                if (!contact_person) {
                    this.showErrorAlert('供应商联系人有误，请重新输入供应商联系人！')
                    return;
                }
                if (!contact_person_tel) {
                    this.showErrorAlert('供应商联系人电话有误，请重新输入供应商联系人电话！')
                    return;
                }
                if (!delivery_person) {
                    this.showErrorAlert('送货人有误，请重新输入送货人！')
                    return;
                }
                if (!delivery_person_tel) {
                    this.showErrorAlert('送货人电话有误，请重新输入送货人电话！')
                    return;
                }
                if (!recipient_date) {
                    this.showErrorAlert('收货时间有误，请重新输入收货时间！')
                    return;
                }
                if (!storate_date) {
                    this.showErrorAlert('入库时间有误，请重新输入入库时间！')
                    return;
                }
                var data2 = {
                    suppliers_name: suppliers_name,//供应商全称
                    contact_person: contact_person,//供应商联系人名称
                    contact_person_tel: contact_person_tel,//供应商联系人手机号
                    delivery_company: $("#delivery_company").val(),//送货单位全称
                    delivery_person: delivery_person,//送货人员姓名
                    delivery_person_tel: delivery_person_tel,//送货人员手机号
                    recipient_date: recipient_date,//收货时间
                    storate_date: storate_date,//入库时间
                    goods_total_costs: parseFloat($("#total_costs").val()),//货款总费用
                    need_pay_costs: parseFloat($("#pay_costs").val()),//应付款
                    charge_costs: parseFloat($("#charge_costs").val()),//实付款
                    recipient_person_id: $("#recipient_person").val(),//收货人员姓名
                    recipient_person_name: $("#recipient_person").find("option:checked").text(),//收货人员ID
                    recipient_person_code: $("#recipient_person").find("option:checked").attr("code"),//收货人员拼音码
                    delivery_detail: $("#delivery_detail").val(),//送货情况说明
                    recipient_detail: $("#recipient_detail").val(),//收货情况说明
                    storate_state: $("#storate_state").find("option:checked").attr("value"),//收货状态
                    delivery_list_scan: $("#delivery_list").val(),//送货单扫描件
                    storate_type: $("#storate_type").find("option:checked").attr("value")//入库方式
                };
                data.storateRecord = data2;
                data.storateDetailRecord = arr;
                this.inStorageModel.submitInfo(data);
            },
            //初始化收货人
            renderRecopient: function (data) {
                if (data.errorNo === 0) {
                    var opt = "", rows = data.rows;
                    for (var i = 0; i < rows.length; i++) {
                        var row = rows[i];
                        opt += "<option value=\"" + row['account_id'] + "\" code=\"" + row['user_input_code'] + "\">" + row['user_name'] + "</option>";
                    }
                    $(this.el).find("#recipient_person").html(opt);
                    $(this.el).find("#recipient_person").trigger("chosen:updated")
                }
                else {
                    $(this.el).find("#medicine_table").bootstrapTable("load", [{}]);
                }
            },
            //提交返回结果
            saveResult: function (result) {
                //debugger
                if (result.errorNo == 0) {
                    this.showSuccessAlert('提交入库记录成功！')
                    this.resetDetail();
                    this.resetTable();
                    this.resetMain();
                }
                else {
                    this.showErrorAlert('提交入库记录失败！')
                }
            },
            showSuccessAlert: function (text) {
                $('#inStorage_operate_su p').html(text)
                $('#inStorage_operate_su').removeClass('am-hide');
                window.setTimeout(function () {
                    $('#inStorage_operate_su').addClass('am-hide')
                }, 2000)
            },
            showErrorAlert: function (text) {
                $('#inStorage_operate_fail p').html(text)
                $('#inStorage_operate_fail').removeClass('am-hide');
                window.setTimeout(function () {
                    $('#inStorage_operate_fail').addClass('am-hide')
                }, 2000)
            },
            //重置主记录
            resetMain: function () {
                $("#sup_company").val('');//供应商全称
                $("#sup_name").val('');//供应商联系人名称
                $("#sup_tel").val('');//供应商联系人手机号
                $("#delivery_company").val('');//送货单位全称
                $("#delivery_name").val('');//送货人员姓名
                $("#delivery_tel").val('');//送货人员手机号
                $("#recipient_date").val('');//收货时间
                $("#storate_date").val('');//入库时间
                $("#total_costs").val('');//货款总费用
                $("#pay_costs").val('');//应付款
                $("#charge_costs").val('');//实付款
                $("#delivery_detail").val('');//送货情况说明
                $("#recipient_detail").val('');//收货情况说明
                $("#storate_state").val('');//收货状态
                $("#delivery_list").val('');//送货单扫描件
                $("#storate_type").val('');//入库方式
            },
            //重置明细
            resetDetail: function () {
                $("#goods_name").val('');
                $("#goods_type").val('');
                $("#goods_size").val('');
                $("#goods_model").val('');
                $("#goods_bar_code").val('');
                $("#producter").val('');
                $("#original_total_num").val('');
                $("#actual_total_num").val('');
                $("#warehouse_id").val('');
                $("#shelves_id").val('');
                $("#storate").val('');
                $("#max_packing_unit").val('');
                $("#max_packing_num").val('');
                $("#max_min_packing_change_con").val('');
                $("#min_packing_num").val('');
                $("#total_charge_costs").val('');
                $("#unit_price").val('');
                $("#product_batch_no").val('');
                $("#product_date_time").val('');
                $("#deadline_date_time").val('');
                $("#Standard_code").val('');
                $("#Sale_price").val('');
                $("#Prescription_price").val('');
                $("#min_packing_unit").val('');
            },
            //重置明细表
            resetTable: function () {
                $("#table_minStorage").bootstrapTable("removeAll");
            },
            //显示库存药物数据已入库
            renderMedicine0: function (res) {
                if (res.errorNo == 0) {
                    $(this.el).find('#medicine_tb1').bootstrapTable('load', res.rows)
                }
            },
            //显示库存药物数据未入库
            renderMedicine1: function (res) {
                var data = res.data;
                if (res.errorNo == 0) {
                    $(this.el).find('#medicine_tb2').bootstrapTable('load', data)
                }
            },
            render: function () {
                var that = this, $el = $(this.el);
                $el.html(Template);
                $el.find("input[type='checkbox']").uCheck("enable");
                $el.find("#storate_date").datepicker();
                $el.find("#storate_date").val('');
                $el.find("#recipient_date").datepicker();
                $el.find("#product_date_time").datepicker();
                $el.find("#deadline_date_tiime").datepicker();
                $el.find("#storate").datepicker();
                $el.find("select").chosen({width: "100%", disable_search_threshold: 100});
                $el.find("#table_minStorage").bootstrapTable({
                    columns: cols2,
                    data: [],
                    onPostBody: function (data) {
                        var data = $el.find("#table_minStorage").bootstrapTable('getData');
                        if (Array.isArray(data)) {
                            var total = data.reduce(function (a, row) {
                                return a + parseInt(row['total_costs'] || 0)
                            }, 0)
                            $('#total_costs').val(total);
                            $('#pay_costs').val(total);
                            $('#charge_costs').val(total);
                        }
                    }
                });
                //药物表格
                $el.find("#medicine_tb1").bootstrapTable({
                    columns: cols0,
                    clickToSelect: true,
                    data: []
                });
                $el.find("#medicine_tb2").bootstrapTable({
                    columns: cols1,
                    clickToSelect: true,
                    pageSize: 5,
                    pageList: [5, 10],
                    pagination: true,
                    sidePagination: 'jethis',
                    data: [],
                    onPageChange: function (number, size) {
                        var name = $('#search_h_input').val();
                        that.inStorageModel.searchMedicine1(number, size, name);
                    }
                });
                $(this.el).find(".start_calender").datepicker({
                    onRender: function (date, viewMode) {
                        var index = $el.find(".start_calender").index(this.$element);
                        var endDate = $el.find(".end_calender:eq(" + index + ")").val();
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
                        var index = $el.find(".end_calender").index(this.$element);
                        var startDate = $el.find(".start_calender:eq(" + index + ")").val();
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
                $(this.el).find("#table_minStorage_record").bootstrapTable({
                    columns: [
                        {field: "", title: "", checkbox: true},
                        {field: "index", title: "序号", width: "5%", formatter: jctLibs.generateIndex},
                        {
                            field: 'opt', title: '操作', width: "10%", formatter: showDetail, events: {
                            "click .search_detail": function (e, value, row, index) {
                                that.inCheckModel.getRecordDetail(row['record_id'] || 0);
                            }
                        }
                        },
                        {field: 'batch_no', title: '批次号'},
                        {field: 'recipient_person_name', title: '入库员'},
                        {field: 'suppliers_name', title: '供应商'},
                        {field: 'goods_total_costs', title: '货物总费用'},
                        {field: 'need_pay_costs', title: '应付费用'},
                        {field: 'charge_costs', title: '实付费用'},
                        {field: 'storate_date', title: '入库时间', width: '10%'},
                        {field: 'review_date_time', title: '审核时间'},
                        {field: 'review_name', title: '审核人'},
                        {field: 'review_result', title: '审核状态', formatter: showState},
                    ],
                    data: [],
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
                        {field: "index", title: "序号", width: "5%", formatter: jctLibs.generateIndex},
                        {field: 'goods_name', title: '名称'},
                        {field: 'drug_type', title: '类型'},
                        {field: 'goods_spec', title: '规格'},
                        {field: 'producter_name', title: '生产厂家名称'},
                        {field: 'original_total_num', title: '应收总数'},
                        {field: 'actual_total_num', title: '实收总数'},
                        {field: 'total_charge_costs', title: '总费用'},
                        {field: 'unit_price', title: '成本单价'},
                        {field: 'product_date_time', title: '生产日期'},
                        {field: 'deadline_date_time', title: '失效日期'}
                    ], data: []
                });
                this.inStorageModel.getOwnCheckRecord();
                this.commonModel.search('comm.suppliers_dict', {'enterprise_id': sessionStorage.getItem('enterprise_id')}, 'getSupplier')
                return this;
            },
            renderRecord: function (result) {
                if (result.errorNo === 0) {
                    var records = result.rows;
                    $(this.el).find("#table_minStorage_record").bootstrapTable("load", records);
                }
                else {
                    $(this.el).find("#table_minStorage_record").bootstrapTable("load", []);
                }
                $(this.el).find("#detail_panel").addClass('am-hide');
            },
            renderDetail: function (res) {
                if (res.errorNo == 0) {
                    $(this.el).find("#detail_panel").removeClass('am-hide');
                    $(this.el).find("#table_minStorage_detail").bootstrapTable('load', res.rows)
                }
            },
            renderSupplier: function (res) {
                var data = res.rows;
                if (Array.isArray(data) && data.length > 0) {
                    data.forEach(function (supplier) {
                        var value = [supplier['suppliers_name'], supplier['suppliers_name'], supplier['contact_person']].join('-');
                        $('#select_supplier')
                            .append($('<option></option>').val(value).html(supplier['suppliers_name']))

                    })
                    $('#select_supplier').append('<option value="edit">自定义编辑</option>').trigger('chosen:updated');
                    $('#sup_name').val(data[0]['contact_person']);
                    $('#sup_tel').val(data[0]['contact_tel']);
                }
                else {
                    $('.supplier_choose_wrapper').html(' <span class="am-input-group-label"><i class="am-icon-h-square"></i> 供应商</span><input type="text" class="am-form-field" id="select_supplier" placeholder="供应商必填" ><span class="required_span">*</span>');
                    $('#sup_name').val('');
                    $('#sup_tel').val('');
                    $('#inStorage_operate_fail p').html('当前未设置供应商，<a class="link_to_supplier" href="#medicine/msupplier">设置供应商</a>后入库更方便安全！')
                    $('#inStorage_operate_fail').removeClass('am-hide');
                }
            },
        });
        return view;
    });
