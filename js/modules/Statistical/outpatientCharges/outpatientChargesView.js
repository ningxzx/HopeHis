define(['txt!../../Statistical/outpatientCharges/outpatientCharges.html',
        '../../Statistical/outpatientCharges/outpatientModel',
        "amazeui","chosen",
        'handlebars','backbone','bootstrapTable'],
    function (Template,outpatientModel,Handlebars,backbone){

        var outpatientName=[
            {field:'item_name',title:'药物名称'},
            {field:'item_code',title:'编码'},
            {field:'item_size',title:'规格'},
            {field:'item_num',title:'数量'},
            {field:'item_discount',title:'单位'},
            {field:'item_actul_fee',title:'应收费用'},
            {field:'item_org_total_fee',title:'实收费用'}
        ];
        outpatientName.forEach(function(e){
            e.align='center';
            e.valign='middle';
        });
        var view = Backbone.View.extend({
            render:function() {
                var $el=$(this.el),_this=this;
                $(this.el).append(Template);
                $el.find(".start_calender").each(function (i, elem) {
                    $(elem).datepicker({
                        onRender: function (date, viewMode) {
                            var endDate = $($(_this.el).find(".end_calender")[i]).val();
                            if (endDate) {
                                var inTime = new Date(endDate);
                                var inDay = inTime.valueOf();
                                var inMoth = new Date(inTime.getFullYear(), inTime.getMonth(), 1, 0, 0, 0, 0).valueOf();
                                var inYear = new Date(inTime.getFullYear(), 0, 1, 0, 0, 0, 0).valueOf();
                                // 默认 days 视图，与当前日期比较
                                var viewDate = inDay;
                                switch (viewMode) {
                                    // moths 视图，与当前月份比较
                                    case 1:
                                        viewDate = inMoth;
                                        break;
                                    // years 视图，与当前年份比较
                                    case 2:
                                        viewDate = inYear;
                                        break;
                                }
                                return date.valueOf() >= viewDate ? 'am-disabled' : '';
                            }

                        }
                    })
                });
                $el.find(".end_calender").each(function (i, elem) {
                    $(elem).datepicker({
                        onRender: function (date, viewMode) {
                            var startDate = $($(_this.el).find(".start_calender")[i]).val();
                            if (startDate) {
                                var inTime = new Date(startDate);
                                var inDay = inTime.valueOf();
                                var inMoth = new Date(inTime.getFullYear(), inTime.getMonth(), 1, 0, 0, 0, 0).valueOf();
                                var inYear = new Date(inTime.getFullYear(), 0, 1, 0, 0, 0, 0).valueOf();
                                // 默认 days 视图，与当前日期比较
                                var viewDate = inDay;
                                switch (viewMode) {
                                    // moths 视图，与当前月份比较
                                    case 1:
                                        viewDate = inMoth;
                                        break;
                                    // years 视图，与当前年份比较
                                    case 2:
                                        viewDate = inYear;
                                        break;
                                }
                                return date.valueOf() <= viewDate ? 'am-disabled' : '';
                            }

                        }
                    })
                });
                this.$el.find("#outpatientCharges_tbl").bootstrapTable({
                    columns:outpatientName,
                    data: [{}]
                });
                $(this.el).find("#state").chosen({width: "100%",disable_search_threshold: 100});
                $(this.el).find("#Charge_type").chosen({width: "100%",disable_search_threshold: 100});
                $(this.el).find("#member").chosen({width: "100%",disable_search_threshold: 100});
                //
                //$(this.el).find("#Outpatient_start").datepicker();
                //$(this.el).find("#Outpatient_end").datepicker();

                return this;
            },
            initialize: function () {

                this.outpatientModel=new outpatientModel;

                this.listenTo(this.settleCollection,"detail",this.TheQuery);

            },
            events:{
                "click #drugpurchase_btn":"seeAbout"
            },
            seeAbout:function(){
                this.outpatientCollection.getData();
            },
            TheQuery:function(data){
                data = jctLibs.listToObject(data['chargeRecord'], "rows")['rows'];
                $(this.el).find("#Monthly_statistics").bootstrapTable("load",data);
                console.log(data);
            }
        });
        return view;
    });
