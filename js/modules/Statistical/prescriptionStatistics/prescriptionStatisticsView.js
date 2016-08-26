/**
 * Created by insomniahl on 16/6/12.
 */
define(['txt!../../Statistical/prescriptionStatistics/prescriptionStatistics.html',
        '../../Statistical/prescriptionStatistics/prescriptionStatisticsModel',
        'handlebars', 'backbone', 'bootstrapTable'],
    function (Template, prescriptionStatisticsModel, Handlebars, backbone) {

        var docInfo = [
            {field: 'account_id', title: '医生编号'},
            {field: 'doctor_name', title: '医生姓名'},
            //{field: 'department_id', title: '科室编号'},
            {field: 'department_name', title: '科室名称'},
            {field: 'patient_num', title: '患者总数'},
            {field: 'all_pres_num', title: '处方总数'},
            {field: 'all_wmed_num', title: '西药处方总数'},
            {field: 'wmed_ratio', title: '西药处方比例'},
            {field: 'all_chmed_num', title: '中药处方总数'},
            {field: 'chmed_ratio', title: '中药处方比例'}
        ];

        var view = Backbone.View.extend({
            initialize: function () {
                this.psModel = new prescriptionStatisticsModel;

                this.listenTo(this.psModel, "doctorResult", this.getDocResult);
            },
            render: function () {
                var $el = $(this.el), _this = this;
                $(this.el).append(Template);
                this.$el.find("#doctor_info_tbl").bootstrapTable({
                    columns: docInfo,
                    data: []
                });
                this.searchDocInfo();
                return this;
            },
            events: {
                "click #search_doc_btn": "searchDocInfo"
            },
            searchDocInfo: function () {
                var data = {
                    doc_id: $("#ps .doctor_id").val(),
                    depart: $("#ps .department_name").val(),
                    start: $("#ps .start").val() || new Date().toLocaleDateString().replace(/\//g, "-"),
                    end: $("#ps .end").val() || new Date().toLocaleDateString().replace(/\//g, "-")
                };
                this.psModel.getDoctorInfo(data);
            },
            getDocResult: function (result) {
                if (result.errorNo == "0") {
                    $("#doctor_info_tbl").bootstrapTable("load", result.data);
                } else {
                    $("#doctor_info_tbl").bootstrapTable("load", []);
                }
            }
        });
        return view;
    });
