define(['txt!../../Medicine/mnumChange/mnumChange.html',
        '../../Medicine/mnumChange/mnumChangeModel',
        '../../Common/commonModel',
        'handlebars', 'backbone', 'bootstrapTable'],
    function (Template, mnumChangeModel, commonModel, Handlebars, backbone) {
        var view = Backbone.View.extend({
            initialize: function () {
                this.commonModel = new commonModel();
                this.model = new mnumChangeModel();

                this.listenTo(this.model, "getRecord", this.GetRecord);

            },
            GetRecord: function (data) {
                //console.log(data.rows)
                var arr = data.rows;
                $(this.el).find("#storage_change_table").bootstrapTable('load', arr);
            },
            events: {
                "click #search_numchange": "searchNumchange",
                "click #refresh_level":"refreshLevel"
            },
            refreshLevel:function(){

                this.model.getRecord();
            },
            searchNumchange: function () {
                var $el = $(this.el),
                    name = $el.find("#docor_name").val(),
                    stattime = $el.find('.start_calender').val(),
                    endtime = $el.find('.end_calender').val(),
                    type = $el.find('#change_type').val();

                this.model.getRecord(name, stattime, endtime, type);
            },
            render: function () {
                var that = this;
                $(this.el).html(Template);
                $(this.el).find("#storage_change_table").bootstrapTable({
                    columns: [
                        {field: 'change_record_id', title: '记录ID',width:'12%'},
                        {field: 'goods_id', title: '货物ID',width:'15%'},
                        {field: 'goods_name', title: '名称',width:'15%'},
                        {field: 'goods_spec', title: '规格',width:'10%'},
                        {field: 'before_change_num', title: '变动前数量'},
                        {field: 'after_change_num', title: '变动后数量'},
                        {field: 'min_packing_unit', title: '单位'},
                        //{field:'prodcuter',title:'生产商'},
                        //{field:'supplier_name',title:'供应商全称'},
                        //{field:'product_date',title:'生产日期'},
                        //{field:'deadlint',title:'失效日期'},
                        //{field:'operate_type',title:'变动类型'},
                        {field: 'change_way', title: '变动原因',formatter: function (value) {
                            var data = {
                                "ADD":"采购入库",
                                "PRES":"处方用药",
                                "SELL":"销售用药",
                                'LOSS':'报损',
                                'CHECKADD':'盘点入库',
                                'CHECKLOSS':'盘点出库',
                            };
                            return data[value];
                        }},
                        {field: 'oper_date_time', title: '变动时间',width:'20%'},
                    ],
                    data: [],
                    pagination:true,
                    pageSize:8,
                    pageList:""
                });
                $(this.el).find("select").chosen({width: "100%", disable_search_threshold: 100});
                //this.commonModel.search('admin.goods_num_change',{enterprise_id:sessionStorage.getItem('enterprise_id')},'getRecord')

                this.model.getRecord();
                return this;
            }
        });

        return view;
    });
