define(['txt!../../Bill/charge/charge.html',
        '../../Bill/charge/chargeModel',
        '../../Common/patientModel',
        'jctLibs', 'amazeui', 'handlebars', 'backbone', 'bootstrapTable'],
    function (Template, chargeModel, patModel, jctLibs, amazeui, Handlebars, backbone) {
        //视图
        var view = Backbone.View.extend({
            initialize: function () {
                this.chargeModel = new chargeModel;
                this.patModel = new patModel;

                this.chargeModel.on("recordDetail", this.patDetail);
                this.listenTo(this.patModel, "patGetted", this.patInfo);
                this.listenTo(this.chargeModel, "getCharge", this.patRecord);
                this.listenTo(this.chargeModel, "billFinish", this.billResult);
                this.listenTo(this.chargeModel, "feeFinish", this.feeResult);
                this.listenTo(this.chargeModel, "updateResult", this.updateResult);
                this.listenTo(this.chargeModel, "deleteResult", this.deleteResult);
                this.listenTo(this.patModel, "searchByName", this.SearchByName);
            },
            SearchByName: function (result) {
                var that = this;
                if (result.errorNo == 0 && result.obj.length !== 0) {
                    var data = result.obj;
                    $('#pat_name').val(data[0]['patient_id']);
                    if (data == "") {
                        return;
                    } else if (data.length == 1) {
                        that.patInfo(result);
                        var arr = {
                            patient_id: data[0]['patient_id'],
                            //type: $("#charge_type").val(),
                            enterprise_id: sessionStorage.getItem("enterprise_id")
                        };
                        that.chargeModel.getCharge(arr);
                    } else {
                        $("#names").removeClass("hid");
                        $("#tbl_charge_names").bootstrapTable({
                            onClickRow: function (row) {
                                that.patInfo(row);
                                var arr = {
                                    patient_id: row['patient_id'],
                                    enterprise_id: sessionStorage.getItem("enterprise_id")
                                };
                                that.chargeModel.getCharge(arr);
                            },
                            formatShowingRows: function () {
                            }
                        }).bootstrapTable('load', data);
                    }
                    //this.refreshDoctor();
                } else {
                    //$("form")[0].reset();
                    that.resetAll();
                    $("#names").addClass("hid");
                    $("#regist_tip").removeClass("hid").find("p").text("查询失败!");
                }
            },
            render: function () {
                var that = this, $el = $(this.el);
                $el.html(Template);
                $el.find("#record_tbl").bootstrapTable({
                    columns: [
                        {field: 'diagnosis_id', title: '诊疗记录号'},
                        {field: 'doctor_name', title: '医生'},
                        {field: 'diagnosis_date', title: '诊疗时间', formatter: jctLibs.formatDate},
                        {field: 'total_costs', title: '处方费用', width: '15%'},
                    ],
                    sortName: "diagnosis_date",
                    sortOrder: "desc",
                    clickToSelect: true,
                    pagination: false,
                    pageSize: 2,
                    formatShowingRows: function () {
                    },
                    onClickRow: function (row) {
                        if (!$(".pat_name").val()) {
                            $("#tips-alert .tips").text("请先查询患者信息！");
                            $("#tips-alert").modal();
                            return;
                        }
                        var discount = $("#pat_discount").val();
                        that.chargeModel.chargeDetail(row["diagnosis_id"], discount);
                        $(".diagnosis_id").text(row["diagnosis_id"]);
                        $("#detail_tbl").bootstrapTable("removeAll");
                    }
                });
                $el.find("#detail_tbl").bootstrapTable({
                    columns: [
                        {field: '', title: "", checkbox: true},
                        {field: '', title: "序号", formatter: jctLibs.generateIndex},
                        {field: 'record_id', title: '单项ID', width: "15%"},
                        {field: 'goods_name', title: '单项学名'},
                        {field: 'packing_spec', title: '最小包装规格'},
                        {field: 'prescription_num', title: '处方数量'},
                        {
                            field: 'billing_item_num', title: '实际销售数量', formatter: function (value, row) {
                            var $input = $('<input type="text" class="item_num"/>');
                            if (value) {
                                $input.attr("value", value);
                            }
                            else {
                                $input.attr("value", row['prescription_num']);
                            }
                            if (row['state'] !== 0) {
                                $input.attr('readonly')
                            }
                            return $input.prop('outerHTML');
                        }, events: {
                            'change .item_num': function (e, value, row, index) {
                                var $table_t = $(e.target).closest("table"), $value = $(e.target).val();
                                row.billing_item_num = $value;
                                row.total_charges = parseFloat(($value || 1) * row["unit_price"] * (row['discount'] || 1)).toFixed(2);
                                $table_t.bootstrapTable('updateRow', {index: index, row: row});
                                if (parseInt($value) <= 0) {
                                    alert("数量必须大于等于1");
                                    row.billing_item_num = 1;
                                    row.total_charges = parseFloat(row["unit_price"] * (row['discount'] || 1)).toFixed(2);
                                    $table_t.bootstrapTable('updateRow', {index: index, row: row});
                                }
                            }
                        }
                        },
                        {
                            field: 'unit_price', title: '单价'
                        },
                        {
                            field: 'total_costs', title: '处方费用', formatter: function (value, row) {
                            return parseFloat((row["prescription_num"] || 1) * row["unit_price"] * (row['discount'] || 1)).toFixed(2) || value;
                        }
                        },
                        {
                            field: 'total_charges', title: '实收费用', formatter: function (value, row) {
                            return parseFloat((row["billing_item_num"] || 1) * row["unit_price"] * (row['discount'] || 1)).toFixed(2) || value;
                        }
                        },
                        {
                            field: "", title: "删除", width: "8%", events: {
                            'click .record_remove': function (e, value, row, index) {
                                var $table = $(e.target).closest("table");
                                $table.bootstrapTable('remove', {
                                    field: 'record_id',
                                    values: [row.record_id]
                                });
                                $table.bootstrapTable("onRemoveRow");
                            }
                        }
                            , formatter: function (value, row, index) {
                            if (row["state"] == "wjf") {
                                return [
                                    '<a href="javascript:void(0)" title="Remove">',
                                    '<i class="am-icon-remove"></i>',
                                    '</a>'
                                ].join('');
                            } else {
                                return [
                                    '<a class="record_remove" href="javascript:void(0)" title="Remove">',
                                    '<i class="am-icon-remove"></i>',
                                    '</a>'
                                ].join('');
                            }
                        }
                        },
                    ],
                    sortName: "drug_code",
                    onPostBody: function () {
                        var data = $el.find("#detail_tbl").bootstrapTable('getData');
                        if (Array.isArray(data)) {
                            var total = data.reduce(function (a, row) {
                                return a + parseFloat(row['total_charges'] || 0)
                            }, 0)
                            $('.after_change_total').html(total || 0);
                        }
                    }
                });
                $el.find("select").chosen({width: "100%", disable_search_threshold: 100});
                $el.find(".calender").datepicker();
                return this;
            },
            events: {
                "click #fee_search": "feeSearch",
                "click .fee_billing": "feeBilling",
                //"click .check_detail": "checkDetail",
                "click #submit_charge": "chargeFee",
                "click #cancel_modal": "closeModal",
                "input .pay_num": "calculateCost",
                "keyup #patName": "PatName"
            },
            PatName: function (e) {
                if (e.keyCode == 13) {
                    if (!!$("#patName").val().trim()) {
                        this.patModel.searchPatientByName('', $("#patName").val().trim());
                    }
                }
            },
            //获取总记录
            feeSearch: function () {
                var data = {
                    patient_id: $("#pat_name").val().trim(),
                    type: $("#charge_type").val(),
                    patient_name: $("#patName").val().trim(),
                    enterprise_id: sessionStorage.getItem("enterprise_id")
                };
                if (!!data.patient_id) {
                    this.patModel.getPat(data.patient_id);
                    this.chargeModel.getCharge(data);
                } else if (!!$("#patName").val().trim()) {
                    this.patModel.searchPatientByName('', $("#patName").val().trim());
                } else {
                    $("#tips-alert .tips").text("请输入查询条件！");
                    $("#tips-alert").modal();
                }

            },
            patInfo: function (result) {
                var data = null;
                if (!!result.obj) {
                    data = result.obj[0];
                } else if (!!result.data) {
                    data = result.data[0];
                } else if (!!result) {
                    data = result;
                }
                $(".pat_name").val(data.patient_name);
                $(".pat_sex").val(data.patient_sex == "M" ? "男" : "女");
                $(".pat_birth").val(data.patient_birth);
                $(".pat_id").val(data.patient_id);
                $(".pat_cardId").val(data.card_id);
                $(".pat_addr").val(data.addr);
                $(".pat_marriage").val(data.marry_state == "WH" ? "未婚" : "已婚");
                $(".pat_tel").val(data.patient_phone);
                $("#pat_discount").val(data.discount);
                $("#names").addClass("hid");
            },
            patRecord: function (result) {
                if (result.errorNo == "0") {
                    $("#record_tbl").bootstrapTable("load", result.data);
                } else {
                    $("#record_tbl").bootstrapTable("removeAll");
                }
                $("#detail_tbl").bootstrapTable("removeAll");
            },
            patDetail: function (result) {
                if (result.errorNo == "0") {
                    var rows = result.rows || [];
                    if (rows.length > 0) {
                        rows.forEach(function (row) {
                            row['total_charges'] = row['total_costs'];
                            row['billing_item_num'] = row['prescription_num'];
                        })
                        $("#detail_tbl").bootstrapTable("load", result.rows).bootstrapTable('checkAll');
                        $('.after_dis_total').html(result.total)
                    }
                }
            }
            ,
            //计费按钮
            feeBilling: function (e) {
                e.stopPropagation();
                var pat_id = $('.pat_id').val().trim();
                var param = {
                    "patient_id": pat_id
                };
                var data = $("#detail_tbl").bootstrapTable("getData");
                if (data.length == 0) {
                    $("#tips-alert .tips").text("请选择明细记录！");
                    $("#tips-alert").modal();
                } else {
                    var arr = [];
                    data.forEach(function (row) {
                        arr.push({
                            "unit_costs": row['unit_price'],
                            "charge_num": row['billing_item_num'],
                            "original_num": row['prescription_num'],
                            "prescription_detail_id": row['record_id'],
                        })
                    });
                    param["detailInfo"] = arr;
                    this.chargeModel.chargeBilling(param);
                }
            }
            ,
            billResult: function (result) {
                if (result.errorNo == "0") {
                    var fee=result.fee.toFixed(2);
                    $(".charge_title").text(fee);
                    $(".backCharge").val(-fee);
                    $("#doc-modal .pay_num").val("");
                    $("#doc-modal").modal({
                        width: 960
                    });
                } else {
                    $("#tips-alert .tips").text(result.errorInfo);
                    $("#tips-alert").modal();
                }
            }
            ,
            chargeFee: function () {
                //收费按钮
                var charge = $(".charge_title").html(), pat_id = $('.pat_id').val().trim();
                var cash_in = parseFloat($('.realCharge').val()),
                    cash_out = parseFloat($('.backCharge').val());
                if (parseFloat(charge) >= 0 && cash_out >= 0) {
                    var rows = $("#detail_tbl").bootstrapTable("getAllSelections"), arr = [];
                    rows.forEach(function (row) {
                        arr.push({
                            "unit_price": row['unit_price'],
                            "charge_num": row['billing_item_num'],
                            "original_num": row['prescription_num'],
                            "prescription_detail_id": row['record_id'],
                        })
                    });
                    var mainRecord = {
                        wechat_pay: $("#wx_pay").val() || 0,
                        ali_pay: $("#ali_pay").val() || 0,
                        social_security_pay: $("#insu_pay").val() || 0,
                        // bank_pay: $("#bank_pay").val() || 0,
                        recharge_card_pay: $("#recharge_pay").val() || 0,
                        cash_pay: cash_in-cash_out,
                        credit_pay: 0,
                        diagnosis_id: $(".diagnosis_id").text(),
                    };
                    this.chargeModel.chargeFinish({
                        patient_id: pat_id,
                        item_info: arr,
                        mainRecord: mainRecord
                    });
                    this.closeModal();
                }
            }
            ,
            feeResult: function (result) {
                if (result.resultCode == "100") {
                   alert("收费成功!");
                    this.resetAll();
                }
                else if (result.resultCode == "507") {
                    alert("该患者不是会员,无法使用会员支付!");
                }
                else {
                   alert("收费出错,请重试!");
                }
            }
            ,
            resetAll: function () {
                $("#pat_name").val("");
                $("#patName").val("");
                $("#cost").val("");
                $("#spend").val("");
                $("#balance").val("");
                $(".pat_name").val("");
                $(".pat_sex").val("");
                $(".pat_birth").val("");
                $(".pat_id").val("");
                $(".pat_cardId").val("");
                $(".pat_addr").val("");
                $(".pat_marriage").val("");
                $(".pat_tel").val("");
                $(".after_dis_total").text(0);
                $(".after_change_total").text(0);
                $("#record_tbl").bootstrapTable("removeAll");
                $("#detail_tbl").bootstrapTable("removeAll");
            }
            ,
            calculateCost: function () {
                var realCharge = parseFloat($('.realCharge').val().trim() || 0);
                var charge = +$(this.el).find('.charge_title').html();
                var wx_pay = parseFloat($('#wx_pay').val() || 0),
                    ali_pay = parseFloat($('#ali_pay').val() || 0),
                    insu_pay = parseFloat($('#insu_pay').val() || 0),
                    // bank_pay = parseFloat($("#bank_pay").val() || 0);
                    recharge_card_pay = parseFloat($("#recharge_pay").val() || 0);
                var de = parseFloat(realCharge + wx_pay + ali_pay + recharge_card_pay + insu_pay  - charge);
                $('.backCharge').val(de).css('color', 'cornflowerblue');
                if (de < 0) {
                    $('.backCharge').css('color', 'red')
                }
            },
            closeModal: function () {
                $("#doc-modal").modal('close');
                $(".charge_title").text("");
                $("#wx_pay").val("");
                $("#ali_pay").val("");
                $("#insu_pay").val("");
                $("#recharge_pay").val("");
                $("#other_pay").val("");
                $("#realCharge").val("");
                $("#backCharge").val("");
            }
        });
        return view;
    });
