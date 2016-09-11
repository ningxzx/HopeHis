define(['txt!../../Bill/searchRefund/searchRefund.html',
        '../../Bill/searchRefund/searchRefundModel',
        'handlebars', 'backbone', 'bootstrapTable', 'jctLibs'],
    function (Template,searchRefundModel, Handlebars, backbone, bootstrapTable, jctLibs) {
        var recordDetailCols = [
            {field: 'detail_record_id', title: '明细记录id'},
            {field: 'drug_code', title: '项目编码'},
            {field: 'goods_name', title: '项目名称'},
            {field: 'unit_price', title: '单价'},
            {field: 'charge_num', title: '退费数目'},
            {field: 'total_costs', title: '退费费用'},
        ];
        var searchName = [
            {field: 'refund_record_id', title: '明细记录ID'},
            {field: 'account_id', title: '退费员'},
            {field: 'total_charges', title: '实收费用'},
            {field: 'refund_money', title: '退费金额'},
            {field: 'refund_date_time', title: '时间'},
        ];

        var view = Backbone.View.extend({
            initialize: function () {
                this.searchRefundModel = new searchRefundModel;
                this.listenTo(this.searchRefundModel, "searchRecord", this.getData);
                this.listenTo(this.searchRefundModel, "getDetail", this.renderDetail);
            },
            render: function () {
                var $el=$(this.el),_this=this;
                $el.append(Template);
                $el.find("#search_tbl").bootstrapTable({
                    columns: searchName,
                    pageSize:5,
                    sortName:'Refund_date_time',
                    sortOrder:'desc',
                    onClickRow: function (row) {
                        _this.searchRefundModel.getRefundDetail(row['refund_record_id'])
                    }
                });
                $el.find("#search_detail_tbl").bootstrapTable({
                    columns: recordDetailCols,
                    pageSize:5,
                    sortName:'total_Refunds',
                    sortOrder:'desc'
                });
                $el.find("select").chosen({width: "100%", disable_search_threshold: 100});
                this.searchRefundModel.getRefund();
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
                //var orderNo=$("#order_no").val();
                //var patId=$("#pat_id").val();
                var startDate=$("#start").val();
                var user_name=$("#user_name").val();
                var endDate=$("#end").val(),data={};
                //if(orderNo){
                //    data['billing_record_id']=orderNo;
                //}
                if(user_name){
                    data['account_id']=user_name;
                }
                //if(patId){
                //    data['patient_id']=patId;
                //}
                if(startDate){
                    data['start_date_time']=startDate;
                }
                if(endDate){
                    data['end_date_time']=endDate;
                }
                this.searchRefundModel.getRefund(data);
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
                    $(this.el).find(".record_detail_panel .panel_title").html(res.data[0]['refund_record_id']+'-费用明细表')
                    $(this.el).find(".record_detail_panel").removeClass('am-hide');
                    $(this.el).find("#search_detail_tbl").bootstrapTable("load", res.data);
                }
                else{
                    $(this.el).find("#search_detail_tbl").bootstrapTable("load", []);
                }
            }

        });
        return view;
    });


