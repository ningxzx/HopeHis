define(['txt!../../Medicine/reportLossReview/reportLossReview.html',
        'handlebars','backbone','bootstrapTable'],
    function (Template,Handlebars,backbone){
        var view = Backbone.View.extend({
            render:function() {
                $(this.el).html(Template);

                this.$el.find("#xzx").bootstrapTable({
                    data: {}
                });
                return this;
            },
            events:{

                "click #refund_show":"refundShow",
                "click #repay_show":"repayShow"

            },
            refundShow: function () {
                this.tabChange("#menu_pay", "#refund_show", "#refund");

            },
            repayShow: function () {
                this.tabChange("#menu_pay", "#repay_show", "#repay");
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
