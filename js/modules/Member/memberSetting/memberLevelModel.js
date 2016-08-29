define(['jquery', "backbone", 'jctLibs'],function($, Backbone, jctLibs) {
    var rootUrl = "http://114.55.85.57:8081";
    // 会员Model，包含会员的基本信息
    var memberSettingModel = Backbone.Model.extend({
        //消费统计
        getsetrecord: function (data) {
            var that = this;
            var result = {};
            var params=data||{};
            //params['enterprise_id']=sessionStorage.getItem('enterprise_id');
            $.ajax({
                type: "get",
                url: rootUrl + "/jethis/membersLevel/getsetrecord",
                data: params
            }).done(function (data) {
                result.errorNo = 0;
                result.rows=[];
                if(data['rows']) {
                    result.rows = jctLibs.listToObject(data, 'rows')['rows'];
                }
                that.trigger("getsetrecord", result);

            }).fail(function (error) {
                result.data = error;
                result.errorNo = -1;
                that.trigger("getsetrecord", result);
            });
        },

        //会员添加
        ///jethis/members/modifylevel
        postMember: function (level_id,level_name,level_discount
            ,pay_limit,level_score,level_state,level_mark,level_icon,ID) {
            var that = this;
            var result = {};
            var params={
                    "entity_id":sessionStorage.getItem('enterprise_id'),
                    "entity_name":sessionStorage.getItem('enterprise_name'),
                    "level":level_id,
                    "level_name":level_name,
                    "discount":parseFloat(level_discount),
                    "lowest_consume_pay":parseInt(pay_limit),
                    "points_condition":parseInt(level_score),
                    "level_state":level_state,
                    "remarks":level_mark,
                    "icon_name":level_icon,
                    "id":ID
                };
            //params['enterprise_id']=sessionStorage.getItem('enterprise_id');
            $.ajax({
                type: "post",
                url: rootUrl + "/jethis/membersLevel/newLevle",
                data:  JSON.stringify(params)
            }).done(function (data) {
                result.errorNo = 0;
                //result.rows = jctLibs.listToObject(data, 'rows')['rows'];
                result.rows=data;
                that.trigger("postMember", result);

            }).fail(function (error) {
                result.data = error;
                result.errorNo = -1;
                that.trigger("postMember", result);
            });
        },

        //等级编辑
        postedit: function (level_id,level_name,level_discount
            ,pay_limit,level_score,level_state,level_mark,level_icon,ID) {
            var that = this;
            var result = {};
            var params={
                "entity_id":sessionStorage.getItem('enterprise_id'),
                "entity_name":sessionStorage.getItem('enterprise_name'),
                "level":level_id,
                "level_name":level_name,
                "discount":parseFloat(level_discount),
                "lowest_consume_pay":parseInt(pay_limit),
                "points_condition":parseInt(level_score),
                "level_state":level_state,
                "remarks":level_mark,
                "icon_name":level_icon,
                "id":ID
            };
            //params['enterprise_id']=sessionStorage.getItem('enterprise_id');
            $.ajax({
                type: "patch",
                url: rootUrl + "/jethis/membersLevel/modifylevel/"+ID,
                data:  JSON.stringify(params)
            }).done(function (data) {
                result.errorNo = 0;
                //result.rows = jctLibs.listToObject(data, 'rows')['rows'];
                result.rows=data;
                that.trigger("postedit", result);

            }).fail(function (error) {
                result.data = error;
                result.errorNo = -1;
                that.trigger("postedit", result);
            });
        },

        //删除

        getdele: function (levelid) {
            var that = this;
            var result = {};
            var params={
                "entity_id":sessionStorage.getItem('enterprise_id'),
                "entity_name":sessionStorage.getItem('enterprise_name'),
                "level_id":levelid,

            };
            //params['enterprise_id']=sessionStorage.getItem('enterprise_id');
            $.ajax({
                type: "DELETE",
                url: rootUrl + "/jethis/membersLevel/dellevel/"+levelid,
                data:  params
            }).done(function (data) {
                result.errorNo = 0;
                //result.rows = jctLibs.listToObject(data, 'rows')['rows'];
                result.rows=data;
                that.trigger("getdele", result);

            }).fail(function (error) {
                result.data = error;
                result.errorNo = -1;
                that.trigger("getdele", result);
            });
        },
    });


    return memberSettingModel;

});


