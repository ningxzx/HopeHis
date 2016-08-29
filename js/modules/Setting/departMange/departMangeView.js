define(['txt!../../Setting/departMange/departMange.html',
        '../../Setting/departMange/departMangeModel',
        '../../Setting/userMange/userModel',
        'backbone','underscore','intro', 'jctLibs', 'chosen', 'bootstrapTable'],
    function (Template, departmentModel, userModel, backbone,_,intro, jctLibs) {
        var formatState = function (value, row, index) {
            return value > 1 ? '<span style="color:red">禁用</span>' : '启用';
        };
        var view = backbone.View.extend({
            initialize: function () {
                var _this=this;
                this.userModel = new userModel();
                this.model = new departmentModel();
                <!--新建一个intro对象-->
                this.intro=intro();
                this.intro.setOption("nextLabel", "下一步  &rarr;");
                this.intro.setOption("prevLabel", "&larr; 上一步");
                this.intro.setOption("skipLabel", "退出引导");
                this.intro.setOption("doneLabel", "完成引导");
                <!--点击添加科室后弹出添加modal-->
                this.intro.onbeforechange(function(ele){
                    if(ele.id=='add_dept'){
                        _this.addDeptModal();
                    }
                })
                this.listenTo(this.model, "deptsGetted", this.renderDepts);
                this.listenTo(this.userModel, "getDoctors", this.getDoctors);
                this.listenTo(this.model, "deptAdded", this.afterAdd);
                this.listenTo(this.model, "deptUpdated", this.afterAdd);
                this.listenTo(this.model, "deptDeleted",this.refreshDept);
            },
            render: function () {
                var _this=this;
                $(this.el).html(Template);
                this.$el.find("select").chosen({
                    placeholder_text_single: "请选择医生",
                    width: "100%",
                    disable_search_threshold: 20
                });
                $(this.el).find("#department_table").bootstrapTable({
                    columns: [
                        {field: 'level', title: '科室优先级',sortable:true},
                        {field: 'department_name', title: '科室名称'},
                        {field: 'director_name', title: '科室主任'},
                        {field: 'state', title: '状态',formatter:formatState},
                        {
                            field: 'operation', title: '操作', formatter: jctLibs.operateFormatter, events: {
                            //删除科室
                            'click .row_remove': function (e, value, row, index) {
                                $("#dellde").attr('dept_id',row.department_id)
                                $("#dellde").modal({
                                    width:960,
                                    onConfirm: function(e) {
                                        _this.model.delDept(  $("#dellde").attr('dept_id'))
                                    },
                                    onCancel: function(e) {
                                        $("#dellde").modal('close');
                                    },
                                    closeViaDimmer:false
                                });
                                //_this.model.delDept(row.department_id)
                            },
                            //编辑科室
                            'click .row_edit': function (e, value, row, index) {
                                _this.clearModal();
                                var $deptInfo = $(".dept_info_panel");
                                $deptInfo.attr('type', 'edit');
                                $('.dept_info_title').html('编辑科室')
                                $deptInfo.find("#dept_name").val(row['department_name']);
                                $("#doctors").val(row['director_id']).trigger('chosen:updated');
                                $deptInfo.find('select[name="use_state"]').val(row['state']).trigger('chosen:updated');
                                $deptInfo.find('#level').val(row['level']);
                                $deptInfo.attr("dept_id",row['department_id'])
                                $deptInfo.show();
                            }
                        }
                        },
                    ],
                    data: []
                });
                this.model.getDepts();
                this.userModel.getDoctors(2);
                $(this.el).find('.dept_info_panel').hide();
                return this;
            },
            events: {
                'click #add_dept': "addDeptModal",
                'click #edit_confirm': 'addDept',
                "click #edit_reset": "clearModal",
                "click #edit_cancel": "cancelEdit",
                'click #refresh_dept': "refreshDept",
                "keyup #dept_name":'confirmAdd'
            },
            confirmAdd: function (e) {
                if(e.keyCode==13){
                    this.addDept()
                }
            },
            renderDepts: function (res) {
                if (res.errorNo == 0) {
                    <!--获取数据以后，开始介绍-->
                    $(this.el).find("#department_table").bootstrapTable('load', res.depts);
                    //this.intro.start();
                }else{
                    $(this.el).find("#department_table").bootstrapTable('load', []);
                }
            },
            refreshDept: function () {
                this.model.getDepts();
            },
            cancelEdit: function () {
                var $info = $(this.el).find(".dept_info_panel");
                $info.hide("fast");
            },
            getDoctors: function (res) {
                if (res.errorNo === 0) {
                    var doctors = res.rows;
                    doctors.forEach(function (doctor) {
                        jctLibs.appendToChosen($("#doctors"), doctor.account_id, doctor.doctor_name);
                    });
                }
            },
            clearModal: function () {
                var $deptInfo = $(this.el).find(".dept_info_panel");
                $deptInfo.find("input:text").val("");
                $deptInfo.find("#level").val("");
                $deptInfo.find("#doctors").val("").trigger("chosen:updated");
                $deptInfo.find('[name=use_state]').val(1).trigger("chosen:updated");
            },
            addDeptModal: function () {
                this.clearModal();
                $('.dept_info_panel').show();
                $('.dept_info_title').html('添加科室')
                $('.dept_info_panel').attr('type', 'add');
                $('#dept_name').focus();
            },
            addDept: function () {
                var $deptInfo = $(this.el).find(".dept_info_panel"), type = $deptInfo.attr('type'),dept_id=$deptInfo.attr('dept_id');
                //输入的验证
                var enterprise_id = sessionStorage.getItem('enterprise_id');
                var enterprise_name = sessionStorage.getItem('enterprise_name');
                var level = $('#level').val()||1;
                var department_name = $('#dept_name').val();
                var state = $('select[name="use_state"]').val();
                var director_id =  $('#doctors').val()||"";
                var director_name = $('#doctors').val()? $('#doctors').find('option:selected').text():"";
                if(department_name == '') {
                    alert('科室名称不可为空，请重试！');
                    return;
                }
                if (type == 'add') {
                    this.model.addDept({
                        enterprise_id: enterprise_id,
                        enterprise_name: enterprise_name,
                        department_name: department_name,
                        level: level,
                        state: state,
                        director_id: director_id,
                        director_name: director_name
                    });
                }
                else if (type == 'edit') {
                    this.model.updateDept({
                        enterprise_id: enterprise_id,
                        enterprise_name: enterprise_name,
                        department_name: department_name,
                        level: level,
                        state: state,
                        director_id: director_id,
                        director_name: director_name,
                        department_id:dept_id
                    });
                }
            },
            afterAdd: function (res) {
                if (res.status.toLowerCase() == 'ok') {
                    $('.dept_info_panel').hide();
                    this.model.getDepts();
                    $('#setting_alert').modal();
                }
                else if (res.status.toLowerCase() == 'exit') {
                    alert('该科室已存在');

                }
            }
        });
        return view;
    });

