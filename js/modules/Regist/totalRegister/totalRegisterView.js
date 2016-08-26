/**
 * Created by insomniahl on 16/5/5.
 */
define(['txt!../../Regist/totalRegister/totalRegister.html',
        '../../Regist/totalRegister/totalRegisterModel',
        'jctLibs', 'bootstrapTable', 'handlebars', 'backbone', 'amazeui', 'chosen'],
    function (Template, totalModel, jctLibs, bootstrapTable, Handlebars, backbone, amazeui, chosen) {
        var view = backbone.View.extend({
            initialize: function () {
                this.totalModel = new totalModel();
                this.listenTo(this.totalModel, "getDepartment", this.GetDepartment);
                this.listenTo(this.totalModel, "getdoctotal", this.GetDoctotal);
            },
            GetDepartment:function(res){
                if(res.errorNo==0) {
                    var data = res['data'];
                    $(this.el).find("#dept_total_tbl").bootstrapTable('load', data);
                }
                else{
                    $(this.el).find("#doc_total_tbl").bootstrapTable('load', []);
                }
            },
            GetDoctotal:function(res){
                if(res.errorNo==0) {
                    var data=res['data'];
                    $(this.el).find("#doc_total_tbl").bootstrapTable('load', data);
                }
                else{
                    $(this.el).find("#doc_total_tbl").bootstrapTable('load', []);
                }
            },
            render: function () {
                var _this=this,$el=$(this.el);
                $el.html(Template);
                $el.find("#start").datepicker();
                $el.find("#end").datepicker();
                $el.find("select").chosen({
                    width: "100%",
                    no_results_text: '没有找到匹配的项！',
                    disable_search_threshold: 10
                });
                //科室
                $el.find("#dept_total_tbl").bootstrapTable({
                    onClickRow:function(row){
                        var dept_id=row['department_id'];
                        $(_this.el).find('#my-confirm').modal({
                            width:800
                        });
                        $(_this.el).find('#my-confirm').attr('dept',dept_id)
                        _this.totalModel.getdoctotal(dept_id);
                    },
                    columns: [
                        //{field: 'drug_code', title: '医生号数统计列表'},
                        {field: 'department_name', title: '科室(点击获取科室医生号数统计)', footerFormatter: function (data) {
                            return '<span class="footerTotal">——————总数——————</span>'
                        }},
                        {field: 'total', title: '科室总挂号数', width:'25%', footerFormatter: function (data) {
                            return '<span class="footerTotal">'+data.reduce(function(pre, current){
                                return pre+ (+current['total']);
                            },0)+'</span>'
                        }},
                        {field: 'diagnosNum', title: '已就诊患者数',width:'25%', footerFormatter: function (data) {
                            return '<span class="footerTotal">'+data.reduce(function(pre, current){
                                return pre+ (+current['diagnosNum']);
                            },0)+'</span>'
                        }},
                        {field: 'notDiagnosNum', title: '未就诊患者数',width:'25%', footerFormatter: function (data) {
                            return '<span  class="footerTotal">'+data.reduce(function(pre, current){
                                return pre+ (+current['notDiagnosNum']);
                            },0)+'</span>'
                        }},
                    ],
                    data:[],
                    showFooter:true
                });
                //医生
                $el.find("#doc_total_tbl").bootstrapTable({
                    columns: [
                        {field: 'doctor_name', title: '医生', footerFormatter: function (data) {
                            return '<span class="footerTotal">总数</span>'
                        }},
                        {field: 'total', title: '挂号总数', width:'25%', footerFormatter: function (data) {
                            return '<span class="footerTotal">'+data.reduce(function(pre, current){
                                return pre+ (+current['total']);
                            },0)+'</span>'
                        }},
                        {field: 'diagnosNum', title: '已就诊患者数',width:'25%', footerFormatter: function (data) {
                            return '<span class="footerTotal">'+data.reduce(function(pre, current){
                                return pre+ (+current['diagnosNum']);
                            },0)+'</span>'
                        }},
                        {field: 'notDiagnosNum', title: '未就诊患者数',width:'25%', footerFormatter: function (data) {
                            return '<span class="footerTotal">'+data.reduce(function(pre, current){
                                return pre+ (+current['notDiagnosNum']);
                            },0)+'</span>'
                        }},
                    ],
                    data:[],
                    showFooter:true,
                    pageSize:5,
                });
                this.totalModel.getDepartment();
                return this;
            },
            events: {
                "click #search_reg": "searchTotal",
                "click #doc_total_wrapper .refresh_tool":'refreshDocData',
                "click #dept_total_wrapper .refresh_tool":'refreshTotal'
            },
            //查询统计信息
            searchTotal: function () {
                //var enter_id = sessionStorage.getItem("enterprise_id");
                //var dept = $("#dept").val();
                //var doc = $("#doc").val();
                var start = $(this.el).find(".start").val();
                var end = $(this.el).find(".end").val();
                if (start == "" && end == "") {
                    var now = new Date();
                    var date = now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate();
                    start = date;
                    end = date;
                } else if (start > end) {
                    alert("起始日期应小于等于结束日期");
                }
                this.totalModel.getDepartment(start, end);
            },
            refreshTotal: function () {
                this.totalModel.getDepartment();
            },
            refreshDocData: function () {
                var dept_id=$(this.el).find('#my-confirm').attr('dept');
                this.totalModel.getdoctotal(dept_id);
            }
        });

        return view;
    });
