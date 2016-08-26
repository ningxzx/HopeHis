define(['txt!../../Statistical/drugPurchase/drugPurchase.html',
        '../../Statistical/statisticalModel',
        'jctLibs',
        'handlebars','backbone','bootstrapTable'],
    function (Template,statisticalModel,jctLibs,Handlebars,backbone){
        var drugpurchaseName=[
            {field:'suppliers_name',title:'供应商名称'},
            {field:'goods_name',title:'药物名称'},
            {field:'batch_no',title:'批次号'},
            {field:'goods_spec',title:'规格'},
            {field:'actual_total_num',title:'数量',sortable:true},
            {field:'min_packing_unit',title:'单位'},
            {field:'storate_date',title:'入库时间'},
            {field:'total_charge_costs',title:'总费用',sortable:true},
            //{field:'item_org_total_fee',title:'实收费用'}
        ];
        drugpurchaseName.forEach(function(e){
            e.align='center';
            e.valign='middle';
        });
        var view = Backbone.View.extend({
            render:function() {
                $(this.el).append(Template);

                this.$el.find("#drugpurchase_tbl").bootstrapTable({
                    columns:drugpurchaseName,
                    sortName:'actual_total_num',
                    sortOrder:'desc',
                    data: []
                });
                $(this.el).find("#start").datepicker();
                $(this.el).find("#end").datepicker();
                //$(this.el).find("#state").chosen({width: "100%",disable_search_threshold: 100});
                this.model.getDrugpurchase();
                return this;
            },
            initialize: function () {

                this.model=new statisticalModel();

                this.listenTo(this.model,"getDrugpurchase",this.Drugpurchase);

            },
            Drugpurchase:function(data){
                $(this.el).find("#drugpurchase_tbl").bootstrapTable("load",data.rows);

            },
            events:{
                "click #drugpurchase_btn":"seeAbout",
                "click .refresh_tool":"refreshTool"
            },
            refreshTool:function(){
                this.model.getDrugpurchase();
            },
            seeAbout:function(){
                //alert()
                var start=$(this.el).find('#start').val();
                var end=$(this.el).find('#end').val();
                var Suppliername=$(this.el).find('#Supplier_name').val();
                var Drugname=$(this.el).find('#Drug_name').val();
                var OddNumbers=$(this.el).find('#Odd_Numbers').val();
                this.model.getDrugpurchase(start,end,Suppliername,Drugname,OddNumbers);
            },

        });
        return view;
    });
