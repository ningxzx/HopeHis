/**
 * Created by xiangzx on 15-11-12.
 */
define(['txt!../Common/sidebar.html',
        '../Statistical/outpatientCharges/outpatientChargesView',
        '../Statistical/drugSales/drugSalesView',
        '../Statistical/clinicFinancial/clinicFinancialView',
        '../Statistical/inspectionItem/inspectionItemView',
        '../Statistical/typicalDisease/typicalDiseaseView',
        '../Statistical/yearReport/yearReportView',
        '../Statistical/drugPurchase/drugPurchaseView',
        '../Statistical/purchaseReturn/purchaseReturnView',
        '../Statistical/outpatientService/outpatientServiceView',
        '../Statistical/workloadStatistics/workloadStatisticsView',
        '../Statistical/InventoryContrast/InventoryContrastView',
        '../Statistical/drugsTo/drugsToView',
        '../Statistical/prescriptionStatistics/prescriptionStatisticsView',
        '../Statistical/department/departmentView',
        'jquery','handlebars','backbone'],
    function (sidebarTemp,outpatientChargesView,drugSalesView,clinicFinancialView,inspectionItemView,typicalDiseaseView,yearReportView,drugPurchaseView,purchaseReturnView,outpatientServiceView,workloadStatisticsView,InventoryContrastView,drugsToView,prescriptionStatisticsView,departmentView,jquery,Handlebars,backbone){
        var sidebarData={
            topic:"统计",
            description:"财务统计,医疗指标统计,绩效统计,管理日志",
            submenus: [
                //{ spanClass: "am-icon-info", submenu: "门诊收费查询", sublink: "#statistical/outpatientCharges",subid:"statistical_outpatientCharges", parents: ""},
                //{ spanClass: "am-icon-info", submenu: "药品销售统计", sublink: "#statistical/drugSales",subid:"statistical_drugSales", parents: ""},
                { spanClass: "am-icon-wheelchair", submenu: "诊所财务统计", sublink: "#statistical/clinicFinancial",subid:"statistical_clinicFinancial",parents: ""},
                //{ spanClass: "am-icon-info", submenu: "检查项目统计", sublink: "#statistical/inspectionItem", subid:"statistical_inspectionItem",parents: ""},
                //{ spanClass: "am-icon-info", submenu: "典型疾病统计", sublink: "#statistical/typicalDisease", subid:"statistical_typicalDisease",parents: ""},
                { spanClass: "am-icon-bar-chart", submenu: "处方统计", sublink: "#statistical/prescriptionStatistics", subid:"statistical_prescriptionStatistics",parents: ""},
                { spanClass: "am-icon-align-justify", submenu: "年/月报表统计", sublink: "#statistical/yearReport", subid:"statistical_yearReport",parents: ""},
                { spanClass: "am-icon-list", submenu: "药品采购统计", sublink: "#statistical/drugPurchase", subid:"statistical_drugPurchase",parents: ""},
                //{ spanClass: "am-icon-info", submenu: "采购退货统计", sublink: "#statistical/purchaseReturn", subid:"statistical_purchaseReturn",parents: ""},
                //{ spanClass: "am-icon-info", submenu: "门诊日志查询", sublink: "#statistical/outpatientService", subid:"statistical_outpatientService",parents: ""},
                //{ spanClass: "am-icon-info", submenu: "工作量统计", sublink: "#statistical/workloadStatistics", subid:"statistical_workloadStatistics",parents: ""},
                //{ spanClass: "am-icon-info", submenu: "库存量对比", sublink: "#statistical/InventoryContrast", subid:"statistical_InventoryContrast",parents: ""},
                { spanClass: "am-icon-table", submenu: "药品去向统计", sublink: "#statistical/drugsTo", subid:"statistical_drugsTo",parents: ""},
                { spanClass: "am-icon-th", submenu: "科室统计", sublink: "#statistical/department", subid:"statistical_department",parents: ""},
            ]
        };
        var subviews={
            yearReport:yearReportView,
            outpatientCharges: outpatientChargesView,
            drugSales:drugSalesView,
            clinicFinancial:clinicFinancialView,
            inspectionItem:inspectionItemView,
            typicalDisease:typicalDiseaseView,
            drugPurchase:drugPurchaseView,
            purchaseReturn:purchaseReturnView,
            outpatientService:outpatientServiceView,
            workloadStatistics:workloadStatisticsView,
            InventoryContrast:InventoryContrastView,
            drugsTo:drugsToView,
            prescriptionStatistics:prescriptionStatisticsView,
            department:departmentView
        };
        var statisticalView = Backbone.View.extend({
            template : Handlebars.compile(sidebarTemp),

            render:function() {
                var paths=sessionStorage.getItem('menu_path');
                sidebarData.submenus=sidebarData.submenus.filter(function(menu){
                    return paths.indexOf(menu['sublink'])!=-1
                });
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
            /***点击子菜单回到子菜单原始页面***/
            reRender:function(e){
                //获取当前事件的 dom
                var submenuId=$(e.target).closest("li").attr("id").split("_")[1];
                //防止点击别的子菜单时再次渲染
                if(submenuId!==this.id){
                    return ;
                }
                //new 一个当前点击事件 的 view对象
                this.subview = new subviews[submenuId]();
                //执行对象里面的render属性
                this.subview.render();
                /***刷新amdin-content的内容,backbone会给el自动加一层div,因此直接取内层div的内容**/
                $(this.el).find(".admin-content").parent().html($(this.subview.el));
            }
        });
        return statisticalView;
    });
