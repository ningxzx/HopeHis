define(['txt!../../Statistical/purchaseReturn/purchaseReturn.html',
        '../../Statistical/purchaseReturn/purchasereturnModel',
        '../../Statistical/purchaseReturn/purchasereturnCollection',
        'handlebars','backbone','bootstrapTable'],
    function (Template,purchaseReturnModel,purchaseReturnCollection,Handlebars,backbone){
        var purchasereturnName=[
            {field:'item_name',title:'药物名称'},
            {field:'item_code',title:'编码'},
            {field:'item_size',title:'规格'},
            {field:'item_num',title:'数量'},
            {field:'item_discount',title:'单位'},
            {field:'item_actul_fee',title:'应收费用'},
            {field:'item_org_total_fee',title:'实收费用'}
        ];
        purchasereturnName.forEach(function(e){
            e.align='center';
            e.valign='middle';
        });
        var view = Backbone.View.extend({
            render:function() {
                $(this.el).append(Template);

                this.$el.find("#purchasereturn_tbl").bootstrapTable({
                    columns:purchasereturnName,
                    data: {}
                });
                return this;
            },
            initialize: function () {

                //this.StatisticalModel=new StatisticalModel;

                this.purchaseReturnCollection=new purchaseReturnCollection;

                this.listenTo(this.settleCollection,"detail",this.TheQuery);

            },
            events:{
                "click #drugpurchase_btn":"seeAbout"
            },
            seeAbout:function(){
                this.purchaseReturnCollection.getData();
            },
            TheQuery:function(data){
                data = jctLibs.listToObject(data['chargeRecord'], "rows")['rows'];
                $(this.el).find("#Monthly_statistics").bootstrapTable("load",data);
                console.log(data);
            }
        });
        return view;
    });
