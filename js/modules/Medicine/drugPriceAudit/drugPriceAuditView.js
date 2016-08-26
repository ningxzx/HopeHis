define(['txt!../../Medicine/drugPriceAudit/drugPriceAudit.html',
        '../../Medicine/drugPriceAudit/priceChangeModel',
        'handlebars','backbone','jctLibs','bootstrapTable'],
    function (Template,priceChangeModel,Handlebars,backbone,jctLibs){
        var opt=function (value, row, index) {
            var arr=[];
              if(row['review_result']=='未审核'){
                arr=[
                    '<a class="row_audit" href="javascript:void(0)" title="审核通过">',
                    '审核',
                    '</a>  '
                ]
              };
            return arr.join('');
        };

        var view = Backbone.View.extend({
            initialize: function () {
                //绑定入库记录集合
                this.msModel=new priceChangeModel();

                //侦听事件
                this.listenTo(this.msModel, "getpricerender", this.getpriceRender);

                this.listenTo(this.msModel, "postpriceModel", this.PostpriceModel);
            },
            PostpriceModel:function(data){
                this.msModel.getpricerender();
            },
            getpriceRender:function(data){
                if(data.errorNo==0){
                    var arr=data.rows;
                    for(var i=0;i<arr.length;i++){
                        if(arr[i].review_result==00){
                            arr[i].review_result='未审核';
                        }else if(arr[i].review_result==10){
                            arr[i].review_result='已审核';
                        }else if(arr[i].review_result==20){
                            arr[i].review_result='未通过';
                        }
                    }
                    $(this.el).find("#change_record_table").bootstrapTable('load',arr);
                }

            },
            events:{
                "click #search_storage":"searchstorage",
                "click #refresh_level":"refreshlevel",
                //"click #sub_btn":"subBtn"
            },
            //subBtn:function(){
            //
            //},
            refreshlevel:function(){
                this.msModel.getpricerender();

            },
            searchstorage:function(){
                var goodsname=$(this.el).find("#Drug_name").val(),
                    goodstype=$(this.el).find("#check_state").val(),
                    stattime=$(this.el).find(".start_calender").val(),
                    endtime=$(this.el).find(".end_calender").val();
                this.msModel.getpricerender(goodsname,goodstype,stattime,endtime);
            },
            render:function() {
                 var that =this;
                $(this.el).html(Template);

                //初始化日期组件,结束日期必须在初始日期以前
                $(this.el).find(".start_calender").datepicker({
                    onRender: function (date, viewMode) {
                        var endDate = $(that.el).find(".end_calender").val();
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
                });
                $(this.el).find(".end_calender").datepicker({
                    onRender: function (date, viewMode) {
                        var startDate = $(that.el).find(".start_calender").val();
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
                });


                this.$el.find("#change_record_table").bootstrapTable({
                    pagination:true,
                    pageSize: 10,
                    sortName:'review_result',
                    sortOrder:'asc',
                    data: [],
                    columns:[
                        {field: "", title: "", checkbox: true},
                        {field: "index", title: "序号", width: "5%", formatter: jctLibs.generateIndex},
                        //{field: 'opt', title: '操作', formatter: opt,events:{
                        //     "click .row_audit":function(e, value, row, index){
                        //
                        //         var $confirm = $('#alert_modal');
                        //         var $confirmBtn = $confirm.find('[data-am-modal-confirm]');
                        //         var $cancelBtn = $confirm.find('[data-am-modal-cancel]');
                        //         $confirmBtn.off('click.confirm.modal.amui').off('click').on('click', function () {
                        //
                        //             var link = $(that.el).find(".am-panel-bd input:radio:checked").val();
                        //             var arr = [{
                        //                 review_memo: $("#Description_text").val(),
                        //                 batch_no: row['batch_no'],
                        //                 goods_code: row['goods_code'],
                        //                 sellPrice: row['after_change_sell_price'],
                        //                 pescPrice: row['after_change_pesc_price'],
                        //                 order_no:row['change_record_id']
                        //             }];
                        //             that.msModel.postpriceModel(link, arr);
                        //             $(that.el).find("#alert_modal").modal('close');
                        //         });
                        //
                        //         $cancelBtn.off('click.cancel.modal.amui').on('click', function () {
                        //             // do something
                        //         });
                        //         $(that.el).find("#alert_modal").modal();
                        //     },
                        //
                        //}
                        //},
                        {field: 'goods_name', title: '药品名称'},
                        {field: 'producter_name', title: '产商'},
                        {field: 'packing_spec', title: '规格'},
                        //{field: 'sorate_date', title: '类别'},
                        {field: 'batch_no', title: '批次号'},
                        {field: 'before_change_pesc_price', title: '调前处方价'},
                        {field: 'after_change_pesc_price', title: '调后处方价'},
                        {field: 'before_change_sell_price', title: '调前销售价'},
                        {field: 'after_change_sell_price', title: '调后销售价'},
                        {field: 'user_name',title:'调价人'},
                        {field: 'oper_date_time', title: '调价的日期'},
                        //{field: 'operate_type', title: '调价类型'},
                        {field: 'memo', title: '调价原因'},
                        //{field: 'review_result', title: '审核状态'},
                        //{field: 'review_memo', title: '审核说明'}
                    ],
                    //rowStyle: function(row, index) {
                    //    if (row['review_result'] == '未审核') {
                    //        return {
                    //            css: {"color": "red"}
                    //        }
                    //    }
                    //    else {
                    //        return {
                    //            css: {"color": "black"}
                    //        }
                    //    }
                    //},
                });
                $(this.el).find("select").chosen({width: "100%", disable_search_threshold: 100});
                this.msModel.getpricerender();

                return this;
            }
        });
        return view;
    });
