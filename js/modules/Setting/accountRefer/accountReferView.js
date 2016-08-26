define(['txt!../../Setting/accountRefer/accountRefer.html',
        '../../Setting/accountRefer/accountReferModel',
        '../../Setting/accountRefer/accountReferCollection',
        'handlebars','backbone','bootstrapTable'],
    function (Template,accountReferModel,accountReferCollection,Handlebars,backbone){
        var accountReferName=[
            {field:'item_name',title:'药物名称'},
            {field:'item_code',title:'编码'},
            {field:'item_size',title:'规格'},
            {field:'item_num',title:'数量'},
            {field:'item_discount',title:'单位'},
            {field:'item_actul_fee',title:'应收费用'},
            {field:'item_org_total_fee',title:'实收费用'}
        ];
        accountReferName.forEach(function(e){
            e.align='center';
            e.valign='middle';
        });
        var view = Backbone.View.extend({
            initialize: function () {

                this.accountReferModel=new accountReferModel;

                this.accountReferCollection=new accountReferCollection;

                this.listenTo(this.accountReferCollection,"detail",this.settleQuery);

            },
            render:function() {
                $(this.el).append(Template);
                $(this.el).find("#start").datepicker();
                $(this.el).find("#end").datepicker();
                $(this.el).find("#accountRefer_tbl").bootstrapTable({
                    columns:accountReferName,
                    data:[{}]
                });

                $(this.el).find("#accountrefer_sex").chosen({width: "100%",disable_search_threshold: 100});

                return this;
            },
            events:{
                "click #settle_sub":"seeAbout"
            },
            seeAbout:function(){
                var that=this;
                that.accountReferCollection.getData();
            },
            settleQuery:function(data){
                data = jctLibs.listToObject(data['chargeRecord'], "rows")['rows'];
                $(this.el).find("#settle_tbl").bootstrapTable("load",data);
                console.log(data);
            }
        });
        return view;
    });

