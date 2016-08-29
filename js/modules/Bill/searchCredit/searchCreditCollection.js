define(["backbone",'../../Bill/searchCredit/searchCreditModel'], function (Backbone, searchCreditModel) {
    var searchCreditCollection = Backbone.Collection.extend({
        model: searchCreditModel,
        //url: "http://114.55.85.57:8081/charges",
        getData: function (executeId,diagnosisId,patientName,patientCode,startDate,endDate) {
            var that=this;
            var result={
                errorNo:0,//0为正确的值，其余值为错误
                responseData:"",
                errorInfo:""
            };
            this.fetch({
                url: "",
                reset: true,
                data: $.param({
                    execute_id:executeId,
                    diagnosis_id:diagnosisId,
                    patient_name:patientName,
                    patient_code:patientCode,
                    startDate:startDate,
                    endDate:endDate
                }),
                success: function (model, response) {
                    result.errorNo=0;
                    result.chargeRecord=response;
                    that.trigger("detail",result);

                },
                error: function (err, response) {
                    var responseText=$.parseJSON(err.responseText);
                    result.errorNo=responseText.code;
                    result.responseData=responseText.message;
                    that.trigger("detail",result);
                }
            })
        }
    });

    return searchCreditCollection;
});
