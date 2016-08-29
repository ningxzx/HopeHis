define(['jquery', "backbone", 'jctLibs'],function($, Backbone, jctLibs) {
    var rootUrl = "http://114.55.85.57:8081";
    var HospitalpatientsModel = Backbone.Model.extend({
        postHospital: function (data) {
            var that = this;
            var result = {};
            var params={
                patient_name: data.patient_name,
                patient_sex: data.patient_sex,
                patient_birth: data.patient_birth,
                marry_state: data.marry_state,
                card_id: data.card_id,
                patient_phone:data.patient_phone,
                patient_tel: data.patient_tel,
                patient_qq: data.patient_qq,
                patient_wechet: data.patient_wechet,
                patient_email:data.patient_email,
                nationaloty: data.nationaloty,
                province: data.province,
                city: data.city,
                area: data.area,
                addr: data.addr,
                next_of_kin: data.next_of_kin,
                next_of_kin_phone: data.next_of_kin_phone
            };

            $.ajax({
                type: "post",
                url: rootUrl + "/JetHis/Patch/patient",
                data:  JSON.stringify(params)
            }).done(function (data) {
                result.errorNo = 0;
                //result.rows = jctLibs.listToObject(data, 'rows')['rows'];
                result.rows=data;
                that.trigger("postHospital", result);

            }).fail(function (error) {
                result.data = error;
                result.errorNo = -1;
                that.trigger("postHospital", result);
            });
        },
        getPatient: function (param) {
            var that = this;
            var result = {
                errorNo: 0,//0为正确的值，其余值为错误
                errorInfo: ""
            };
            $.ajax({
                type: "get",
                url: 'http://114.55.85.57:8081/jethis/PatientRecord/Persinalinfo',
                data:param
            }).done(function (res) {
                result.errorNo = 0;
                result.rows = res;
                that.trigger("getPatient", result);

            }).fail(function (err, response) {
                var responseText = $.parseJSON(err.responseText);
                result.errorNo = responseText.code;
                result.responseData = responseText.message;
                that.trigger("getPatient", result);

            })
        },

    });

    return HospitalpatientsModel;

});


