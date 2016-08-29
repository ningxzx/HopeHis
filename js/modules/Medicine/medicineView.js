define(['txt!../Common/sidebar.html',
        '../Medicine/mcurStorage/mcurStorageView',
        '../Medicine/mdictionary/mdictionaryView',
        '../Medicine/minCheck/minCheckView',
        '../Medicine/minStorage/minStorageView',
        '../Medicine/mnumChange/mnumChangeView',
        '../Medicine/mpriceChange/mpriceChangeView',
        '../Medicine/mverify/mverifyView',
        '../Medicine/mverifyLog/mverifyLogView',
        '../Medicine/msupplier/msupplierView',
        '../Medicine/mWarning/mWarningView',
        '../Medicine/drugPriceAudit/drugPriceAuditView',
        '../Medicine/purchaseReturn/purchaseReturnView',
        '../Medicine/returnCheck/returnCheckView',
        '../Medicine/drugLoss/drugLossView',
        '../Medicine/reportLossReview/reportLossReviewView',
        'jquery', 'handlebars', 'backbone'],
    function (sidebarTemp, mcurStorageView, mdictionaryView, minCheckView, minStorageView, mnumChangeView, mpriceChangeView, mverifyView,mverifyLogView, msupplierView, mWarningView, drugPriceAuditView, purchaseReturnView, returnCheckView, drugLossView, reportLossReviewView, jquery, Handlebars, backbone) {
        var sidebarData = {
            topic: "药品",
            description: "入库出库,管理库存,药品预警,监控与复核库存变化",
            submenus: [
                {
                    spanClass: "am-icon-bar-chart", submenu: "库存查询", subid: "medicine_mcurStorage",
                    sublink: "#medicine/mcurStorage", parents: ""
                },
                {
                    spanClass: "am-icon-bell", submenu: "药品预警", sublink: "#medicine/mwarning",
                    subid: "medicine_mwarning", parents: ""},
                {
                    spanClass: "am-icon-cog", submenu: "药品信息管理", sublink: "#medicine/mdictionary",
                    subid: "medicine_mdictionary", parents: ""
                },
                {
                    spanClass: "am-icon-user", submenu: "供应商", sublink: "#medicine/msupplier",
                    subid: "medicine_msupplier", parents: ""
                },
                {
                    spanClass: "am-icon-area-chart", submenu: "采购入库", sublink: "#medicine/minStorage",
                    subid: "medicine_minStorage", parents: ""
                },
                {
                    spanClass: "am-icon-align-justify",
                    submenu: "入库审核",
                    sublink: "#medicine/minCheck",
                    subid: "medicine_minCheck",
                    parents: ""
                },
                {
                    spanClass: "am-icon-pie-chart",
                    submenu: "库存盘点",
                    subid: "medicine_mverify",
                    sublink: "#medicine/mverify",
                    parents: ""
                },
                { spanClass: "am-icon-file-text-o",   subid: "medicine_mverifyLog",submenu: "盘点日志", sublink: "#medicine/mverifyLog", parents: ""},
                {
                    spanClass: "am-icon-search",
                    submenu: "库存变动查询",
                    subid: "medicine_mnumChange",
                    sublink: "#medicine/mnumChange",
                    parents: ""
                },
                {
                    spanClass: "am-icon-cny",
                    submenu: "药品调价",
                    subid: "medicine_mpriceChange",
                    sublink: "#medicine/mpriceChange",
                    parents: ""
                },
                {
                    spanClass: "am-icon-codepen",
                    submenu: "调价记录",
                    subid: "medicine_drugPriceAudit",
                    sublink: "#medicine/drugPriceAudit",
                    parents: ""
                },
                //{
                //    spanClass: "am-icon-empire",
                //    submenu: "采购退货",
                //    subid: "medicine_purchaseReturn",
                //    sublink: "#medicine/purchaseReturn",
                //    parents: ""
                //},
                //{
                //    spanClass: "am-icon-apple",
                //    submenu: "退货复核",
                //    subid: "medicine_returnCheck",
                //    sublink: "#medicine/returnCheck",
                //    parents: ""
                //},
                //{
                //    spanClass: "am-icon-slack",
                //    submenu: "药品报损",
                //    subid: "medicine_drugLoss",
                //    sublink: "#medicine/drugLoss",
                //    parents: ""
                //},
                //{
                //    spanClass: "am-icon-ioxhost",
                //    submenu: "报损复核",
                //    subid: "medicine_reportLossReview",
                //    sublink: "#medicine/reportLossReview",
                //    parents: ""
                //}
            ]
        };
        var subviews = {
            mcurStorage: mcurStorageView,
            mdictionary: mdictionaryView,
            minCheck: minCheckView,
            minStorage: minStorageView,
            mnumChange: mnumChangeView,
            mpriceChange: mpriceChangeView,
            mverify: mverifyView,
            mverifyLog:mverifyLogView,
            msupplier: msupplierView,
            drugPriceAudit: drugPriceAuditView,
            purchaseReturn: purchaseReturnView,
            returnCheck: returnCheckView,
            drugLoss: drugLossView,
            reportLossReview: reportLossReviewView,
            mwarning: mWarningView
        };
        var medicineView = Backbone.View.extend({
            initialize: function () {

            },
            template: Handlebars.compile(sidebarTemp),
            events: {
                "click .submenu": "reRender"
            },
            /***点击子菜单回到子菜单原始页面***/
            reRender: function (e) {
                var submenuId = $(e.target).closest("li").attr("id").split("_")[1];
                //防止点击别的子菜单时再次渲染
                if (submenuId !== this.id) {
                    return;
                }
                this.subview = new subviews[submenuId]();
                this.subview.render();
                /***刷新amdin-content的内容,backbone会给el自动加一层div,因此直接取内层div的内容**/
                $(this.el).find(".admin-content").parent().html($(this.subview.el));
            },
            render: function () {
                var paths=sessionStorage.getItem('menu_path');
                sidebarData.submenus=sidebarData.submenus.filter(function(menu){
                    return paths.indexOf(menu['sublink'])!=-1
                })
                var sidebarHtml = this.template(sidebarData);
                $(this.el).append(sidebarHtml);
                if (this.id) {
                    this.subview = new subviews[this.id]();
                    this.subview.render();
                    $(this.el).append($(this.subview.el));
                }

                return this;
            }
        });
        return medicineView;
    });
