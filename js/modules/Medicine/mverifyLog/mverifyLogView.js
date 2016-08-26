define(['txt!../../Medicine/mverifyLog/mverifyLog.html',
        '../../Medicine/mverifyLog/mverifyLogModel',
        'handlebars', 'backbone', 'bootstrapTable', 'amazeui', 'chosen', 'jctLibs'],
    function (Template,mverifyLogModel, Handlebars, backbone, bootstrapTable, amazeui, chosen, jctLibs) {
        var mverifyLogView = Backbone.View.extend({
            initialize: function () {
                this.model=new mverifyLogModel();
                this.listenTo(this.model,"getrendeMy",this.getRendeMy);
            },
            getRendeMy:function(data){
                //console.log(data);
                var data=data.rows;
                $(this.el).find("#table_mverifyLog").bootstrapTable("load",data)
            },
            render: function () {
                var $el=$(this.el),_this=this;
                $el.html(Template);
                $el.find("input[type='radio']").uCheck();
                $el.find("select").chosen({
                    width: "100%",
                    disable_search_threshold: 100
                });
                $(this.el).find("#table_mverifyLog").bootstrapTable({
                    columns: [
                        {field: "index", title: "序号", formatter: jctLibs.generateIndex,
                            footerFormatter: function (data) {
                                return "合计";
                            }},
                        {field: 'goods_name', title: '货物名称'},
                        {field: 'user_name', title: '盘点人'},
                        {field: 'goods_spec', title: '货物规格'},
                        {field: 'before_change_num', title: '盘点前数量'},
                        {field: 'after_change_num', title: '盘点后数量'},
                        {field: 'goods_cost_price', title: '货物成本'},
                        {field: 'goods_sell_price', title: '货物销售价'},
                        {field: 'set_ponit_date_time', title: '盘点时间',sortable:true},

                    ],
                    data: [],
                    pageSize: 10,
                    pageList: [5, 10],
                    pagination: true,
                    sortName:'set_ponit_date_time',
                    sortOrder:'desc',
                    rowStyle: function (row) {
                        if (row["change_state"] == "20") {
                            return {
                                css: {"color": "red"}
                            };
                        }
                        else if(row["change_state"] == "10"){
                            return {
                                css: {"color": "limegreen"}
                            };
                        }
                        else {
                            return {
                                css: {"color": "black"}
                            }
                        }
                    }
                });
                this.model.getrendeMy();
                return this;
            },
            events:{
                "click #refresh_level":"mvBtn",
                "click #mv_Btn":"mvBtn"
            },
            mvBtn:function(){
                var timeS=$(this.el).find(".start").val(),
                    timeD=$(this.el).find(".end").val(),
                    mvdocol=$(this.el).find("#mv_docol").val(),
                    goods_name=$(this.el).find("#goods_name").val(),
                    batchno=$(this.el).find("#med_batch").val(),
                    changeState=$(this.el).find("#mverify_type").val();
                this.model.getrendeMy(timeS,timeD,batchno,mvdocol,goods_name,changeState);
            },
            //refreshlevel:function(){
            //    this.model.getrendeMy();
            //}
        });
        return mverifyLogView;
    });
