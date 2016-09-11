define(['jquery', "backbone", 'jctLibs'],function($, Backbone, jctLibs) {
    var rootUrl = "http://192.168.0.220:8081";
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
                url: rootUrl+'/jethis/PatientRecord/Persinalinfo',
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
        patchPat:function (pat_id,data) {
            var that = this,param=data||{};
            var result = {};
            $.ajax({
                type: "patch",
                url: rootUrl + '/jethis/registeration/patchPatientInfo/' + pat_id,
                data: JSON.stringify(param),
                success: function (res) {
                    result= res;
                    that.trigger("patchPatient", result);
                }
            })
        },
        getProvince:function () {
            var that = this,result = {};
            $.ajax({
                type: "get",
                url: rootUrl + '/jethis/registeration/getdictprovincebycountry',
                success: function (res) {
                    result= res.rows;
                    that.trigger("getProvince", result);
                }
            })
        },
        getCity:function (code) {
            var that = this,result = {};
            $.ajax({
                type: "get",
                url: rootUrl + '/jethis/registeration/getdictcitybyprovince?province_code=' + code,
                success: function (res) {
                    result= res.rows;
                    that.trigger("getCity", result);
                }
            })
        },
        getArea:function (code) {
            var that = this,result = {};
            $.ajax({
                type: "get",
                url: rootUrl + '/jethis/registeration/getdictdistrictbycity?city_code=' + code,
                success: function (res) {
                    result= res.rows;
                    that.trigger("getArea", result);
                }
            })
        },

    });

    return HospitalpatientsModel;

});


