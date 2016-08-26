define(['txt!../../Statistical/clinicFinancial/clinicFinancial.html',
        '../../Statistical/clinicFinancial/clinicFinancialModel',
        '../../Statistical/clinicFinancial/clinicFinancialCollection',
            'handlebars','backbone','jctLibs','bootstrapTable'],
        function (Template,clinicFinancialModel,clinicFinancialCollection,Handlebars,backbone,jctLibs){
            var Monthly_statistics=[
                {field:'item_name',title:'日',formatter: jctLibs.generateIndex},
                {field:'item_code',title:'支出'},
                {field:'item_size',title:'收入'},
                {field:'item_num',title:'现赊账'}
            ];
            var annual_statistics=[
                {field:'item_name',title:'月',formatter: jctLibs.generateIndex},
                {field:'item_code',title:'支出'},
                {field:'item_size',title:'收入'},
            ];
            var Income_statistics=[
                {field:'item_time',title:'日期'},
                {field:'item_code',title:'收入'},
                {field:'item_size',title:'金额'},
                {field:'item_num',title:'操作人'},
                {field:'item_discount',title:'患者姓名'}
            ];
            var Spending_statistics=[
                {field:'item_time',title:'日期'},
                {field:'item_code',title:'支出'},
                {field:'item_size',title:'金额'},
                {field:'item_num',title:'操作人'},
                {field:'item_discount',title:'供应商'}
            ];
            Spending_statistics.forEach(function(e){
                e.align='center';
                e.valign='middle';
            });
            Income_statistics.forEach(function(e){
                e.align='center';
                e.valign='middle';
            });
            annual_statistics.forEach(function(e){
                e.align='center';
                e.valign='middle';
            });
            Monthly_statistics.forEach(function(e){
                e.align='center';
                e.valign='middle';
            });
            var view = Backbone.View.extend({

                render:function() {
                    $(this.el).append(Template);

                    this.$el.find("#Monthly_statistics").bootstrapTable({
                        columns:Monthly_statistics,
                        data: {}
                    });
                    this.$el.find("#annual_statistics").bootstrapTable({
                        columns:annual_statistics,
                        data: {}
                    });

                    this.$el.find("#Income_statistics").bootstrapTable({
                        columns:Income_statistics,
                        data: {}
                    });
                    this.$el.find("#Spending_statistics").bootstrapTable({
                        columns:Spending_statistics,
                        data: {}
                    });
                    $(this.el).find(".calendar").datepicker();
                    $(this.el).find("select").chosen({width: "100%",disable_search_threshold: 100});
                    return this;
                },
                initialize: function () {

                    //this.clinicFinancialModel=new clinicFinancialModel;

                    this.clinicFinancialCollection=new clinicFinancialCollection;

                    this.listenTo(this.settleCollection,"detail",this.TheQuery);

                },
                events:{
                    "click #drugsTo_btn":"seeAbout"
                },
                seeAbout:function(){
                    this.clinicFinancialCollection.getData();
                },
                TheQuery:function(data){
                    var data = jctLibs.listToObject(data['chargeRecord'], "rows")['rows'];
                    $(this.el).find("#Monthly_statistics").bootstrapTable("load",data);
                    console.log(data);
                }
            });
            return view;
        });