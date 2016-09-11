define(['txt!../../Medicine/mcurStorage/mcurStorage.html',
        '../../Medicine/mcurStorage/mcurStorageModel',
        'handlebars','backbone','../../Common/basicTable',
        "jctLibs","tableExport","amazeui"],
    function (Template,mcurStorageModel,Handlebars,backbone,basicTable,jctLibs,tableExport){
        var formatDate= function (value,row,index) {
            return value.split(' ')[0]
        }
        var showExcelNum= function (value,row,index) {
            return '\t'+value+'\t';
        }
        var inventoryCols=[
            {field: "index", title: "序号", width: "5%", formatter: jctLibs.generateIndex},
            {field: 'batch_no', title: '药品批次', width: "10%"},
            {field: 'goods_name', title: '药品名称', width: "10%"},
            {field: 'goods_type', title: '药品分类'},
            {field: 'goods_way', title: '药品来源'},
            {field: 'producter_name', title: '生产厂家', width: "12%"},
            {field: 'goods_id', title: '药品批号',formatter:showExcelNum},
            {field: 'min_packing_unit', title: '剂量单位', width: '8%'},
            {field: 'current_num', title: '库存',sortable:true},
            {field: 'goods_cost_price', title: '成本价（元）'},
            {field: 'goods_pesc_price', title: '处方价（元）'},
            {field: 'goods_sell_price', title: '售价（元）'},
            {field: 'product_date_time', title: '生产日期',formatter:formatDate},
            {field: 'deadline_date_time', title: '过期日期',formatter:formatDate},
        ];
        var view = Backbone.View.extend({
            initialize: function () {
                //绑定入库记录集合
                this.msModel=new mcurStorageModel();
                //侦听事件
                this.listenTo(this.msModel, "getmcurStorage", this.renderinvet);
            },
            events:{
                //"click .excel_tool":"exportExcel",
                "click #search_batch":"searchbatch",
                "click .store_refresh_tool":"Refresh",
                "keyup #Drug_name":'nameKeySearch',
                "keyup #batch_no":'nameKeySearch'
            },
            nameKeySearch:function(e){
                if(e.keyCode==13){
                    this.searchbatch();
                }
            },
            Refresh:function(){
                this.msModel.getmcurStorage();
            },
            searchbatch:function(){
                var goodsname=$(this.el).find("#Drug_name").val().trim(),
                    storatebatchno=$(this.el).find("#batch_no").val().trim(),
                    goodstype=$(this.el).find("#Drug_classification").val();
                this.msModel.getmcurStorage(goodsname,storatebatchno,goodstype);
            },
            renderinvet:function(data){
                var data=data.rows;
                for(var i=0;i<data.length;i++){
                    if(data[i].goods_type==10){
                        data[i].goods_type='中药';
                    }else if(data[i].goods_type==20){
                        data[i].goods_type='西药';
                    }else if(data[i].goods_type==30){
                        data[i].goods_type='医疗器械';
                    }

                    if(data[i].goods_way==10){
                        data[i].goods_way='采购入库';
                    }else if(data[i].goods_way==20){
                        data[i].goods_way='自定义添加';
                    }
                }
                $(this.el).find('#curStorage_batch_table').bootstrapTable('load',data)
            },
            //导出excel
            //exportExcel: function (e) {
            //    //先进行请求
            //    $(e.target).closest(".am-panel.table_panel").tableExport({type:'excel'});
            //},
            directory:function(){
                this.$el.find('#Drugs_add').bootstrapTable({
                    data: []
                });
                return this;
            },
            refund_search: function(){

            },
            render:function() {
                $(this.el).html(Template);

                $(this.el).find("input:checkbox").uCheck("enable");
                $(this.el).find("select").chosen({width: "100%",disable_search_threshold: 100});

                this.msModel.getmcurStorage();

                $(this.el).find('#curStorage_batch_table').bootstrapTable({
                    columns:inventoryCols,
                    data:[],
                    pagination:true,
                    pageSize:10,
                    pageList:[5,10]
                })
                return this;
            },
        });
        return view;
    });
