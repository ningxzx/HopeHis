define(['txt!../../Statistical/department/department.html',
        '../../Statistical/department/departmentModel',
        'jctLibs',
        'handlebars','backbone','bootstrapTable'],
    function (Template,departmentModel,jctLibs,Handlebars,backbone){

        //docInfo.forEach(function(e){
        //    e.align='center';
        //    e.valign='middle';
        //});
        var view = Backbone.View.extend({
            render:function() {
                var $el = $(this.el), _this = this;
                $(this.el).html(Template);
                //
                $(this.el).find("#dtt_info_tbl").bootstrapTable({
                    columns: [
                        {field: 'level', title: '科室优先级',sortable:true},
                        {field: 'department_name', title: '科室名称'},
                        {field: 'director_name', title: '科室主任'},
                        {field: 'doctor_num', title: '科室医生数量'},
                        {field: 'nurse_num', title: '科室护士数量'},
                        {field: 'total_patient_nu', title: '科室接诊总量'},
                        //{field: 'state', title: '状态',formatter:formatState},
                    ],
                    data: []
                });
                this.model.getDepts();
                return this;

            },
            initialize: function () {

                this.model=new departmentModel();

                this.listenTo(this.model,"deptsGetted",this.DeptsGetted);

            },
            DeptsGetted:function(res){
                if (res.errorNo == 0) {
                    <!--获取数据以后，开始介绍-->
                    $(this.el).find("#dtt_info_tbl").bootstrapTable('load', res.depts);
                    //this.intro.start();
                }else{
                    //$(this.el).find("#department_table").bootstrapTable('load', []);
                }
            },
            events:{
                "click #search_dtt_btn":"searchdttbtn",
                "click .refresh_tool":"refreshTool"
            },
            refreshTool:function(){
                this.model.getDepts();
            }


        });
        return view;
    });
