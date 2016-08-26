define(['txt!../../Bill/searchSettle/searchSettle.html',
        '../../Bill/searchSettle/searchSettleModel',
        'handlebars', 'backbone', 'bootstrapTable'],
    function (Template, searchSettleModel, Handlebars, backbone) {
        var view = Backbone.View.extend({
            initialize: function () {
                this.model = new searchSettleModel();
                this.listenTo(this.model, "searchRecord", this.searchResult);
            },
            render: function () {
                var that = this;
                $(this.el).html(Template);
                //初始化日期组件,结束日期必须在初始日期以前
                this.$el.find("#balance_record").bootstrapTable({
                    columns: [
                        {field: 'charge_account_id', title: '收费人员ID'},
                        {field: 'charge_name', title: '收费人员姓名'},
                        {field: 'total_charges', title: '实收总费用'},
                        {field: 'total_balance', title: '结账总费用'},
                        {field: 'balance_date_time', title: '结账时间',width:'25%'},
                        {field: 'balance_account_id', title: '结账用户名'},
                        {field: 'balance_user_name', title: '结账员姓名'},
                    ],
                    data: [],
                    pageSize:8
                });
                this.model.getBalanceRecord();
                return this;
            },
            events: {
                "click #search_balance_record": "searchSettle",
                "click .balance_refresh_tool": "searchSettle",
                "keyup #charge_user": "keySearch",
                "keyup #balance_user": "keySearch"
            },
            keySearch:function (e) {
              if(e.keyCode==13){
                  this.searchSettle();
              }
            },
            searchSettle: function () {
                var start_date = $('#start').val(),
                    end_date = $('#end').val(),
                    charge_user = $('#charge_user').val(),
                    balance_user = $('#balance_user').val();
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
                if (charge_user) {
                    param['charge_user'] = charge_user;
                }
                if (balance_user) {
                    param['balance_user'] = balance_user;
                }
                this.model.getBalanceRecord(param);
            },
            searchResult:function (res) {
                if(res.errorNo==0){
                    this.$el.find("#balance_record").bootstrapTable('load',res.rows)
                }
            }
        });
        return view;
    });