define(['txt!../../Bill/afterPay/afterPay.html',
        "amazeui","chosen",
        'handlebars','backbone','bootstrapTable'],
    function (Template,chosen,Handlebars,backbone){
        var refundName=[
            {field:'item_name',title:'药物名称'},
            {field:'item_code',title:'编码'},
            {field:'item_size',title:'规格'},
            {field:'item_num',title:'数量'},
            {field:'item_discount',title:'单位'},
            {field:'item_actul_fee',title:'应收费用'},
            {field:'item_org_total_fee',title:'实收费用'}
        ];
        var repayName=[
            {field:'item_name',title:'药物名称'},
            {field:'item_code',title:'编码'},
            {field:'item_size',title:'规格'},
            {field:'item_num',title:'数量'},
            {field:'item_discount',title:'单位'},
            {field:'item_actul_fee',title:'应收费用'},
            {field:'item_org_total_fee',title:'实收费用'}
        ];
        var repay_recodeName=[
            {field:'item_name',title:'药物名称'},
            {field:'item_code',title:'编码'},
            {field:'item_size',title:'规格'},
            {field:'item_num',title:'数量'},
            {field:'item_discount',title:'单位'},
            {field:'item_actul_fee',title:'应收费用'},
            {field:'item_org_total_fee',title:'实收费用'}
        ];
        repay_recodeName.forEach(function(e){
            e.align='center';
            e.valign='middle';
        });
        repayName.forEach(function(e){
            e.align='center';
            e.valign='middle';
        });
        refundName.forEach(function(e){
            e.align='center';
            e.valign='middle';
        });
        var view = Backbone.View.extend({
            render:function() {
                $(this.el).append(Template);

                $(this.el).find("#credit_start").datepicker();
                $(this.el).find("#credit_end").datepicker();
                $(this.el).find("#reimbursement_start").datepicker();
                $(this.el).find("#reimbursement_end").datepicker();
                $(this.el).find("#history_start").datepicker();
                $(this.el).find("#history_end").datepicker();
                this.$el.find("#refund_tbl").bootstrapTable({
                    columns:refundName,
                    data: {}
                });
                this.$el.find("#repay_tbl").bootstrapTable({
                    columns:repayName,
                    data: {}
                });
                this.$el.find("#repay_recode_tbl").bootstrapTable({
                    columns:repay_recodeName,
                    data: {}
                });
                $(this.el).find("#credit_sex").chosen({width: "100%",disable_search_threshold: 100});
                $(this.el).find("#reimbursement_sex").chosen({width: "100%",disable_search_threshold: 100});
                $(this.el).find("#history_sex").chosen({width: "100%",disable_search_threshold: 100});


                return this;
            },
            events:{
                "click #refund_search":"seeAbout",
                "click #repay_search":"repaySearch",
                "click #repay_recode_search":"repayRecodeSearch"
            },
            seeAbout:function(){
                alert(1)
            },
            repaySearch:function(){
                alert(2)
            },
            repayRecodeSearch:function(){
                alert(3)
            }
        });
        return view;
    });

