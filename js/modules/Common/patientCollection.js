/**
 * Created by insomniahl on 15/11/28.
 */
define(['../Common/patientModel','jctLibs',"backbone"],
    function (patientModel,jctLibs, Backbone) {
        var patientCollection = Backbone.Collection.extend({
            model: patientModel,
            url: "http://URL/patients"

        });

        return patientCollection;
});