define(['txt!../../Setting/dicTableMaintain/dicTableMaintain.html',
        '../../Setting/dicTableMaintain/dicTableModel',
        '../../Common/commonModel',
        '../../Common/basicTable',
        'handlebars','backbone','jctLibs','bootstrapTable'],
    function (Template,dicTableModel,commonModel,basicTable,Handlebars,backbone,jctLibs){
        var view = Backbone.View.extend({
            initialize: function () {
                //绑定model
                this.commonModel=new commonModel();
                this.model = new dicTableModel();
                //侦听事件
                this.listenTo(this.model, "addAdvice", this.addAdviceCallback);
                this.listenTo(this.model, "deleteAdvice", this.deleteAdviceCallback);

                this.listenTo(this.commonModel, "dicTabM", this.DicTabM);
            },
            DicTabM:function(data){
                //console.log(data)
                $(this.el).find("#packing_unit_table").bootstrapTable('load',data.rows);
            },
            events: {
                "click #dicTableXi .add_tool": "addModel",
                "click #refresh_level":"refreshLevel"
            },
            refreshLevel:function(){
                var data = {
                    enterprise_id: sessionStorage.getItem("enterprise_id")
                };
                this.commonModel.search('comm.packing_dict',data,'dicTabM');
            },
            addModel: function(){
                $('#add_modal').modal({
                    width:'900'
                })
            },
            render:function() {
                var $el = $(this.el);
                $(this.el).html(Template);
                //西药处方模板
                $el.find("#packing_unit_table").bootstrapTable({
                    columns: [
                        {field: "index", title: "序号", width: "5%", formatter: jctLibs.generateIndex},
                        {field: 'packing_unit', title: '药品单位名称', width: "10%"},
                        {field: 'record_id', title: '药品单位代码'},
                    ],
                    data: []
                });
                //中药处方模板
                $el.find("#tb_zh").bootstrapTable({
                    columns: [
                        {field: "index", title: "序号", width: "5%", formatter: jctLibs.generateIndex},
                        {field: 'opt', title: '操作', width: "10%"},
                        {field: 'batch_no', title: '药品批次'},
                        {field: 'recipient_person_name', title: '药品名称'},
                        {field: 'suppliers_name', title: '药品分类'},
                        {field: 'goods_total_costs', title: '药品来源'},
                        {field: 'need_pay_costs', title: '生产厂家'},
                        {field: 'charge_costs', title: '药品批号'},
                        {field: 'storate_date', title: '剂量单位', width: '10%'},
                        {field: 'review_date_time', title: '库存'},
                        {field: 'review_name', title: '生产日期'},
                        {field: 'review_result', title: '过期日期'},
                    ],
                    data: []
                });
                //检查处方模板
                $el.find("#tb_jian").bootstrapTable({
                    columns: [
                        {field: "index", title: "序号", width: "5%", formatter: jctLibs.generateIndex},
                        {field: 'opt', title: '操作', width: "10%"},
                        {field: 'batch_no', title: '药品批次'},
                        {field: 'recipient_person_name', title: '药品名称'},
                        {field: 'suppliers_name', title: '药品分类'},
                        {field: 'goods_total_costs', title: '药品来源'},
                        {field: 'need_pay_costs', title: '生产厂家'},
                        {field: 'charge_costs', title: '药品批号'},
                        {field: 'storate_date', title: '剂量单位', width: '10%'},
                        {field: 'review_date_time', title: '库存'},
                        {field: 'review_name', title: '生产日期'},
                        {field: 'review_result', title: '过期日期'},
                    ],
                    data: []
                });

                    var data = {
                        enterprise_id: sessionStorage.getItem("enterprise_id")
                    };
                    this.commonModel.search('comm.packing_dict',data,'dicTabM');

                return this;
            }
        });
        return view;
    });