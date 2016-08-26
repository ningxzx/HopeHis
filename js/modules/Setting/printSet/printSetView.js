define(['txt!../../Setting/printSet/printSet.html',
        'handlebars','backbone','bootstrapTable'],
    function (Template,Handlebars,backbone){
        var view = Backbone.View.extend({
            render:function() {
                $(this.el).append(Template);
                this.$el.find("#xzx").bootstrapTable({
                    data: {}
                });
                return this;
            },
            events:{

                "click #refund_show":"refundShow",
                "click #repay_show":"repayShow",
                "click #repay_recode_show":"repayRecodeShow",
                "click #Direct_purchase_show":"DirectPurchaseShow",
                "click #Drug1_show":"Drug1Show",
                "click #Drug2_show":"Drug2Show",
                "click #Drug3_show":"Drug3Show",
                "click #Drug4_show":"Drug4Show",
                "click #Drug5_show":"Drug5how",
                "click #Drug6_show":"Drug6Show",
                "click #Drug7_show":"Drug7Show",
                "click #Drug8_show":"Drug8Show",
                "click #Drug9_show":"Drug9Show",
                "click #Drug10_show":"Drug10Show",
                "click #Drug11_show":"Drug11Show"
            },
            Drug1Show:function(){
                this.tabChange("#menu_pay", "#Drug1_show", "#Drug1");
            },
            Drug2Show:function(){
                this.tabChange("#menu_pay", "#Drug2_show", "#Drug2");
            },
            Drug3Show:function(){
                this.tabChange("#menu_pay", "#Drug3_show", "#Drug3");
            },
            Drug4Show:function(){
                this.tabChange("#menu_pay", "#Drug4_show", "#Drug4");
            },
            Drug5Show:function(){
                this.tabChange("#menu_pay", "#Drug5_show", "#Drug5");
            },
            Drug6Show:function(){
                this.tabChange("#menu_pay", "#Drug6_show", "#Drug6");
            },
            Drug7Show:function(){
                this.tabChange("#menu_pay", "#Drug7_show", "#Drug7");
            },
            Drug8Show:function(){
                this.tabChange("#menu_pay", "#Drug8_show", "#Drug8");
            },
            Drug9Show:function(){
                this.tabChange("#menu_pay", "#Drug9_show", "#Drug9");
            },
            Drug10Show:function(){
                this.tabChange("#menu_pay", "#Drug10_show", "#Drug10");
            },
            Drug11Show:function(){
                this.tabChange("#menu_pay", "#Drug11_show", "#Drug11");
            },
            DirectPurchaseShow:function(){
                this.tabChange("#menu_pay", "#Direct_purchase_show", "#Direct_purchase");
            },
            refundShow: function () {
                this.tabChange("#menu_pay", "#refund_show", "#refund");

            },
            repayShow: function () {
                this.tabChange("#menu_pay", "#repay_show", "#repay");
            },
            repayRecodeShow: function () {
                this.tabChange("#menu_pay", "#repay_recode_show", "#repay_recode");
            },
            tabChange: function (ul_id, target_li, target_div) {
                var li = $(ul_id).children('li');
                for(var j=0; j<li.length; j++){
                    li.removeClass("am-active");
                }
                $(target_li).addClass("am-active");
                var div = $(".am-tabs-bd").children('div.am-tab-panel');
                for(var i=0; i<div.length; i++){
                    div.removeClass("am-active");
                }
                $(target_div).addClass("am-active");
            },
            refund_search: function(){

            }
        });
        return view;
    });
