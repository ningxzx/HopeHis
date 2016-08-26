define(['txt!../../Statistical/drugsTo/drugsTo.html',
        '../../Statistical/drugsTo/drugsToModel',
        '../../Statistical/drugsTo/drugsToCollection',
        'handlebars','backbone','bootstrapTable'],
    function (Template,drugsToModel,drugsToCollection,Handlebars,backbone){
        var drugsToName=[
            {field:'item_name',title:'药物名称'},
            {field:'item_code',title:'编码'},
            {field:'item_size',title:'规格'},
            {field:'item_num',title:'数量'},
            {field:'item_discount',title:'单位'},
            {field:'item_actul_fee',title:'应收费用'},
            {field:'item_org_total_fee',title:'实收费用'}
        ];
        drugsToName.forEach(function(e){
            e.align='center';
            e.valign='middle';
        });
        var view = Backbone.View.extend({
            render:function() {
                $(this.el).append(Template);

                this.$el.find("#drugsTo_tbl").bootstrapTable({
                    columns:drugsToName,
                    data: {}
                });

                $(this.el).find("#drugs_classify").chosen({width: "100%",disable_search_threshold: 100});
                return this;
            },
            initialize: function () {

                //this.StatisticalModel=new StatisticalModel;

                this.drugsToCollection=new drugsToCollection;

                this.listenTo(this.settleCollection,"detail",this.TheQuery);

            },
            events:{
                "click #drugpurchase_btn":"seeAbout"
            },
            seeAbout:function(){
                this.drugsToCollection.getData();
            },
            TheQuery:function(data){
                data = jctLibs.listToObject(data['chargeRecord'], "rows")['rows'];
                $(this.el).find("#Monthly_statistics").bootstrapTable("load",data);
                console.log(data);
            }
        });
        return view;
    });