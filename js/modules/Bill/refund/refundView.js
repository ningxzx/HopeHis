define(['txt!../../Bill/refund/refund.html',
        '../../Bill/refund/refundModel',
        '../../Bill/searchCharge/searchChargeModel',
        'handlebars', 'backbone', 'bootstrapTable', 'jctLibs'],
    function (Template, refundModel, searchChargeModel, Handlebars, backbone, bootstrapTable, jctLibs) {
        var recordDetailCols = [
            {field: 'detail_record_id', title: '明细记录id'},
            {field: 'drug_code', title: '项目编码'},
            {field: 'drug_name', title: '项目名称'},
            {field: 'unit_price', title: '单价'},
            {field: 'original_num', title: '处方数量'},
            {field: 'charge_num', title: '实售数量'},
            {field: 'total_costs', title: '实收费用'}
        ];
        var refundDetailCols = [
            {field: 'detail_record_id', title: '收费号'},
            {field: 'drug_code', title: '项目编码'},
            {field: 'drug_name', title: '项目名称'},
            {field: 'unit_price', title: '单价'},
            {
                field: 'refund_num', title: '数目',
                //formatter: function (value, row, index) {
                //    var $input = $('<input type="number" class="item_sell_num"  min="1" max="' + row['item_sell_num'] + '"/>');
                //    if (row['charge_num']) {
                //        $input.attr("value", row['charge_num']);
                //    }
                //    else {
                //        $input.attr("value", '');
                //    }
                //    return $input.prop('outerHTML');
                //},
                events: {
                'keyup .item_sell_num': function (e, value, row, index) {
                    var $table_t = $(e.target).closest("table"), $value = $(e.target).val();
                    if ($value > row['charge_num']) {
                        alert('收费数量为 ' + row['charge_num'] + ' ,退费数量不能大于收费数量！')
                        row.refund_num = row['charge_num'];
                        row.refund_money = row['charge_num'] * row.unit_price;
                    }
                    else if ($value <= 0) {
                        alert('退费数量有误！')
                        row.refund_num = row['charge_num'];
                        row.refund_money = row['charge_num'] * row.unit_price;
                    }
                    else {
                        row.refund_num = $value;
                        row.refund_money = $value * row.unit_price;
                    }
                    $table_t.bootstrapTable('updateRow', {index: index, row: row});
                }
            }
            },
            {
                field: 'refund_money', title: '应退费用', formatter: function (value, row, index) {
                row.refund_money = row['total_costs'];
                return row.refund_money;
            }
            },
            {
                field: "", title: "删除", width: "8%", events: {
                'click .table_remove': function (e, value, row, index) {
                    var $table = $(e.target).closest("table");
                    $table.bootstrapTable('remove', {
                        field: 'billing_item_id',
                        values: [row.billing_item_id]
                    });
                }
            }, formatter: jctLibs.deleteFormatter
            }
        ];
        var recordCols = [
            {field: 'checkbox', checkbox: true},
            {field: 'patient_name', title: '患者'},
            {field: 'total_charges', title: '费用'},
            {field: 'charge_date_time', title: '时间', formatter: jctLibs.formatDate},
            {field: 'charge_record_id', title: '收费号'},
        ];
        var view = Backbone.View.extend({
            initialize: function () {
                this.searchChargeModel = new searchChargeModel();
                this.model = new refundModel();
                this.listenTo(this.searchChargeModel, "searchRecord", this.getData);
                this.listenTo(this.searchChargeModel, "getDetail", this.renderDetail);
                this.listenTo(this.model, "backResult", this.refundCallback);
            },
            render: function () {
                var $el = $(this.el), _this = this;
                $el.append(Template);
                $el.find("#record_tbl").bootstrapTable({
                    clickToSelect: true,
                    singleSelect: true,
                    columns: recordCols,
                    pageSize: 5,
                    sortName: 'charge_date_time',
                    sortOrder: 'desc',
                    onCheck: function (row, $ele) {
                        _this.cancelRefund();
                        _this.searchChargeModel.getDetail(row['charge_record_id'])
                    },
                    onUncheck: _this.cancelRefund,
                });
                $el.find("#charge_detail_tbl").bootstrapTable({
                    columns: recordDetailCols,
                    pageSize: 5,
                    sortName: 'total_charges',
                    sortOrder: 'desc',
                    formatShowingRows: function () {
                    },
                    //onDblClickRow: function (row) {
                    //    _this.addRefund(row);
                    //}
                });
                $el.find("#refund_detail_tbl").bootstrapTable({
                    columns: refundDetailCols,
                    pageSize: 5,
                    sortName: 'total_charges',
                    sortOrder: 'desc',
                    formatShowingRows: function () {
                    }
                });
                $el.find("select").chosen({width: "100%", disable_search_threshold: 100});
                this.searchChargeModel.getCharge({charge_type: 'CF'}, 'wjs');
                return this;
            },
            events: {
                "click #search_record": "searchRecord",
                "click .record_refresh_tool": "refreshRecord",
                "click .refund_all_tool": "addAllDetail",
                "click .refund_reset_tool": "resetDetail",
                "click #refund_btn": "refund",
                "keyup .am-g input": "keySearch",
                'click #refund_cancel_btn': 'cancelRefund',
            },
            keySearch: function (e) {
                if (e.keyCode == 13) {
                    this.searchRecord();
                }
            },
            searchRecord: function () {
                var orderNo = $("#order_no").val();
                var patId = $("#pat_id").val();
                var startDate = $("#start").val();
                var user_name = $("#user_name").val();
                var endDate = $("#end").val(), data = {};
                if (orderNo) {
                    data['billing_record_id'] = orderNo;
                }
                if (user_name) {
                    data['user_name'] = user_name;
                }
                if (patId) {
                    data['patient_id'] = patId;
                }
                if (startDate) {
                    data['start_date_time'] = startDate;
                }
                if (endDate) {
                    data['end_date_time'] = endDate;
                }
                this.searchChargeModel.getCharge(data);
            },
            refreshRecord: function () {
                this.searchChargeModel.getCharge({}, '3,6');
            },
            getData: function (res) {
                if (res.errorNo == "0") {
                    $(this.el).find("#record_tbl").bootstrapTable("load", res.data);
                }
                else {
                    $(this.el).find("#record_tbl").bootstrapTable("load", []);
                }
            },
            renderDetail: function (res) {
                var $table = $(this.el).find("#charge_detail_tbl");
                if (res.errorNo == "0") {
                    $(this.el).find(".charge_detail_tbl .panel_title").html(res.rows[0]['billing_record_id'] + '-费用明细表')
                    $(this.el).find(".charge_detail_panel").removeClass('am-hide');
                    $table.bootstrapTable("load", res.rows);
                }
                else {
                    $table.bootstrapTable("load", []);
                }
            },
            addAllDetail: function () {
                var chargeDetails = $('#charge_detail_tbl').bootstrapTable('getData');
                $('#refund_detail_tbl').bootstrapTable('load', chargeDetails);
            },
            resetDetail: function () {
                $('#refund_detail_tbl').bootstrapTable("load", []);
                ;
            },
            refund: function () {
                var refundDetails = $('#refund_detail_tbl').bootstrapTable('getData');
                var selectRecord = $('#record_tbl').bootstrapTable('getSelections');
                if (refundDetails.length <= 0 && selectRecord.length == 0) {
                    return false;
                }
                else {
                    refundDetails.forEach(function (detail) {
                        detail['refund_num'] = detail['refund_num'] || detail['charge_num'];
                        detail['refund_money'] = parseFloat(detail['refund_money'] || detail['total_costs']);
                        detail['charge_num'] = detail['charge_num'];
                    })
                    var total = refundDetails.reduce(function (a, b) {
                        return a + b['total_costs']
                    }, 0)
                    var record = selectRecord[0];
                    var data = {
                        refund: {
                            charge_record_id: record['charge_record_id'],
                            "refund_money": parseFloat(total),
                            "total_charges": parseFloat(record['total_charges']),
                            type: record['charge_type']
                        },
                        item: refundDetails
                    }
                    this.model.refund(data)
                }
            },
            refundCallback: function (res) {
                if (res.state == '100') {
                    alert('退费成功！')
                    this.searchChargeModel.getCharge({charge_type: 'CF'}, 'wjs');
                    this.cancelRefund();
                }
            },
            addRefund: function (row) {
                var oldData = $('#refund_detail_tbl').bootstrapTable('getData');
                var ids = oldData.map(function (x) {
                    return x.billing_item_id
                });
                if (ids.indexOf(row['detail_record_id']) == -1) {
                    oldData.push(row)
                }
                $('#refund_detail_tbl').bootstrapTable('load', oldData);
            },
            cancelRefund: function () {
                $('#refund_detail_tbl,#charge_detail_tbl').bootstrapTable("load", []);
            }
        });
        return view;
    });
