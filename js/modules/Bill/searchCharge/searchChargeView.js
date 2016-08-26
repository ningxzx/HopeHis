define(['txt!../../Bill/searchCharge/searchCharge.html',
        '../../Bill/searchCharge/searchChargeModel',
        'handlebars', 'backbone', 'bootstrapTable', 'jctLibs'],
    function (Template,searchChargeModel, Handlebars, backbone, bootstrapTable, jctLibs) {
        function forState(value, row, index) {
            return {
                wjs:"未对账",
                yjs:"已结算",
                ytf:"已退费",
            }[value];
        }
        function forType(value, row, index) {
            return {
                GH:"挂号",
                CF:"处方",
                XS:"销售",
                HK:"还款",
                CZ:"会员充值",
                QT:"其他"
            }[value];
        }
        var recordDetailCols = [
            {field: 'detail_record_id', title: '明细记录id'},
            {field: 'drug_code', title: '项目编码'},
            {field: 'drug_name', title: '项目名称'},
            {field: 'unit_price', title: '单价'},
            {field: 'original_num', title: '处方数量'},
            {field: 'charge_num', title: '实售数量'},
            {field: 'total_costs', title: '实收费用'},
        ];
        var searchName = [
            // {field: 'charge_record_id', title: '明细记录ID'},
            {field: 'charge_type', title: '费别',formatter:forType},
            {field: 'patient_id', title: '患者ID',width:'20%'},
            {field: 'patient_name', title: '患者姓名'},
            {field: 'user_name', title: '收费员'},
            {field: 'total_charges', title: '实收费用'},
            {field: 'cash_pay', title: '现金'},
            {field: 'wechat_pay', title: '微信'},
            {field: 'ali_pay', title: '支付宝'},
            {field: 'recharge_card_pay', title: '会员卡'},
            {field: 'charge_date_time', title: '时间',width:'20%'},
            {field: 'state', title: '状态', formatter: forState}
        ];
        var view = Backbone.View.extend({
            initialize: function () {
                this.model = new searchChargeModel;
                this.listenTo(this.model, "searchRecord", this.getData);
                this.listenTo(this.model, "getDetail", this.renderDetail);
            },
            render: function () {
                var $el=$(this.el),_this=this;
                $el.append(Template);
                $el.find("#search_tbl").bootstrapTable({
                    columns: searchName,
                    pageSize:5,
                    sortName:'charge_date_time',
                    sortOrder:'desc',
                    onClickRow: function (row) {
                        if(row['charge_type']=='CF') {
                            _this.model.getDetail(row['charge_record_id'])
                        }
                    }
                });
                $el.find("#search_detail_tbl").bootstrapTable({
                    columns: recordDetailCols,
                    pageSize:5,
                    sortName:'total_charges',
                    sortOrder:'desc'
                });
                $el.find("select").chosen({width: "100%", disable_search_threshold: 100});
                this.model.getCharge({});
                return this;
            },
            events: {
                "click #search_record": "searchRecord",
                "click #record_refresh_tool": "refreshRecord",
                "keyup .am-g input": "keySearch",
            },
            keySearch: function (e) {
                if(e.keyCode==13){
                    this.searchRecord();
                }
            },
            searchRecord: function () {
                var orderNo=$("#order_no").val();
                var patId=$("#pat_id").val();
                var startDate=$("#start").val();
                var user_name=$("#user_name").val();
                var endDate=$("#end").val(),data={};
                if(orderNo){
                    data['charge_record_id']=orderNo;
                }
                if(user_name){
                    data['user_name']=user_name;
                }
                if(patId){
                    data['patient_id']=patId;
                }
                if(startDate){
                    data['start_date_time']=startDate;
                }
                if(endDate){
                    data['end_date_time']=endDate;
                }
                this.model.getCharge(data);
            },
            refreshRecord: function () {
                this.searchRecord();
            },
            getData: function (res) {
                if (res.errorNo == "0") {
                    $(this.el).find("#search_tbl").bootstrapTable("load", res.data);
                }
                else{
                    $(this.el).find("#search_tbl").bootstrapTable("load", []);
                }
            },
            renderDetail: function (res) {
                if (res.errorNo == "0") {
                    $(this.el).find(".record_detail_panel .panel_title").html(res.rows[0]['charge_record_id']+'-- 费用明细表')
                    $(this.el).find(".record_detail_panel").removeClass('am-hide');
                    $(this.el).find("#search_detail_tbl").bootstrapTable("load", res.rows);
                }
                else{
                    $(this.el).find("#search_detail_tbl").bootstrapTable("load", []);
                }
            }

        });
        return view;
    });


