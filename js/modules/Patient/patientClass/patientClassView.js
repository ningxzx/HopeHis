define(['txt!../../Patient/patientClass/patientClass.html',
        '../../Common/patRecord/patRecordView',
        '../../Common/commonModel',
        '../../Patient/patientModel',
        'handlebars', 'backbone', 'jctLibs', 'bootstrapTable'],
    function (Template, patRecordView,commonModel, patientModel, Handlebars, backbone, jctLibs) {
        var opt2 = function (value, row, index) {
            return [
                '<a class="row_history" href="javascript:void(0)" title="detail">',
                '就诊记录',
                '</a>  '
            ].join('');
        };
        var view = Backbone.View.extend({
            initialize: function () {
                this.commonModel = new commonModel();
                this.model = new patientModel();
                this.patRecordView=new patRecordView();
                //this.listenTo(this.commonModel, 'getPatRecord', this.renderDiagRecord);//获取就诊记录
                this.listenTo(this.commonModel, 'getGroup', this.renderGroup);//获取就诊记录
                this.listenTo(this.model, 'patsGetted', this.renderPats);
                this.listenTo(this.model, 'submitGroup', this.submitCallBack);
                this.listenTo(this.model, 'updateGroup', this.submitCallBack);
                this.listenTo(this.model, 'groupDelete', this.submitCallBack);
            },
            events: {
                "click #role_table_wrapper .add_tool": "addtool",
                "click #role_table_wrapper .refresh_tool": "refreshGroup",
                "click #menu_table_wrapper .refresh_tool": 'refreshPat',
                'click #submit_group': 'addGroup',
                'blur #group_name':'checkName',
                'blur #min_age,#max_age':'checkAge',
            },
            checkName: function (e) {
                var $target = $(e.currentTarget),
                    name = $target.val();
                var src = $(e.target).closest(".am-g").find("img"),
                    span=src.next("span");
                if (!name) {
                    src.attr('src','imgs/wrong.png');
                    span.html("分组名称不能为空");
                }else{
                    src.attr('src','imgs/right.png');
                    span.html("");
                }
            },
            checkAge: function (e) {
                var $target = $(e.currentTarget),
                    age = $target.val();
                var src = $(e.target).closest(".am-g").find("img"),
                    span=src.next("span");
                if (age&&!/^[0-9]*$/.test(age)) {
                    src.attr('src','imgs/wrong.png');
                    span.html("年龄必须为数字");
                }else{
                    src.attr('src','imgs/right.png');
                    span.html("");
                }
            },
            refreshGroup: function () {
                this.commonModel.search('diagnosis.group',{'doctor_account_id':sessionStorage.getItem('user_id')},'getGroup')
            },
            refreshPat: function () {
                this.model.getPats();
            },
            addtool: function () {
                var $modal=$(this.el).find('#new_modal');
                $modal.attr('type','add');
                this.resetModal();
                $modal.modal({
                    width: 800,
                });
            },
            resetModal: function () {
                var $modal=$(this.el).find('#new_modal');
                $modal.find('input').val('');
                $('#new_sex').val('N').trigger('chosen:updated');
                $('#new_marriage').val('BX').trigger('chosen:updated');
                $modal.find('img').attr('src','imgs/info.png');
                $('#name_tips').html('必需');
                $('#age_tips').html('患者年龄区间，可空');
                $('#sex_tips').html('患者性别');
                $('#marriage_tips').html('患者婚姻状况');
                $('#disease_tips').html('患者病种，非必需，后续版本修改为ICD10');
            },
            addGroup: function () {
                var type=$('#new_modal').attr('type');
                var name = $('#group_name').val(),
                    minAge = $('#min_age').val(),
                    maxAge = $('#max_age').val(),
                    patient_sex = $('#new_sex').val(),
                    patient_sex_text = $('#new_sex option:selected').html(),
                    marry_state = $('#new_marriage').val(),
                    marry_state_text = $('#new_marriage option:selected').html(),
                    disease = $('#new_illness').val(),
                    param={},remarkArr=[];
                if(!name){
                    return;
                }
                param.group_name=name;
                if(minAge){
                    param.minAge=minAge;
                    remarkArr.push('起至 '+minAge+' 岁');
                }
                if(maxAge){
                    param.maxAge=maxAge;
                    remarkArr.push('截至 '+maxAge+' 岁');
                }
                if(patient_sex&&patient_sex!='N'){
                    param.patient_sex=patient_sex;
                    remarkArr.push(patient_sex_text);
                }
                if(marry_state&&marry_state!='BX'){
                    param.marry_state=marry_state;
                    remarkArr.push(marry_state_text);
                }
                if(disease){
                    param.disease=disease;
                    remarkArr.push(disease);
                }
                param.remark=remarkArr.join('; ');
                if(type=='add') {
                    this.model.submitGroup(param);
                }
                else{
                    var group_id=type=$('#new_modal').attr('group_id');
                    this.model.updateGroup(param,group_id);
                }
                return false;
            },
            render: function () {
                var that = this;
                //TODO:根据查询条件填写相应的sessionStorage
                $(this.el).html(Template);
                $(this.el).find("#grouping_tbl").bootstrapTable({
                    columns: [
                        {field: "checked", title: "",checkbox:true,valign:'middle'},
                        {field: "index", title: "序号", width: "5%", formatter: jctLibs.generateIndex},
                        {field: 'group_name', title: '名称',width: "25%", },
                        {field: 'remark', title: '备注',align:'left',halign:'center'},
                        {
                            field: "operate", title: "操作", width: "30%", formatter: jctLibs.operateFormatter,
                            events: {
                                "click .row_edit": function (e, value, row, index) {
                                    var $modal=$(that.el).find('#new_modal'),condition=row['group_condition'];
                                    that.resetModal();
                                    $('#group_name').val(row['group_name']);
                                    $('#min_age').val(condition['minAge']);
                                    $('#max_age').val(condition['maxAge']);
                                    $('#new_sex').val(condition['patient_sex']).trigger('chosen:updated');
                                    $('#new_marriage').val(condition['marry_state']).trigger('chosen:updated');
                                    $('#new_illness').val(condition['disease']);
                                    $modal.attr('type','edit');
                                    $modal.attr('group_id',row['group_id']);
                                    $modal.modal({
                                        width: 800,
                                    });
                                    e.stopPropagation();
                                },
                                "click .row_remove": function (e, value, row, index) {
                                   that.model.delGroup(row['group_id']);
                                    e.stopPropagation();
                                }
                            }
                        },
                    ],
                    data: [],
                    clickToSelect:true,
                    singleSelect:true,
                    onCheck: function (row, $element) {
                        that.model.getGroupPats(row['group_condition'])
                    },
                    onUncheck: function (row, $element) {
                        that.model.getPats();
                    },
                });
                $(this.el).find("#patientClass_tbl").bootstrapTable({
                    columns: [
                        {field: "index", title: "序号", formatter: jctLibs.generateIndex},
                        {field: 'patient_name', title: '姓名'},
                        {field: 'patient_sex', title: '性别', formatter: jctLibs.generateSex},
                        {field: 'patient_birth', title: '年龄', formatter: jctLibs.generateAge},
                        {
                            field: "operate", title: "操作", width: "30%", formatter: opt2,
                            events: {
                                "click .row_history": function (e, value, row, index) {
                                    that.patRecordView.render(row['patient_id']);
                                    $(that.el).find('#patient_history .am-modal-bd').html(that.patRecordView.el);
                                    $(that.el).find('#patient_history').modal({
                                        width: 960,
                                    });
                                }
                            }
                        },
                    ],

                    data: []
                });
                $(this.el).find("select").chosen({width: "100%", disable_search_threshold: 100});
                this.model.getPats();
                //this.commonModel.search('diagnosis.group',{'doctor_account_id':sessionStorage.getItem('user_id')},'getGroup');
            },
            renderPats: function (res) {
                $(this.el).find("#patientClass_tbl").bootstrapTable('load', res.rows||[])
            },
            renderGroup: function (res) {
                $(this.el).find("#grouping_tbl").bootstrapTable('load', res.rows||[])
            },
            submitCallBack: function (res) {
                if(res.result=='OK') {
                    this.commonModel.search('diagnosis.group', {'doctor_account_id': sessionStorage.getItem('user_id')}, 'getGroup');
                    $(this.el).find('#new_modal').modal('close');
                }
            },
        });
        return view;
    });
