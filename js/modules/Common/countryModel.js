/**
 * Created by insomniahl on 15/12/1.
 */
define(['backbone'], function (Backbone) {
    var countryModel = Backbone.Model.extend({
        defaults:{
            sex_code:"",
            sex_name:""
        },
        idAttrubute:""
    });

    var countryCollection = Backbone.Collection.extend({
        model: countryModel,
        url: "http://URL/countrys/"
    });
    return countryCollection;
});