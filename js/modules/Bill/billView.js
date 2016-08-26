/**
 * Created by xiangzx on 15-11-12.
 */
define(['txt!../Common/sidebar.html',
        '../Bill/retailPricing/retailPricingView',
        '../Bill/afterPay/afterPayView',
        '../Bill/charge/chargeView',
        '../Bill/refund/refundView',
        '../Bill/dispense/dispenseView',
        '../Bill/searchCharge/searchChargeView',
        '../Bill/searchCredit/searchCreditView',
        '../Bill/searchRefund/searchRefundView',
        '../Bill/searchSettle/searchSettleView',
        '../Bill/settle/settleView',
        '../Bill/retailDrugRecord/retailDrugRecordView',
        'jquery','handlebars','backbone'],
    function (sidebarTemp,retailPricingView,afterPayView,chargeView,refundView,dispenseView,searchChargeView,searchCreditView,searchRefundView,searchSettleView,settleView,retailDrugRecordView,jquery,Handlebars,backbone){
        var sidebarData={
            topic:"财务管理",
            description:"收费退费,定期结账轧帐,管理赊账及补交欠款,处理坏账",
            submenus: [
                { spanClass: "am-icon-yelp", submenu: "收费", sublink: "#bill/charge", parents: "", subid: "bill_charge"},
                { spanClass: "am-icon-home", submenu: "退费", sublink: "#bill/refund", parents: "", subid: "bill_refund"},
                { spanClass: "am-icon-tty", submenu: "收费记录", sublink: "#bill/searchCharge", parents: "", subid: "bill_searchCharge"},
                { spanClass: "am-icon-tty", submenu: "退费记录", sublink: "#bill/searchRefund", parents: "", subid: "bill_searchRefund"},
                { spanClass: "am-icon-info", submenu: "补交欠款", sublink: "#bill/afterPay",parents: "", subid: "bill_afterPay"},
                { spanClass: "am-icon-facebook", submenu: "赊账查询", sublink: "#bill/searchCredit", parents: "", subid: "bill_searchCredit"},
                { spanClass: "am-icon-ship", submenu: "处方发药", sublink: "#bill/dispense", parents: "", subid: "bill_dispense"},
                { spanClass: "am-icon-paint-brush", submenu: "对账", sublink: "#bill/settle", parents: "", subid: "bill_settle"},
                { spanClass: "am-icon-apple", submenu: "对账纪录", sublink: "#bill/searchSettle", parents: "", subid: "bill_searchSettle"},
                { spanClass: "am-icon-paypal", submenu: "零售收费", sublink: "#bill/retailPricing", parents: "", subid: "bill_retailPricing"},
                { spanClass: "am-icon-lastfm", submenu: "零售记录", sublink: "#bill/retailDrugRecord", parents: "", subid: "bill_retailDrugRecord"}
            ]
        };
        var subviews={
            afterPay: afterPayView,
            charge: chargeView,
            refund: refundView,
            searchCharge: searchChargeView,
            dispense:dispenseView,
            searchCredit: searchCreditView,
            searchRefund: searchRefundView,
            searchSettle: searchSettleView,
            settle: settleView,
            retailPricing:retailPricingView,
            retailDrugRecord:retailDrugRecordView
        };
        var billView = Backbone.View.extend({
            template : Handlebars.compile(sidebarTemp),
            render:function() {
                var paths=sessionStorage.getItem('menu_path');
                sidebarData.submenus=sidebarData.submenus.filter(function(menu){
                    return paths.indexOf(menu['sublink'])!=-1
                })
                var sidebarHtml=this.template(sidebarData);
                $(this.el).append(sidebarHtml);
                if(this.id) {
                    var subview = new subviews[this.id]();
                    subview.render();
                    $(this.el).append(subview.el);
                }
                return this;
            },
            events:{
                "click .submenu":"reRender"
            },
            reRender:function(e){
                var submenuId=$(e.target).closest("li").attr("id").split("_")[1];
                if(submenuId!==this.id){
                    return ;
                }
                this.subview=new subviews[submenuId]();
                this.subview.render();
                $(this.el).find(".admin-content").parent().html($(this.subview.el));
            }
        });
        return billView;
    });
