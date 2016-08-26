define(['txt!../../Statistical/InventoryContrast/InventoryContrast.html',
        '../../Statistical/InventoryContrast/InventoryContrastModel',
        '../../Statistical/InventoryContrast/InventoryContrastCollection',
        'handlebars','backbone','bootstrapTable'],
    function (Template,inspectionItemModel,inspectionItemCollection,Handlebars,backbone){
        var InventoryContrastName=[
            {field:'item_name',title:'药物名称'},
            {field:'item_code',title:'编码'},
            {field:'item_size',title:'规格'},
            {field:'item_num',title:'数量'},
            {field:'item_discount',title:'单位'},
            {field:'item_actul_fee',title:'应收费用'},
            {field:'item_org_total_fee',title:'实收费用'}
        ];
        InventoryContrastName.forEach(function(e){
            e.align='center';
            e.valign='middle';
        });
        var view = Backbone.View.extend({
            render:function() {
                $(this.el).append(Template);

                this.$el.find("#InventoryContrast_tbl").bootstrapTable({
                    columns:InventoryContrastName,
                    data: {}
                });
                $(this.el).find("#drugs_classify").chosen({width: "100%",disable_search_threshold: 100});

                return this;
            },
            initialize: function () {

                //this.StatisticalModel=new StatisticalModel;

                this.inspectionItemCollection=new inspectionItemCollection;

                this.listenTo(this.settleCollection,"detail",this.TheQuery);

            },
            events:{
                "click #drugpurchase_btn":"seeAbout"
            },
            seeAbout:function(){
                this.inspectionItemCollection.getData();
            },
            TheQuery:function(data){
                data = jctLibs.listToObject(data['chargeRecord'], "rows")['rows'];
                $(this.el).find("#Monthly_statistics").bootstrapTable("load",data);
                console.log(data);
            }
        });
        return view;
    });