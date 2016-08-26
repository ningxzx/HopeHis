define(['txt!../../Bill/retailPricing/retailPricing.html',
        '../../Bill/retailPricing/retailPricingModel',
        '../../Common/commonModel',
        'jctLibs',
        'handlebars', 'backbone', 'bootstrapTable'],
    function (Template, retailPricingModel, commonModel, jctLibs, Handlebars, backbone) {
        var generateDrugNum = function (value, row, index, e) {
            var $input = $('<input type="number" class="sell_num"/>');
            if (value > row['current_num']) {
                return $input.prop('outerHTML');
            }
            else if (value > 0 && value <= row['current_num']) {
                $input.attr("value", value);
            }
            else {
                $input.attr("value", '');
            }
            return $input.prop('outerHTML');
        };
        var changeNum = {
            //改变药物数量
            'change .sell_num': function (e, value, row, index) {
                var $table_t = $(e.target).closest("table"), $value = $(e.target).val();
                if ($value > row['current_num']) {
                    alert('当前库存数量为 ' + row['current_num'] + ' ,售药不能大于当前库存数量！')
                    row.sell_num = row['current_num'];
                    row.original_total_charges = row['current_num'] * row.goods_sell_price;
                }
                else {
                    row.sell_num = $value;
                    row.original_total_charges = $value * row.goods_sell_price;
                }
                $table_t.bootstrapTable('updateRow', {index: index, row: row});
            }
        };
        var formatGender = function (value, row, index) {
            return {'M': '男', 'F': "女", "N": "不详"}[value]
        };
        var columns = [
            {field: "index", title: "序号", width: "5%", formatter: jctLibs.generateIndex},
            {field: 'goods_name', title: '药品名称'},
            {field: 'goods_spec', title: '药品规格'},
            {field: 'sell_num', title: '数量', width: "15%", formatter: generateDrugNum, events: changeNum},
            {field: 'min_packing_unit', title: '单位'},
            {field: 'goods_sell_price', title: '售价(元）'},
            {field: 'original_total_charges', title: '总价'},
            {
                field: "", title: "删除", width: "8%", events: {
                'click .table_remove': function (e, value, row, index) {
                    var $table = $(e.target).closest("table");
                    $table.bootstrapTable('remove', {
                        field: 'goods_id',
                        values: [row.goods_id]
                    });
                }
            }, formatter: jctLibs.deleteFormatter
            }
        ];
        var patColumn = [
            {field: "index", title: "序号", width: "5%", formatter: jctLibs.generateIndex},
            {field: 'patient_name', title: '患者姓名'},
            {field: 'card_id', title: '身份证号'},
            {field: 'patient_sex', title: '性别', width: "5%", formatter: formatGender}
        ];
        var view = Backbone.View.extend({
            initialize: function () {
                this.model = new retailPricingModel();
                this.commonModel = new commonModel();
                this.listenTo(this.model, "getmcurStorage", this.renderMedicineModal);
                this.listenTo(this.model, "submitRecord", this.submitCallBack);
                this.listenTo(this.model, "submitCharges", this.chargeCallBack);
                this.listenTo(this.commonModel, "getPatsBypatient_name", this.renderNamePats);
                this.listenTo(this.commonModel, "getPatsBymember_id", this.renderMemberPats);
                this.listenTo(this.commonModel, "getPatsBycard_id", this.renderIdPats);
            },
            events: {
                'keyup #patient_name': "searchPatName",
                'keyup #member_id': "searchPatName",
                'keyup #card_id': "searchPatName",
                'click .add_tool': 'showMedicineModel',
                'click #add_retail_medicine': 'addToDetail',
                'click #submit_record': 'submitRecord',
                'click .search_input_btn': 'searchPat',
                'click #cancel_charge': 'cancelCharge',
                'click #clear_record': 'clearDrug',
                'click #submit_charge': 'submitRecord',
                'input .charge_input': 'calCharge',
                'click .clear_tool': 'clearTable',
            },
            render: function () {
                var _this = this;
                $(this.el).html(Template);
                this.$el.find("#medicine_table").bootstrapTable({
                    search: true,
                    columns: columns,
                    data: [],
                    onPostBody: function (data) {
                        var data = _this.$el.find("#medicine_table").bootstrapTable('getData'), total = 0;
                        if (Array.isArray(data) && data.length !== 0) {
                            total = data.reduce(function (a, drug) {
                                var charge = drug['original_total_charges'];
                                return a + (parseFloat(charge) == charge ? charge : 0);
                            }, 0)
                        }
                        $('#sum_charge').val(total);
                    }
                });
                this.$el.find("#add_medicine_tb").bootstrapTable({
                    columns: [
                        {field: "checked", title: "", checkbox: true},
                        {field: 'goods_name', title: '药品名称', width: '20%'},
                        {field: 'goods_spec', title: '药品规格', width: '10%'},
                        {field: 'producter_name', title: '产商', width: '30%'},
                        {field: 'current_num', title: '当前数量', width: '10%'},
                        {field: 'min_packing_unit', title: '单位', width: '8%'},
                        {field: 'goods_sell_price', title: '售价（元）', width: '5%'},
                        {field: 'deadline_date_time', title: '过期时间', formatter: jctLibs.formatDate, width: '15%'},
                    ],
                    data: [],
                    clickToSelect: true,
                    formatRecordsPerPage: function () {
                    },
                });
                $(this.el).find("select").chosen({width: "100%", disable_search_threshold: 100});
                this.model.getmcurStorage();
                $(this.el).find('#name_search_table').bootstrapTable({
                    columns: patColumn,
                    data: [],
                    onClickRow: _this.showPatInfo
                });
                $(this.el).find('#member_search_table').bootstrapTable({
                    columns: patColumn,
                    data: [],
                    onClickRow: _this.showPatInfo
                });
                $(this.el).find('#cardId_search_table').bootstrapTable({
                    columns: patColumn,
                    data: [],
                    onClickRow: _this.showPatInfo
                });
                $(this.el).find('#current_date').val(jctLibs.dataGet.currentDate());
                return this;
            },
            renderMedicineModal: function (res) {
                $(this.el).find('#add_medicine_tb').bootstrapTable('load', res.rows)
            },
            showMedicineModel: function () {
                $(this.el).find('#add_medicine_tb').modal('uncheckAll')
                $(this.el).find('#medicine_modal').modal({width: 800})
            },
            addToDetail: function () {
                var selectedData = $(this.el).find('#add_medicine_tb').bootstrapTable('getSelections');
                selectedData.forEach(function (drug) {
                    drug['sell_num'] = 1;
                    drug['original_total_charges'] = drug['goods_sell_price'];
                })
                var drugIds = selectedData.map(function (newDrug) {
                    return newDrug['goods_id']
                })
                var oldData = $(this.el).find("#medicine_table").bootstrapTable('getData');
                if (Array.isArray(oldData) && oldData.length !== 0) {
                    oldData.forEach(function (oldDrug) {
                        if (drugIds.indexOf(oldDrug['goods_id']) == -1) {
                            selectedData.push(oldDrug)
                        }
                    })
                }
                $(this.el).find("#medicine_table").bootstrapTable('load', selectedData);
                $(this.el).find('#medicine_modal').modal('close')
            },
            submitRecord: function (e) {
                $('#cancel_charge').attr('disabled', 'true');
                var $target = $(e.currentTarget);
                var id = $target.attr('id');
                var data = {
                        'sellRecord': {},
                        'detailDrug': {}
                    },
                    name = $('#patient_name').val(),
                    patientId = $('#patient_name').attr('patient_id'),
                    member_id = $('#member_id').val(),
                    memberPoint = $('#member_id').attr('member_points'),
                    memberId = $('#member_id').attr('member_record_id'),
                    gender = $('#select_gender').val(),
                    cardId = $('#card_id').val(),
                    birth = $('#pat_age').val(),
                    remark = $('#remark').val(),
                    sum = parseFloat($('#sum_charge').val()),
                    cash_in = parseFloat($('.realCharge').val()),
                    cash_out = parseFloat($('.backCharge').val()),
                    wx_pay = parseFloat($('#wx_pay').val()),
                    ali_pay = parseFloat($('#ali_pay').val()),
                    insu_pay = parseFloat($('#insu_pay').val()),
                    recharge_card_pay = parseFloat($('#recharge_pay').val());
                var details = $(this.el).find("#medicine_table").bootstrapTable('getData');
                if (!Array.isArray(details) || details.length == 0 || parseFloat(sum) !== sum) {
                    alert('请选择药品，总费用不能为空！')
                    return;
                }
                data.detailDrug = details;
                data.sellRecord.original_total_charges = sum;
                data.sellRecord.patient_card_id = cardId;
                if (birth) {
                    data.sellRecord.patient_birth = birth;
                }
                if (patientId) {
                    data.sellRecord.patient_id = patientId;
                }
                if (memberPoint) {
                    data.sellRecord.member_points = memberPoint;
                }
                if (memberId) {
                    data.sellRecord.member_record_id = memberId;
                }
                data.sellRecord.member_id = member_id;
                data.sellRecord.patient_name = name;
                data.sellRecord.patient_id = patientId;
                data.sellRecord.memo = remark;
                data.sellRecord.patient_sex = gender;
                if (id == 'submit_record') {
                    this.model.submitRecord(data);
                }
                else {
                    if(cash_out<0){
                        return;
                    }
                    data.sellRecord.cash_pay = cash_in-cash_out;
                    if (wx_pay) {
                        data.sellRecord.wechat_pay = wx_pay;
                    }
                    if (ali_pay) {
                        data.sellRecord.ali_pay = ali_pay;
                    }
                    if (insu_pay) {
                        data.sellRecord.heath_card_pay = insu_pay;
                    }
                    if (recharge_card_pay) {
                        data.sellRecord.recharge_card_pay = recharge_card_pay;
                    }
                    this.model.submitCharge(data);
                }
            },
            searchPatName: function (e) {
                if (e.keyCode == "13") {
                    this.searchPat(e);
                }
            },
            searchPat: function (e) {
                var $searchInput = $(e.target).closest('.am-input-group').find('input'),
                    searchValue = $searchInput.val(),
                    searchKey = $searchInput.attr('id');
                if (searchValue == '' || searchValue == null) {
                    return;
                }
                var param = {};
                param[searchKey] = searchValue;
                this.commonModel.searchPatMember(param, 'getPatsBy' + searchKey, 2)
            },
            renderNamePats: function (res) {
                if (res.rows && res.rows.length > 1) {
                    $(this.el).find('.pat_table_wrapper').addClass('hid')
                    var $nameTable = $(this.el).find('#name_search_table')
                    $nameTable.bootstrapTable('load', res.rows);
                    $(this.el).find('.name_search_wrapper').removeClass('hid');
                } else if (res.rows.length == 1) {
                    this.showPatInfo(res.rows[0], $(this.el));
                } else {
                    this.clearDrug();
                }
            },
            renderMemberPats: function (res) {
                if (res.rows && res.rows.length > 1) {
                    $(this.el).find('.pat_table_wrapper').addClass('hid')
                    var $memberTable = $(this.el).find('#member_search_table')
                    $memberTable.bootstrapTable('load', res.rows)
                    $(this.el).find('.member_search_wrapper').removeClass('hid');
                } else if (res.rows.length == 1) {
                    this.showPatInfo(res.rows[0], $(this.el));
                } else {
                    this.clearDrug();
                }
            },
            renderIdPats: function (res) {
                if (res.rows && res.rows.length > 1) {
                    $(this.el).find('.pat_table_wrapper').addClass('hid')
                    var $cardIdTable = $(this.el).find('#cardId_search_table')
                    $cardIdTable.bootstrapTable('load', res.rows);
                    $(this.el).find('.cardId_search_wrapper').removeClass('hid');
                } else if (res.rows.length == 1) {
                    this.showPatInfo(res.rows[0], $(this.el));
                } else {
                    this.clearDrug();
                }
            },
            showPatInfo: function (row, $element) {
                $('#patient_name').attr('patient_id', row['patient_id'])
                $('#patient_name').val(row['patient_name']);
                $('#member_id').val(row['member_id']);
                $('#member_id').attr('member_points', row['member_points']);
                $('#member_id').attr('member_record_id', row['id']);
                $('#select_gender').val(row['patient_sex']).trigger('chosen:updated');
                $('#card_id').val(row['card_id']);
                $('#pat_age').val(row['patient_birth']);
                $('#current_date').val(jctLibs.dataGet.currentDate());
                $element.closest('.pat_table_wrapper').addClass('hid')
            },
            clearDrug: function () {
                $(this.el).find('.pat_detail_wrapper input').val('');
                $(this.el).find('#medicine_table').bootstrapTable('removeAll');
                $(this.el).find('#current_date').val(jctLibs.dataGet.currentDate());
            },
            chargeCallBack: function (res) {
                $('.am-alert').addClass('am-hide');
                $(this.el).find('#charge_modal input').val('')
                $(this.el).find('#charge_modal').modal('close')
                if (res.result == '100') {
                    $(this.el).find('.pat_detail_wrapper input').val('')
                    $('#retail_operate_su>p').html('数据保存成功！');
                    $('#retail_operate_su').removeClass('am-hide');
                    window.setTimeout(function () {
                        $('#retail_operate_su').addClass('am-hide')
                    }, 2000);
                    this.clearDrug()
                }
                else {
                    $('#retail_operate_fail>p').html('数据保存失败！');
                    $('#retail_operate_fail').removeClass('am-hide');
                    window.setTimeout(function () {
                        $('#retail_operate_fail').addClass('am-hide')
                    }, 2000);
                }
            },
            submitCallBack: function (res) {
                if (res.errorNo == 0) {
                    $(this.el).find('span.charge_title').html(res.charge);
                    $(this.el).find('.realCharge').val(res.charge);
                    $(this.el).find('.backCharge').val(0);
                    $(this.el).find('#charge_modal').modal({
                        width: '700',
                        closeViaDimmer: false
                    })
                    $(this.el).find('#charge_modal').off('opened.modal.amui').on('opened.modal.amui', function () {
                        $('.realCharge').focus();
                    })
                }
            },
            cancelCharge: function () {
                $(this.el).find('#charge_modal input').val('')
                $(this.el).find('#charge_modal').modal('close')
            },
            calCharge: function (e) {
                var realCharge = parseFloat($('.realCharge').val().trim()||0);
                var charge = +$(this.el).find('.charge_title').html();
                var wx_pay = parseFloat($('#wx_pay').val()||0),
                    ali_pay = parseFloat($('#ali_pay').val()||0),
                    insu_pay = parseFloat($('#insu_pay').val()||0),
                    recharge_card_pay = parseFloat($('#recharge_pay').val()||0);
                var de = parseFloat(realCharge+wx_pay+ali_pay+insu_pay+recharge_card_pay - charge);
                $('.backCharge').val(de).css('color', 'cornflowerblue');
                if (de < 0) {
                    $('.backCharge').css('color', 'red')
                }
            },
            clearTable: function () {
                $(this.el).find('#medicine_table').bootstrapTable('removeAll')
            },
        });
        return view;
    });
