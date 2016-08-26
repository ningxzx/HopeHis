define(['txt!../../Statistical/inspectionItem/inspectionItem.html',
        '../../Statistical/inspectionItem/inspectionItemModel',
        'handlebars','backbone','bootstrapTable'],
    function (Template,inspectionItemModel,Handlebars,backbone){

        var inspectionitemName=[
            {field:'item_name',title:'项目名称'},
            {field:'item_code',title:'项目数量'},
            {field:'item_size',title:'项目总金额'},

        ];
        inspectionitemName.forEach(function(e){
            e.align='center';
            e.valign='middle';
        });
        var view = Backbone.View.extend({
            render:function() {
                var $el=$(this.el),_this=this;

                $(this.el).append(Template);

                this.$el.find("#inspectionitem_tbl").bootstrapTable({
                    columns:inspectionitemName,
                    data: [{}]
                });
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

                return this;
            },
            initialize: function () {

                //this.StatisticalModel=new StatisticalModel;


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
