/**
 * Created by insomniahl on 15/12/7.
 */
define(["backbone"], function (Backbone) {
    var registerInfoModel = Backbone.Model.extend({
        default:{
            registNum:"",       //挂号人数
            mornDoctorNum:"",       //上午医生人数
            afterDoctorNum:"",       //下午医生人数
            nightDoctorNum:"",       //晚上医生人数
            preRegistNum:""       //预约挂号人数
        },
        idAttrbute:""
    });

    var registerInfoCollection = Backbone.Collection.extend({
        model: registerInfoModel,
        url: "http://URL/registerInfoes/"
    });

    return registerInfoCollection;
});