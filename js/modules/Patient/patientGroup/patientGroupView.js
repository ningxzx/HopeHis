/**
 * Created by insomniahl on 15/12/17.
 */
define(['txt!../../Patient/patientGroup/patientGroup.html',
        '../../Common/patientModel',
        '../../Common/patientCollection',
        '../../Common/patientGroupModel',
        '../../Common/medicalRecordModel',
        'backbone', 'jctLibs', 'bootstrapTable'],
    function (Template, patientModel, patientCollection, patientDoctorRelationModel, medicalRecordModel, backbone, jctLibs, bootstrapTable) {
        var patientGroupView = Backbone.View.extend({
            initialize: function () {
                this.patientModel = new patientModel();
                this.patientCollection = new patientCollection();
                this.patientDoctorRelationModel = new patientDoctorRelationModel();
                this.medicalRecordModel = new medicalRecordModel();

                //监听
                this.listenTo(this.patientDoctorRelationModel, "groupNameResult", this.groupNameResult);
                this.listenTo(this.patientDoctorRelationModel, "groupResult", this.showPatientGroupResult);
                this.listenTo(this.medicalRecordModel, "patientInfoResult", this.showMedicalRecord);
            },
            render: function () {
                $(this.el).html(Template);

                //加载医生的分组
                //TODO:添加sessionLocalStorage.doc_id
                this.patientDoctorRelationModel.getGroupName("ERP10001", "doc_id");
                return this;
            },

            events: {
                "change #select_group": "showPatientGroup",
                //"click #resetGroup": "resetAll",
                "click #createGroup": "createGroup",
                "click #saveCreate": "saveCreate",
                "click #resetCreate": "resetCreate"
            },

            //重置按钮
            resetAll: function () {
                $(this.el).find("#tips").addClass("hid");
                this.patientCollection.getGroupName("ERP10001", "doc_id");
                $(this.el).find("#patient_group").bootstrapTable({data: []});
                $(this.el).find("#patient_detail").bootstrapTable({data: []});
            },

            //获取患者分组
            groupNameResult: function (result) {
                if(result.errorNo == 1){
                    $(this.el).find("#select_group option").remove();
                }
                $(this.el).find("#select_group option").remove();
                if (result.errorNo == 0) {
                    var opts = "<option></option>";
                    var count = result.resData.length;
                    for (var i = 0; i < count; i++) {
                        opts += "<option value='" + result.resData + "'>" + result.resData +
                            "</option>";
                    }
                    $(this.el).find("#select_group").append(opts);
                } else if (result.errorNo == -1) {
                    $(this.el).find("#tips").removeClass("hid").find("p").text("获取患者分组失败，请点击重置按钮");
                }
            },

            //显示分组患者
            showPatientGroup: function () {
                var groupName = $(this.el).find("#select_group").val();
                if (groupName != "") {
                    this.patientDoctorRelationModel.getPatientGroup("ERP10001", "doc_id", groupName);
                }
            },
            //显示分组患者结果
            showPatientGroupResult: function (result) {
                if (result.errorNo == 0) {
                    $(this.el).find("#patient_group").bootstrapTable({
                        data: result.resData
                    })
                }
            },

            //显示患者历史病历
            showMedicalRecord: function (result) {
                if (result.errorNo == 0) {
                    $(this.el).find("#patient_detail").bootstrapTable({
                        data: result.resData
                    })
                }
            },

            //显示创建分组
            createGroup: function () {
                alert(1);
            }
        });

        return patientGroupView;
    });