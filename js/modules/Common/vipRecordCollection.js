/**
 * Created by insomniahl on 15/12/21.
 */
define(['../Common/vipRecordModel', "backbone"],
    function (vipRecordModel, Backbone) {
        var vipRecordCollection = Backbone.Collection.extend({
            model: vipRecordModel

        });

        return vipRecordCollection;
    });