/**
 * Created by xzx on 2016-07-08.
 */
define(['txt!../../Setting/functionSetting/functionSetting.html',
        '../../Setting/functionSetting/functionSettingModel',
        'backbone', 'underscore', 'intro', 'jctLibs', 'chosen', 'bootstrapTable'],
    function (Template, fsModel, backbone, _, intro, jctLibs) {
        var view = backbone.View.extend({
            initialize: function () {
                this.model = new fsModel();
                this.listenTo(this.model, "fsPost", this.postCallback);
                this.listenTo(this.model, "saveResult", this.saveCallback);
            },
            render: function () {
                var _this = this;
                $(this.el).html(Template);
                $("input[type='radio']").uCheck();
                return this;
            },
            events: {
                'change #medi_bill_apart': "postSetting",
                "click .save_price": "savePrice"
            },
            postSetting: function () {
                var apartVal = $('#medi_bill_apart').prop('checked') ? 0 : 1;
                this.model.postSetting({
                    enterprise_id: sessionStorage.getItem('enterprise_id'),
                    setting_result: JSON.stringify({FUN0001: apartVal})
                })
            },
            postCallback: function (res) {
                if (res.status == 'OK') {
                    alert('设置成功！')
                }
            },
            savePrice: function (e) {
                e.stopPropagation();
                this.model.saveWay({
                    enterprise_id: sessionStorage.getItem('enterprise_id'),
                    setting_result: JSON.stringify({FUN0003: $("input[name='price_way']:checked").val()})
                });
            },
            saveCallback: function (res) {
                if (res.status == 'OK') {
                    alert('设置成功！')
                }
            }
        });
        return view;
    });

