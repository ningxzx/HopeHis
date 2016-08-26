define(['txt!../../Medicine/mpriceChange/mpriceChange.html',
        '../../Medicine/mpriceChange/mpriceChangeModel',
        '../../Common/basicTable',
        'handlebars', 'backbone',"jctLibs"],
    function (Template,mpriceChangeModel, basicTable, Handlebars, backbone,jctLibs) {
        var opt=function (value, row, index) {
            return [
                '<a class="search_detail" href="javascript:void(0)" title="detail">',
                '调价',
                '</a>  ',
            ].join('');
        };

        var view = Backbone.View.extend({
            initialize: function () {
                //绑定入库记录集合
                this.inModel = new mpriceChangeModel();

                //侦听事件
                this.listenTo(this.inModel, "getrenderModel", this.renderRecopient);
                this.listenTo(this.inModel, "submitInfo", this.modifyPrice);

            },
            modifyPrice:function(data){
                if(data.rows['state']==100){
                    alert('提交成功');
                    this.inModel.getrenderModel();
                }
                else{
                    alert('提交失败');
                }
            },
            renderRecopient:function(data){
                if(data.errorNo==0){
                    var arr=data.rows;
                    for(var i=0;i<arr.length;i++){
                        if(arr[i].goods_type==10){
                            arr[i].goods_type='中药';
                        }else if(arr[i].goods_type==20){
                            arr[i].goods_type='西药';
                        }else if(arr[i].goods_type==30){
                            arr[i].goods_type='医疗器械';
                        }

                        if(arr[i].goods_way==10){
                            arr[i].goods_way='采购入库';
                        }else if(arr[i].goods_way==20){
                            arr[i].goods_way='自定义添加';
                        }
                    }
                    $(this.el).find("#price_change_table").bootstrapTable('load',arr);
                }

            },
            events: {
                "click #search_storage": "searchCheck",
                "click #refresh_level":"refreshlevel"
            },
            refreshlevel:function(){
                this.inModel.getrenderModel();
            },
            searchCheck:function(){
                var goodsname=$(this.el).find("#Drug_name").val(),
                    goodstype=$(this.el).find("#Drug-classification").val();

                this.inModel.getrenderModel(goodsname,goodstype);
            },
            render: function () {
                var that=this;
                $(this.el).html(Template);

                $(this.el).find("select").chosen({width: "100%", disable_search_threshold: 100});
                $(this.el).find("#price_change_table").bootstrapTable({
                    columns:[
                        {field: "", title: "", checkbox: true},
                        {field: "index", title: "序号", width: "5%", formatter: jctLibs.generateIndex},
                        {field: 'opt', title: '操作', formatter: opt,events:{
                            "click .search_detail":function(e, value, row, index){
                                var goods_code=row.goods_id,batch_no=row.batch_no;
                                $(that.el).find("#old_prescription_fee").val(row.goods_pesc_price);
                                $(that.el).find("#old_sale_fee").val(row.goods_sell_price);
                                $(that.el).find("#new_prescription_fee").val("");
                                $(that.el).find("#new_sale_fee").val("");

                                var $confirm = $(that.el).find('#my-confirm');
                                var $confirmBtn = $confirm.find('[data-am-modal-confirm]');
                                var $cancelBtn = $confirm.find('[data-am-modal-cancel]');
                                $confirmBtn.off('click.confirm.modal.amui').off('click').on('click', function () {

                                    var oldpf = $(that.el).find("#old_prescription_fee").val();
                                    var newpf = $(that.el).find("#new_prescription_fee").val();
                                    var oldsf = $(that.el).find("#old_sale_fee").val();
                                    var newsf = $(that.el).find("#new_sale_fee").val();

                                    that.inModel.submitInfo(goods_code,batch_no,oldpf,newpf,oldsf,newsf);
                                    $(that.el).find("#my-confirm").modal("close")
                                });

                                $cancelBtn.off('click.cancel.modal.amui').on('click', function () {
                                    // do something
                                });
                                //$(that.el).find("#alert_modal").modal();


                                $('#my-confirm').modal();
                            }
                        }
                        },
                        {field: 'batch_no', title: '药品批次'},
                        {field: 'goods_name', title: '药品名称'},
                        {field: 'goods_type', title: '药品分类'},
                        {field: 'goods_way', title: '药品来源'},
                        {field: 'producter_name', title: '生产厂家'},
                        {field: 'goods_id', title: '药品批号'},
                        {field: 'min_packing_unit', title: '剂量单位', width: '10%'},
                        {field: 'current_num', title: '库存'},
                        {field: 'goods_pesc_price', title: '处方价格'},
                        {field: 'goods_sell_price', title: '销售价格'},
                    ],
                    data:[],
                    pagination:true,
                });
                this.inModel.getrenderModel();
                return this;
            }
        });
        return view;
    });
