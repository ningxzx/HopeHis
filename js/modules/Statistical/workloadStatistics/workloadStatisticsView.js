define(['txt!../../Statistical/workloadStatistics/workloadStatistics.html',
        '../../Statistical/workloadStatistics/workloadStatisticsModel',
        '../../Statistical/workloadStatistics/workloadStatisticsCollection',
        'handlebars','backbone','bootstrapTable'],
    function (Template,workloadStatisticsModel,workloadStatisticsCollection,Handlebars,backbone){
        var Cost_statisticsName=[
            {field:'item_name',title:'药物名称'},
            {field:'item_code',title:'编码'},
            {field:'item_size',title:'规格'},
            {field:'item_num',title:'数量'},
            {field:'item_discount',title:'单位'},
            {field:'item_actul_fee',title:'应收费用'},
            {field:'item_org_total_fee',title:'实收费用'}
        ];
        var Prescription_statisticName=[
            {field:'item_name',title:'药物名称'},
            {field:'item_code',title:'编码'},
            {field:'item_size',title:'规格'},
            {field:'item_num',title:'数量'},
            {field:'item_discount',title:'单位'},
            {field:'item_actul_fee',title:'应收费用'},
            {field:'item_org_total_fee',title:'实收费用'}
        ];
        var Drug_statisticalName=[
            {field:'item_name',title:'药物名称'},
            {field:'item_code',title:'编码'},
            {field:'item_size',title:'规格'},
            {field:'item_num',title:'数量'},
            {field:'item_discount',title:'单位'},
            {field:'item_actul_fee',title:'应收费用'},
            {field:'item_org_total_fee',title:'实收费用'}
        ];
        var Registration_statisticsName=[
            {field:'item_name',title:'药物名称'},
            {field:'item_code',title:'编码'},
            {field:'item_size',title:'规格'},
            {field:'item_num',title:'数量'},
            {field:'item_discount',title:'单位'},
            {field:'item_actul_fee',title:'应收费用'},
            {field:'item_org_total_fee',title:'实收费用'}
        ];
        var Charge_statisticalName=[
            {field:'item_name',title:'药物名称'},
            {field:'item_code',title:'编码'},
            {field:'item_size',title:'规格'},
            {field:'item_num',title:'数量'},
            {field:'item_discount',title:'单位'},
            {field:'item_actul_fee',title:'应收费用'},
            {field:'item_org_total_fee',title:'实收费用'}
        ];
        Cost_statisticsName.forEach(function(e){
            e.align='center';
            e.valign='middle';
        });
        Prescription_statisticName.forEach(function(e){
            e.align='center';
            e.valign='middle';
        });
        Drug_statisticalName.forEach(function(e){
            e.align='center';
            e.valign='middle';
        });
        Registration_statisticsName.forEach(function(e){
            e.align='center';
            e.valign='middle';
        });
        Charge_statisticalName.forEach(function(e){
            e.align='center';
            e.valign='middle';
        });
        var view = Backbone.View.extend({
            render:function() {
                $(this.el).append(Template);

                this.$el.find("#Cost_statistics_tbl").bootstrapTable({
                    columns:Cost_statisticsName,
                    data: {}
                });
                this.$el.find("#Prescription_statistic_tbl").bootstrapTable({
                    columns:Prescription_statisticName,
                    data: {}
                });
                this.$el.find("#Drug_statistical_tbl").bootstrapTable({
                    columns:Drug_statisticalName,
                    data: {}
                });
                this.$el.find("#Registration_statistics_tbl").bootstrapTable({
                    columns:Registration_statisticsName,
                    data: {}
                });
                this.$el.find("#Charge_statistical_tbl").bootstrapTable({
                    columns:Charge_statisticalName,
                    data: {}
                });
                return this;
            },
            initialize: function () {

                //this.StatisticalModel=new StatisticalModel;

                this.workloadStatisticsCollection=new workloadStatisticsCollection;

                this.listenTo(this.settleCollection,"detail",this.TheQuery);

            },
            events:{
                "click #drugpurchase_btn":"seeAbout"
            },
            seeAbout:function(){
                this.workloadStatisticsCollection.getData();
            },
            TheQuery:function(data){
                data = jctLibs.listToObject(data['chargeRecord'], "rows")['rows'];
                $(this.el).find("#Monthly_statistics").bootstrapTable("load",data);
                console.log(data);
            }
        });
        return view;
    });
