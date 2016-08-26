define(['txt!../../Bill/settle/settle.html',
        '../../Bill/settle/settleModel',
        'handlebars', 'backbone', 'bootstrapTable'],
    function (Template, settleModel, Handlebars, backbone) {
        function forState(value, row, index) {
            return {
                wjs: "未对账",
                yjs: "已结算",
                ytf: "已退费",
            }[value];
        }

        function forType(value, row, index) {
            return {
                GH: "挂号",
                CF: "处方",
                XS: "销售",
                HK: "还款",
                CZ: "会员充值",
                QT: "其他"
            }[value];
        }

        var totalColumns = [
            {field: 'account_id', title: '账号'},
            {field: 'user_name', title: '姓名'},
            {field: 'total_charges', title: '实收总费用'},
            {field: 'cash_pay', title: '现金支付'},
            {field: 'wechat_pay', title: '微信支付'},
            {field: 'ali_pay', title: '支付宝支付'},
            {field: 'social_security_pay', title: '医保支付'},
            {field: 'bank_pay', title: '银行卡支付'},
            {field: 'charge_record_id', title: '发票数'},
        ];
        var singleColumns = [
            {field: 'charge_record_id', title: '明细记录ID'},
            {field: 'charge_type', title: '费别', formatter: forType},
            {field: 'patient_id', title: '患者ID', width: '18%'},
            {field: 'patient_name', title: '患者姓名'},
            {field: 'total_charges', title: '实收费用', width: '8%'},
            {field: 'charge_date_time', title: '时间', width: '15%'},
            {field: 'state', title: '状态', formatter: forState}
        ];
        var view = Backbone.View.extend({
            initialize: function () {
                this.model = new settleModel;
                this.listenTo(this.model, "getMainRecord", this.renderRecord);
                this.listenTo(this.model, "chargeCost", this.checkDm);
                this.listenTo(this.model, "getBillRecord", this.renderSingleRecord);
                this.listenTo(this.model, "balanceRecord", this.balanceCallback);
            },
            render: function () {
                var _this = this;
                $(this.el).append(Template);
                $(this.el).find("#charge_total_tbl").bootstrapTable({
                    columns: totalColumns,
                    data: {},
                    onClickRow: function (row) {
                        var acct_id = row['account_id'], total = row['total_charges'], user_name = row['user_name'];
                        var $panel = $('.record_detail_panel'), param = {
                            'account_id': acct_id
                        };
                        $panel.attr('account_id', acct_id);
                        $panel.attr('name', user_name);
                        $panel.attr('total', total);
                        _this.model.getBillRecord(param)
                    }
                });
                $(this.el).find("#charge_single_tbl").bootstrapTable({
                    columns: singleColumns,
                    data: {},
                    pageSize: 6
                });
                this.model.getMainRecord({});
                return this;
            },
            events: {
                "click #search_settle": "searchSettle",
                "keyup #user_name": "keySearchSettle",
                "click #checkBill": "checkBill",
                "click #balance_bill": "balanceBill"
            },
            searchSettle: function () {
                var start_date = $('#start').val(),
                    end_date = $('#end').val(),
                    user_name = $('#user_name').val();
                var param = {};
                var $panel = $('.record_detail_panel');
                if (start_date) {
                    param['start_date_time'] = start_date;
                    $panel.attr('start', start_date);
                }
                if (end_date) {
                    param['end_date_time'] = end_date;
                    $panel.attr('end', end_date);
                }
                if (user_name) {
                    param['user_code_name'] = user_name;
                }
                this.model.getMainRecord(param);
            },
            keySearchSettle: function (e) {
                if (e.keyCode == 13) {
                    this.searchSettle();
                }
            },
            renderRecord: function (res) {
                var data = [];
                if (res.errorNo == 0) {
                    data = res.rows;
                }
                $(this.el).find("#charge_total_tbl").bootstrapTable("load", data);
            },
            renderSingleRecord: function (res) {
                var data = [];
                if (res.errorNo == 0) {
                    data = res.rows;
                    $('.record_detail_panel').removeClass('am-hide');
                }
                $(this.el).find("#charge_single_tbl").bootstrapTable("load", data);
            },
            checkBill: function () {
                var $panel = $('.record_detail_panel'), param = {
                    'account_id': $panel.attr('account_id')
                };
                var start_date = $panel.attr('start');
                var end_date = $panel.attr('end');
                if (start_date) {
                    param['start_date_time'] = start_date;
                }
                if (end_date) {
                    param['end_date_time'] = end_date;
                }
                this.model.chargeCost(param)
            },
            checkDm: function (res) {
                if (res.errorNo == 0) {
                    var charges = res.charges;
                    var $panel = $('.record_detail_panel');
                    var total = $panel.attr('total');
                    $panel.attr('total_balance', charges['totalCharges'])
                    $('#total_charges').html(total);
                    $('#detail_charges').html(charges['totalCharges']);
                    $('#check_bill_modal').modal()
                }
            },
            balanceBill: function () {
                var param = {};
                var $panel = $('.record_detail_panel'), rows = $("#charge_single_tbl").bootstrapTable('getData');
                var total_charges = $panel.attr('total');
                var charge_account_id = $panel.attr('account_id');
                var total_balance = $panel.attr('total_balance');
                var charge_name = $panel.attr('name');
                var itemInfo = rows
                    .filter(function (row) {
                        return row['state'] == 'wjs'
                    }).map(function (row) {
                        return row['charge_record_id']
                    });
                param={
                    "itemInfo":itemInfo,
                    "mainRecord":{
                        total_charges:parseFloat(total_charges),
                        charge_account_id:charge_account_id,
                        total_balance:parseFloat(total_balance),
                        charge_name:charge_name,
                    }
                }
                this.model.balanceRecord(param)
            },
            balanceCallback:function (res) {
                if(res.resultCode=='100'){
                    $('#total_charges').html('');
                    $('#detail_charges').html('');
                    $('#check_bill_modal').modal('close');
                    this.model.getMainRecord({});
                    $('.record_detail_panel').addClass('am-hide');
                    alert("对账成功!!")
                }
            }
        });
        return view;
    });