define(['backbone'],function(BackBone){
    var proxiedSync = Backbone.sync;
    Backbone.sync = function(method, model, options) {
        options || (options = {});
        var newMethod=method;
        if (!options.crossDomain) {
            options.crossDomain = true;
        }

        if (!options.xhrFields) {
            options.xhrFields = {withCredentials: false};
        }
        //options.headers = {
        //    "app-key": "fb98ab9159f51fd1",
        //    "Authorization": "123456-01"
        //}
        if(options.method==="update"){
            newMethod="update";
        }
        return proxiedSync(newMethod, model, options);
    }
});
