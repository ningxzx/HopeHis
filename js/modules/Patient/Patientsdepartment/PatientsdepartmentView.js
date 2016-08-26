/**
 * Created by insomniahl on 15/12/17.
 */
define(['txt!../../Patient/Patientsdepartment/Patientsdepartment.html',
        '../../Common/patRecord/patRecordView',
        '../../Patient/patientModel',
        'backbone', 'jctLibs', 'bootstrapTable'],
    function (Template,patRecordView, patModel, backbone, jctLibs, bootstrapTable) {
        var opt = function (value, row, index) {
            return [
                '<a class="row_history" href="javascript:void(0)" title="detail">',
                '就诊记录',
                '</a>  '
            ].join('');
        };
        var patientGroupView = Backbone.View.extend({
            initialize: function () {
                this.patRecordView=new patRecordView();
                //this.patientModel = new HospitalpatientsModel();

                this.model = new patModel();

                //监听
                this.listenTo(this.model, "patsGetted", this.renderPat);
            },
            render: function () {
                var that = this;


                $(this.el).html(Template);
                $(this.el).find("#pat_tbl").bootstrapTable({
                    columns: [
                        {field: "index", title: "序号", formatter: jctLibs.generateIndex},
                        {field: 'patient_name', title: '姓名'},
                        {field: 'patient_sex', title: '性别', formatter: jctLibs.generateSex},
                        {field: 'patient_birth', title: '年龄', formatter: jctLibs.generateAge},
                        {
                            field: "operate", title: "操作", width: "30%", formatter: opt,
                            events: {
                                //"click .row_edit": function (e, value, row, index) {
                                //    $(that.el).find('#my-confirm').modal({
                                //        width: 1200,
                                //    });
                                //},
                                "click .row_history": function (e, value, row, index) {
                                    //console.log(row)
                                    //that.patRecordView.render();
                                    that.patRecordView.render(row['patient_id']);
                                    $(that.el).find('#patient_history .am-modal-bd').html(that.patRecordView.el);
                                    $(that.el).find('#patient_history').modal({
                                        width: 1200,
                                    });
                                }
                            }
                        },
                    ],
                    data: []
                });
                this.model.getPats({department_id: sessionStorage.getItem('department_id')})
                return this;
            },
            events: {
                "click #sc_Patientsdepartment":"Patientsdepartment"
            },
            Patientsdepartment:function(){

            },
            renderPat: function (res) {
                $(this.el).find("#pat_tbl").bootstrapTable('load', res.rows || [])
            },

        });

        return patientGroupView;
    });