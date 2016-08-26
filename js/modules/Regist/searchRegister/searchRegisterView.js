define(['txt!../../Regist/searchRegister/searchRegister.html',
        '../../Regist/searchRegister/searchRegModel',
        'jctLibs', 'bootstrapTable', 'handlebars', 'backbone', 'amazeui', 'chosen'],
    function (Template, srModel, jctLibs, bootstrapTable, Handlebars, backbone) {
        //判断是否已经就诊
        function stateFunc(value) {
            return {
                0:'已就诊',
                1:'挂单',
                2:'现诊',
                3:'未就诊'
            }[value];
        }
        var view = Backbone.View.extend({
            initialize: function () {
                this.model=new srModel();
                this.listenTo(this.model, 'getRegInfo', this.renderResult);
            },

            render: function () {
                var that=this;
                $(this.el).html(Template);
                $(this.el).find("select").chosen({
                    width: "20rem",
                    no_results_text: '没有找到匹配的项！',
                    disable_search_threshold: 10
                });

                $(this.el).find("#regist_tbl").bootstrapTable({
                    columns: [
                        {field: 'register_no', title: '挂号编号',width:'20%'},
                        {field: 'register_fee', title: '挂号费'},
                        {field: 'department_name', title: '科室'},
                        {field: 'doctor_name', title: '医生姓名'},
                        {field: 'patient_name', title: '患者姓名'},
                        {field: 'patient_register_time', title: '挂号时间',width:'20%'},
                        {field: 'user_name', title: '操作员'},
                        {field: 'state', title: '挂号状态', formatter: stateFunc}
                    ],
                    pageSize:7,
                });


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
                this.model.getRegInfo();
                return this;
            },
            events: {
                "click .refresh_info": "searchReg",      //刷新按钮
                "click #search_reg": "searchReg",         //查询患者
                "keyup .search_wrapper input": "keuSearchReg",

            },
            keuSearchReg: function (e) {
                if(e.keyCode=='13'){
                    this.searchReg();
                }
            },
            renderResult: function (res) {
                if(res.errorNo==0){
                    $(this.el).find("#regist_tbl").bootstrapTable('load',res.rows);
                }
                else{
                    $(this.el).find("#regist_tbl").bootstrapTable('load',[]);
                }
            },
            searchReg: function () {
                var pat_id=$('#pat_id').val().trim(),
                pat_name=$('#pat_name').val().trim(),
                doctor=$('#doctor').val().trim(),
                dept=$('#dept').val().trim(),
                start=$('#start').val(),
                end=$('#end').val();
                var param={};
                if(pat_id!==""){
                    param['patient_id']=pat_id
                }
                if(pat_name!==""){
                    param['patient_name']=pat_name
                }
                if(doctor!==""){
                    param['doctor_name']=doctor
                }
                if(dept!==""){
                    param['department_name']=dept
                }
                if(start!==""){
                    param['startDateTime']=start
                }
                if(end!==""){
                    param['endDateTime']=end
                }
                this.model.getRegInfo(param);
            }

        });

        return view;
    });
