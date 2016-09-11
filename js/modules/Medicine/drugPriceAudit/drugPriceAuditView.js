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
                    stattime=$(this.el).find(".start").val(),
                    endtime=$(this.el).find(".end").val(),
                    data = {};
                if (goodsname) {
                    data['goods_name'] = goodsname;
                }
                if (stattime) {
                    data['start_date_time'] = stattime;
                }
                if (endtime) {
                    data['end_date_time'] = endtime;
                }
                this.msModel.getpricerender(data);
            },
            render:function() {
                 var that =this;
                $(this.el).html(Template);
                this.$el.find("#change_record_table").bootstrapTable({
                    pagination:true,
                    pageSize: 10,
                    sortName:'review_result',
                    sortOrder:'asc',
                    data: [],
                    columns:[
                        {field: "", title: "", checkbox: true},
                        {field: "index", title: "序号", width: "5%", formatter: jctLibs.generateIndex},
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
