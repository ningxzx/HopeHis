define(['txt!../../Statistical/outpatientService/outpatientService.html',
        '../../Statistical/outpatientService/outpatientServiceModel',
        '../../Statistical/outpatientService/outpatientServiceCollection',
        'handlebars','backbone','bootstrapTable'],
    function (Template,outpatientServiceModel,outpatientServiceCollection,Handlebars,backbone){
        var outpatientServiceName=[
            {field:'item_name',title:'药物名称'},
            {field:'item_code',title:'编码'},
            {field:'item_size',title:'规格'},
            {field:'item_num',title:'数量'},
            {field:'item_discount',title:'单位'},
            {field:'item_actul_fee',title:'应收费用'},
            {field:'item_org_total_fee',title:'实收费用'}
        ];
        outpatientServiceName.forEach(function(e){
            e.align='center';
            e.valign='middle';
        });
        var view = Backbone.View.extend({
            render:function() {
                $(this.el).append(Template);

                this.$el.find("#outpatientService_tbl").bootstrapTable({
                    columns:outpatientServiceName,
                    data: {}
                });
                $(this.el).find("#Diagnostic_category").chosen({width: "100%",disable_search_threshold: 100});
                return this;
            },
            initialize: function () {

                //this.outpatientServiceModel=new outpatientServiceModel;

                this.outpatientServiceCollection=new outpatientServiceCollection;

                this.listenTo(this.settleCollection,"detail",this.TheQuery);

            },
            events:{
                "click #drugpurchase_btn":"seeAbout"
            },
            seeAbout:function(){
                this.outpatientServiceCollection.getData();
            },
            TheQuery:function(data){
                data = jctLibs.listToObject(data['chargeRecord'], "rows")['rows'];
                $(this.el).find("#Monthly_statistics").bootstrapTable("load",data);
                console.log(data);
            }
        });
        return view;
    });