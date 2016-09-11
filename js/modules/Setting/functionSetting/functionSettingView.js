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
                this.listenTo(this.model, "getSetting", this.renderSetting)
            },
            render: function () {
                var _this = this;
                $(this.el).html(Template);
                this.model.getSetting();
                return this;
            },
            events: {
                'change #medi_bill_apart': "postSetting",
                "click .save_price": "savePrice",
                "click .pay_round_types li": "changeRoundType"
            },
            //获取该医院的功能设置
            renderSetting:function(res){
                if(res.errorNo==0){
                    var settings=res.settings;
                    var rount_type=settings['FUN0003'];
                    $(".pay_round_types li").removeClass("selected_type");
                    $(".pay_round_types li[type_value="+rount_type+"]").addClass("selected_type");
                }
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
            changeRoundType:function(e){
                var e=window.event||e,
                    $target=$(e.target).closest('li');
                $(".pay_round_types li").removeClass("selected_type");
                $target.addClass("selected_type");
            },
            savePrice: function (e) {
                var type_value= $(".pay_round_types li.selected_type").attr('type_value');
                this.model.postSetting({
                    enterprise_id: sessionStorage.getItem('enterprise_id'),
                    setting_result: JSON.stringify({FUN0003: type_value})
                });
            }
        });
        return view;
    });

